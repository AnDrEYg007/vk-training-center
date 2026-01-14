from schemas.general_contests import GeneralContestUpdatePayload, GeneralContestUpdate
from datetime import datetime
import json

payload_dict = {
    "contest_id": "some-uuid",
    "contest": {
        "name": "Test Contest",
        "is_active": True,
        "post_text": "Some text",
        "post_media": "[]",
        "start_date": "2025-12-30T12:00:00.000Z",
        "conditions_schema": "[]",
        "finish_type": "date",
        "finish_date": "2025-12-31T12:00:00.000Z",
        "finish_duration_hours": None,
        "winners_count": 1,
        "one_prize_per_person": True,
        "is_cyclic": False,
        "restart_delay_hours": 24,
        "template_result_post": "Result",
        "template_dm": "DM",
        "template_fallback_comment": "Fallback"
    }
}

try:
    model = GeneralContestUpdatePayload(**payload_dict)
    print("Validation Successful")
    print(model.dict())
except Exception as e:
    print("Validation Failed")
    print(e)
