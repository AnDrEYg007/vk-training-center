from sqlalchemy.orm import Session
from typing import List, Dict, Set
import models

def get_all_accounts(db: Session) -> List[models.SystemAccount]:
    return db.query(models.SystemAccount).all()

def get_existing_vk_ids(db: Session) -> Set[int]:
    results = db.query(models.SystemAccount.vk_user_id).all()
    return {r[0] for r in results}

def get_active_account_tokens(db: Session) -> List[str]:
    """Возвращает список токенов аккаунтов со статусом 'active'."""
    results = db.query(models.SystemAccount.token).filter(
        models.SystemAccount.status == 'active',
        models.SystemAccount.token.isnot(None)
    ).all()
    return [r[0] for r in results if r[0]]

def create_accounts(db: Session, accounts: List[Dict]):
    if not accounts:
        return
    db.bulk_insert_mappings(models.SystemAccount, accounts)
    db.commit()

def update_account(db: Session, account_id: str, updates: Dict) -> models.SystemAccount:
    account = db.query(models.SystemAccount).filter(models.SystemAccount.id == account_id).first()
    if account:
        for key, value in updates.items():
            setattr(account, key, value)
        db.commit()
        db.refresh(account)
    return account

def delete_account(db: Session, account_id: str) -> bool:
    result = db.query(models.SystemAccount).filter(models.SystemAccount.id == account_id).delete()
    db.commit()
    return result > 0