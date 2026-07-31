import os
import uuid
import logging
from collections import deque
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# Filter out empty or placeholder API keys from env
_loaded_keys = [
    key for key in [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY")
    ] if key and "YOUR_" not in key
]

# Fallback to single key or empty list if none set
API_KEYS: List[str] = _loaded_keys if _loaded_keys else [os.getenv("GEMINI_API_KEY", "")]
current_key_index = 0

# Mock Database Store for Limits & Logs
usage_db: Dict[str, Any] = {"count": 0, "limit": 10, "plan": "free"}
history_db: deque = deque(maxlen=20)  # Automatically drops oldest items past maxlen


def get_gemini_api_key() -> str:
    """Returns current active Gemini API Key from rotation pool."""
    global current_key_index
    if not API_KEYS or not API_KEYS[0]:
        logger.warning("No valid Gemini API key found in environment variables.")
        return ""
    return API_KEYS[current_key_index]


def rotate_gemini_key() -> str:
    """Rotates to the next available API key in the pool."""
    global current_key_index
    if len(API_KEYS) > 1:
        current_key_index = (current_key_index + 1) % len(API_KEYS)
        logger.info(f"[Database] Rotated to API Key Index: {current_key_index}")
    return get_gemini_api_key()


def get_usage() -> Dict[str, Any]:
    """Retrieves usage metrics."""
    return usage_db


def increment_usage() -> Dict[str, Any]:
    """Increments request usage count."""
    usage_db["count"] += 1
    return usage_db


def get_history_logs() -> List[Dict[str, Any]]:
    """Returns recent history items as a list."""
    return list(history_db)


def add_history_log(action_type: str, input_text: str, output_text: str) -> Dict[str, Any]:
    """Appends new interaction log to memory store."""
    truncated_input = input_text[:100] + "..." if len(input_text) > 100 else input_text
    
    log_entry = {
        "id": str(uuid.uuid4()),
        "type": action_type,
        "input_text": truncated_input,
        "output": output_text,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    history_db.appendleft(log_entry)  # Newest first
    return log_entry


def delete_history_log(item_id: str) -> bool:
    """Deletes log entry by UUID."""
    global history_db
    initial_len = len(history_db)
    filtered = [item for item in history_db if item["id"] != item_id]
    
    if len(filtered) < initial_len:
        history_db = deque(filtered, maxlen=20)
        return True
    return False