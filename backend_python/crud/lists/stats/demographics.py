
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime
from typing import Dict

def get_gender_stats(db: Session, model, project_id: str) -> Dict[str, int]:
    stats = {"male": 0, "female": 0, "unknown": 0}
    try:
        gender_counts = db.query(model.sex, func.count(model.id)).filter(model.project_id == project_id).group_by(model.sex).all()
        for sex, count in gender_counts:
            if sex == 1: stats["female"] = count
            elif sex == 2: stats["male"] = count
            else: stats["unknown"] = count
    except Exception:
        pass
    return stats

def get_geo_stats(db: Session, model, project_id: str) -> Dict[str, int]:
    stats = {}
    try:
        city_counts = db.query(model.city, func.count(model.id))\
            .filter(model.project_id == project_id)\
            .group_by(model.city)\
            .order_by(desc(func.count(model.id)))\
            .all()
        
        for city_name, count in city_counts:
            key = city_name if city_name and city_name.strip() else "Не указано"
            stats[key] = stats.get(key, 0) + count
    except Exception as e:
        print(f"Error calculating geo stats: {e}")
    return stats

def get_age_and_bdate_stats(db: Session, model, project_id: str) -> Dict:
    bdate_stats = {str(i): 0 for i in range(1, 14)} # 1-12 month, 13=unknown
    age_stats = {
        "u16": 0, "16-20": 0, "20-25": 0, "25-30": 0, "30-35": 0, "35-40": 0, "40-45": 0, "45p": 0, "unknown": 0
    }
    
    if not hasattr(model, 'bdate'):
        return {"bdate_stats": bdate_stats, "age_stats": age_stats}

    try:
        bdates_query = db.query(model.bdate).filter(model.project_id == project_id, model.bdate.isnot(None))
        bdates = bdates_query.all()
        current_year = datetime.now().year
        
        for (bdate_str,) in bdates:
            if not bdate_str: continue
            parts = bdate_str.split('.')
            
            # 1. Месяц рождения
            if len(parts) >= 2:
                month_raw = parts[1]
                month = str(int(month_raw)) if month_raw.isdigit() else month_raw
                if month in bdate_stats:
                    bdate_stats[month] += 1
                else:
                    bdate_stats["13"] += 1
            else:
                bdate_stats["13"] += 1

            # 2. Возраст
            if len(parts) == 3:
                year_str = parts[2]
                if year_str.isdigit():
                    year = int(year_str)
                    age = current_year - year
                    
                    if age < 16: age_stats["u16"] += 1
                    elif 16 <= age < 20: age_stats["16-20"] += 1
                    elif 20 <= age < 25: age_stats["20-25"] += 1
                    elif 25 <= age < 30: age_stats["25-30"] += 1
                    elif 30 <= age < 35: age_stats["30-35"] += 1
                    elif 35 <= age < 40: age_stats["35-40"] += 1
                    elif 40 <= age < 45: age_stats["40-45"] += 1
                    else: age_stats["45p"] += 1
                else:
                    age_stats["unknown"] += 1
            else:
                age_stats["unknown"] += 1

        # Добавляем тех, у кого bdate is None
        none_bdate_count = db.query(model).filter(model.project_id == project_id, model.bdate.is_(None)).count()
        bdate_stats["13"] += none_bdate_count
        age_stats["unknown"] += none_bdate_count
        
    except Exception as e:
        print(f"Error calculating bdate/age stats: {e}")
        
    return {"bdate_stats": bdate_stats, "age_stats": age_stats}
