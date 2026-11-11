"""Exercise the installed native browser tool without a model."""
import json
import os
from pathlib import Path
import sys
import time
import uuid

request = json.loads(Path(sys.argv[1]).read_text())
work = Path(request["work"])
from hermes_constants import set_hermes_home_override
set_hermes_home_override(os.environ["HERMES_HOME"])
from tools.browser_session import get_session_info, _atexit_cleanup
from tools.browser_use_cli import browser_exec, stop_harness_daemons, _backend_cache_key

try:
    task_id = str(uuid.uuid4())
    session = get_session_info(_backend_cache_key(task_id))
    if request.get("preload"):
        browser_exec(request["preload"], task_id=task_id)
    (work / "prepared.json").write_text(json.dumps({"cdp_url": session["cdp_url"]}))
    deadline = time.monotonic() + 60
    while not (work / "go").exists():
        if time.monotonic() > deadline:
            raise TimeoutError("fixture preparation timed out")
        time.sleep(0.05)
    result = browser_exec(request["code"], task_id=task_id)
    from tools.browser_session import _active_sessions
    (work / "reply.json").write_text(json.dumps({"result": result, "native_sessions": len(_active_sessions)}))
    while not (work / "done").exists():
        if time.monotonic() > deadline:
            raise TimeoutError("fixture observation timed out")
        time.sleep(0.05)
finally:
    stop_harness_daemons()
    _atexit_cleanup()
