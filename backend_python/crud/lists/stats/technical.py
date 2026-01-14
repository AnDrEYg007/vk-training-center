
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
import time

def get_platform_stats(db: Session, model, project_id: str) -> dict:
    stats = {}
    if not hasattr(model, 'platform'):
        return stats

    try:
        platform_counts = db.query(model.platform, func.count(model.id)).filter(model.project_id == project_id).group_by(model.platform).all()
        for platform, count in platform_counts:
            key = str(platform) if platform else "unknown"
            stats[key] = count
    except Exception as e:
        print(f"Error calculating platform stats: {e}")
    return stats

def get_online_stats(db: Session, model, project_id: str) -> dict:
    stats = {
        "today": 0, "3_days": 0, "week": 0, 
        "month_plus": 0, "3_months_plus": 0, "6_months_plus": 0, "year_plus": 0, 
        "unknown": 0
    }
    
    now_ts = int(time.time())
    day_sec = 86400
    
    ts_today_start = now_ts - day_sec
    ts_3_days = now_ts - (3 * day_sec)
    ts_week = now_ts - (7 * day_sec)
    ts_month = now_ts - (30 * day_sec)
    ts_3_months_int = now_ts - (90 * day_sec)
    ts_6_months_int = now_ts - (180 * day_sec)
    ts_year_int = now_ts - (365 * day_sec)

    try:
        online_case = db.query(
            func.sum(case((model.last_seen.is_(None), 1), else_=0)).label('unknown'),
            func.sum(case((model.last_seen >= ts_today_start, 1), else_=0)).label('today'),
            func.sum(case((and_(model.last_seen < ts_today_start, model.last_seen >= ts_3_days), 1), else_=0)).label('3_days'),
            func.sum(case((and_(model.last_seen < ts_3_days, model.last_seen >= ts_week), 1), else_=0)).label('week'),
            func.sum(case((model.last_seen < ts_month, 1), else_=0)).label('month_plus'),
            func.sum(case((model.last_seen < ts_3_months_int, 1), else_=0)).label('3_months_plus'),
            func.sum(case((model.last_seen < ts_6_months_int, 1), else_=0)).label('6_months_plus'),
            func.sum(case((model.last_seen < ts_year_int, 1), else_=0)).label('year_plus'),
        ).filter(model.project_id == project_id).first()
        
        if online_case:
            stats["unknown"] = online_case[0] or 0
            stats["today"] = online_case[1] or 0
            
            val_today = online_case[1] or 0
            val_3days_interval = online_case[2] or 0
            val_week_interval = online_case[3] or 0
            
            stats["3_days"] = val_today + val_3days_interval 
            stats["week"] = stats["3_days"] + val_week_interval
            
            stats["month_plus"] = online_case[4] or 0
            stats["3_months_plus"] = online_case[5] or 0
            stats["6_months_plus"] = online_case[6] or 0
            stats["year_plus"] = online_case[7] or 0
    except Exception:
        pass
    return stats
