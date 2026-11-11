"""Observer-only Hermes lifecycle plugin. Never changes requests or tool results."""
import json
import os
import threading
import time

_lock = threading.Lock()
_fields = (
    "api_request_id", "retry_count", "api_call_count", "aux_task", "model",
    "provider", "api_mode", "started_at", "ended_at", "api_duration",
    "first_chunk_at", "finish_reason", "usage", "context_length", "error",
    "status_code", "streaming", "tool_count", "message_count",
    "request_char_count", "assistant_content_chars", "assistant_tool_call_count",
)


def emit(kind, **data):
    row = {"kind": kind, "observed_at": time.time(), **data}
    with _lock, open(os.environ["BENCH_HERMES_EVENTS"], "a") as stream:
        stream.write(json.dumps(row, default=str) + "\n")


def register(ctx):
    for name in ("pre_api_request", "post_api_request", "api_request_error",
                 "pre_auxiliary_call", "post_auxiliary_call"):
        def observe(_name=name, **payload):
            emit(_name, **{key: payload[key] for key in _fields if key in payload})
        ctx.register_hook(name, observe)
    emit("observer_registered")
