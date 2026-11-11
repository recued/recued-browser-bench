"""Drive the supported AIAgent API with a fresh native local-browser session."""
import importlib.util
import json
import os
from pathlib import Path
import sys
import time
import traceback
import uuid

request = json.loads(Path(sys.argv[1]).read_text())
work = Path(request["work"])
spec = importlib.util.spec_from_file_location("bench_observer", Path(__file__).with_name("observe.py"))
observer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(observer)
emit = observer.emit


def save(name, value):
    path = work / name
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, default=str))
    temporary.replace(path)


agent = None
try:
    from hermes_constants import set_hermes_home_override
    set_hermes_home_override(os.environ["HERMES_HOME"])
    from tools.browser_session import get_session_info
    from tools.browser_use_cli import browser_exec, _backend_cache_key
    session_id = str(uuid.uuid4())
    session = get_session_info(_backend_cache_key(session_id))
    def publish_browsers():
        # Read existing native sessions only. Never create or navigate a browser.
        from tools.browser_session import _active_sessions, _cleanup_lock
        with _cleanup_lock:
            endpoints = [row["cdp_url"] for row in _active_sessions.values() if row.get("cdp_url")]
        save("browser-endpoints.json", endpoints)

    warm = browser_exec('print("browser ready")', task_id=session_id)
    publish_browsers()
    save("prepared.json", {"cdp_url": session["cdp_url"], "warmup": warm})
    deadline = time.monotonic() + 90
    while not (work / "go").exists():
        if time.monotonic() > deadline:
            raise TimeoutError("browser observer preparation timed out")
        time.sleep(0.05)
    started = time.time()
    emit("turn_start", started_at=started)
    from run_agent import AIAgent
    from tools.approval_yolo import toggle_session_yolo
    config = request["config"]
    toggle_session_yolo(session_id, True)

    def tool_start(call_id, name, args):
        emit("tool", name=name, phase="start", call_id=call_id, args=args)

    def tool_complete(call_id, name, args, result):
        emit("tool", name=name, phase="result", call_id=call_id, args=args, result=result)
        publish_browsers()

    agent = AIAgent(
        model=config["model"], provider="custom", api_mode="chat_completions",
        base_url=request["gateway"]["baseUrl"], api_key=os.environ["BENCH_GATEWAY_KEY"],
        session_id=session_id, platform="cli", cwd=str(work / "workspace"),
        disabled_toolsets=["web", "search", "vision", "image_gen", "tts", "memory",
                           "session_search", "delegation", "cronjob"],
        max_tokens=config["maxOutputTokens"], run_budget_seconds=config["maxSeconds"],
        reasoning_config={"enabled": config["thinking"] == "on"},
        request_overrides={"temperature": config["temperature"]},
        skip_memory=True, skip_background_review=True,
        tool_start_callback=tool_start, tool_complete_callback=tool_complete,
        stream_delta_callback=lambda text: emit("assistant_delta", characters=len(text)) if text else None,
    )
    emit("native_ready", tools=[tool.get("function", {}).get("name") for tool in agent.tools])
    result = agent.run_conversation(request["task"]["ask"], task_id=session_id)
    ended = time.time()
    counters = {key: getattr(agent, key, None) for key in (
        "session_prompt_tokens", "session_completion_tokens", "session_api_calls",
        "session_input_tokens", "session_output_tokens", "session_cache_read_tokens",
    )}
    save("native.json", {"result": {key: value for key, value in result.items() if key != "messages"},
                         "counters": counters, "started_at": started, "ended_at": ended})
    emit("turn_end", ended_at=ended)
except BaseException as error:
    save("native-error.json", {"error": f"{type(error).__name__}: {error}"})
    traceback.print_exc()
finally:
    # Persist before closing: cleanup must not extend the answer clock.
    if agent is not None:
        try:
            agent.close()
        except Exception:
            pass
    try:
        from tools.browser_use_cli import stop_harness_daemons
        stop_harness_daemons()
        from tools.browser_session import _atexit_cleanup
        _atexit_cleanup()
    except Exception:
        pass
