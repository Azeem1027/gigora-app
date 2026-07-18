import os

# State tracking for API Key Rotation Pool
API_KEYS = [
    os.getenv("GEMINI_API_KEY_1", "YOUR_PRIMARY_API_KEY_HERE"),
    os.getenv("GEMINI_API_KEY_2", "YOUR_BACKUP_API_KEY_HERE")
]
current_key_index = 0

# Mock Database Store for Limits & Logs
usage_db = {"count": 0, "limit": 10, "plan": "free"}
history_db = []

def get_gemini_api_key() -> str:
    global current_key_index
    return API_KEYS[current_key_index]

def rotate_gemini_key():
    global current_key_index
    current_key_index = (current_key_index + 1) % len(API_KEYS)
    print(f"[Database] Rotated to API Key Index: {current_key_index}")

def get_usage():
    return usage_db

def increment_usage():
    usage_db["count"] += 1
    return usage_db

def get_history_logs():
    return history_db

def add_history_log(action_type: str, input_text: str, output_text: str):
    import uuid
    from datetime import datetime
    log_entry = {
        "id": str(uuid.uuid4()),
        "type": action_type,
        "input_text": input_text[:100] + "..." if len(input_text) > 100 else input_text,
        "output": output_text,
        "created_at": datetime.utcnow().isoformat()
    }
    history_db.insert(0, log_entry)  # Prepend to show newest first
    if len(history_db) > 20:
        history_db.pop()
    return log_entry

def delete_history_log(item_id: str) -> bool:
    global history_db
    initial_len = len(history_db)
    history_db = [item for item in history_db if item["id"] != item_id]
    return len(history_db) < initial_len