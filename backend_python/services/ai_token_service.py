
from sqlalchemy.orm import Session
from typing import List

import crud.ai_token_crud as ai_token_crud
import crud.ai_log_crud as ai_log_crud
import schemas

def get_all_tokens(db: Session) -> List[schemas.AiToken]:
    tokens = ai_token_crud.get_all_tokens(db)
    stats_map = ai_log_crud.get_all_stats_map(db)
    
    result = []
    for t in tokens:
        token_model = schemas.AiToken.model_validate(t, from_attributes=True)
        if t.id in stats_map:
            token_model.stats = stats_map[t.id]
        else:
            token_model.stats = {'success': 0, 'error': 0}
        result.append(token_model)
        
    return result

def update_tokens(db: Session, tokens_data: List[schemas.AiToken]):
    ai_token_crud.update_tokens(db, tokens_data)

def delete_token(db: Session, token_id: str):
    ai_token_crud.delete_token(db, token_id)
