"""Adapted from browser-agent-bench/harness/browser-use/measure.py (AGPL-3.0).

One process, one task; framework-native usage/history, judge and vision disabled.
The parent owns grading, timeouts, the fixture event oracle and redaction.
"""
import asyncio
import json
import os
import sys
import time
from pathlib import Path

os.environ['ANONYMIZED_TELEMETRY'] = 'false'
os.environ['BROWSER_USE_CLOUD_SYNC'] = 'false'
os.environ['BROWSER_USE_CLOUD_HINTS'] = 'false'
os.environ['BROWSER_USE_LOGGING_LEVEL'] = 'error'

from browser_use import Agent, BrowserProfile, ChatOpenAI


async def measure(request):
    config = request['config']
    work = Path(request['work'])
    task = request['task']
    downloads = work / 'downloads'
    downloads.mkdir(exist_ok=True)
    files = []
    if task.get('attach'):
        attachment = task['attach']
        path = work / attachment['filename']
        path.write_text(attachment['text'])
        files.append(str(path))
    llm = ChatOpenAI(
        model=config['model'], base_url=request['gateway']['baseUrl'],
        api_key=os.environ['BENCH_GATEWAY_KEY'], temperature=config['temperature'],
        frequency_penalty=config.get('frequencyPenalty', 0), max_completion_tokens=config['maxOutputTokens'],
    )
    profile = BrowserProfile(
        executable_path=request['installation']['chromium'], headless=True,
        user_data_dir=str(work / 'profile'), keep_alive=False, downloads_path=str(downloads),
        use_cloud=False, enable_default_extensions=False, viewport={'width': 1280, 'height': 900},
    )
    agent = Agent(task=task['ask'], llm=llm, browser_profile=profile,
                  use_judge=False, use_vision=False, available_file_paths=files)
    timed_out = False
    failure = None
    launch_started = time.time()
    started = None
    try:
        # Native history timestamps synthetic step 0 only AFTER its automatic
        # initial navigation. Start the blank browser first so that navigation
        # is included in the answer clock while browser launch remains outside.
        await asyncio.wait_for(agent.browser_session.start(), timeout=120)
        started = time.time()
        await asyncio.wait_for(agent.run(max_steps=config['maxSteps']), timeout=config['maxSeconds'])
    except asyncio.TimeoutError:
        timed_out = True
    except Exception as error:
        failure = f'{type(error).__name__}: {str(error)[:400]}'
    history = agent.history
    try:
        history.usage = await agent.token_cost_service.get_usage_summary()
    except Exception:
        pass
    usage = history.usage
    timed = [entry.metadata for entry in history.history if entry.metadata is not None]
    answer = history.final_result() or ''
    actions = history.action_names()
    uploaded = False
    for entry in history.history:
        for action, outcome in zip(getattr(entry.model_output, 'action', []) or [], entry.result):
            upload = action.model_dump(exclude_none=True).get('upload_file')
            if upload and not outcome.error and files and os.path.realpath(upload.get('path', '')) == os.path.realpath(files[0]):
                uploaded = True
    errors = [str(error) for error in history.errors() if error]
    steps = history.number_of_steps()
    saved = [{'name': path.name, 'size_bytes': path.stat().st_size} for path in downloads.rglob('*') if path.is_file()]
    result = {
        'answer': answer, 'timed_out': timed_out,
        'error': failure or (None if history.is_done() else 'agent did not finish'),
        'seconds': timed[-1].step_end_time - started if timed and started else None,
        'launch_seconds': started - launch_started if started else None,
        'steps': steps, 'rounds': max(0, steps - 1),
        'tokens': None if usage is None else {
            'input': usage.total_prompt_tokens, 'cached': usage.total_prompt_cached_tokens,
            'output': usage.total_completion_tokens,
        },
        'approvals': 0, 'actions': actions,
        'evidence': {
            'uploaded': uploaded,
            'saved_file': any(file['size_bytes'] == 12499601 for file in saved),
            'files': saved, 'agent_errors': errors,
        },
    }
    try:
        await asyncio.wait_for(agent.close(), timeout=15)
    except Exception:
        pass
    return result


async def main():
    request = json.loads(Path(sys.argv[1]).read_text())
    try:
        result = await measure(request)
    except Exception as error:
        result = {'answer': '', 'seconds': None, 'rounds': None, 'tokens': None,
                  'timed_out': False, 'error': f'{type(error).__name__}: {str(error)[:400]}'}
    Path(sys.argv[2]).write_text(json.dumps(result))


if __name__ == '__main__':
    asyncio.run(main())
