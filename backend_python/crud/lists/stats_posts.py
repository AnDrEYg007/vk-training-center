
from sqlalchemy.orm import Session
from typing import Dict, Optional
from datetime import datetime, timedelta, timezone
import models

def get_post_stats(
    db: Session, 
    project_id: str, 
    period: str = 'all', 
    group_by: str = 'month',
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
) -> Dict:
    """
    Агрегирует статистику по постам: тоталы, средние, топы и данные для графика.
    """
    # Базовый запрос
    query = db.query(models.SystemListPost).filter(models.SystemListPost.project_id == project_id)
    
    # Фильтрация по периоду
    now = datetime.now(timezone.utc)
    start_date = None
    end_date = None
    
    if period == 'custom' and date_from and date_to:
        try:
            # Принимаем YYYY-MM-DD, добавляем время для полного охвата
            start_date = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            end_date = datetime.strptime(date_to, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
        except ValueError:
            pass
    elif period != 'all':
        if period == 'week':
            start_date = now - timedelta(days=7)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'quarter':
            start_date = now - timedelta(days=90)
        elif period == 'year':
            start_date = now - timedelta(days=365)
    
    if start_date:
        query = query.filter(models.SystemListPost.date >= start_date)
    if end_date:
            query = query.filter(models.SystemListPost.date <= end_date)
    
    all_posts = query.order_by(models.SystemListPost.date.asc()).all()
    
    total_count = len(all_posts)
    
    if total_count == 0:
        return {
            "post_stats": {
                "total_likes": 0, "total_comments": 0, "total_reposts": 0, "total_views": 0,
                "avg_likes": 0, "avg_comments": 0, "avg_reposts": 0, "avg_views": 0,
                "chart_data": []
            }
        }

    # 1. Totals
    t_likes = sum(p.likes_count for p in all_posts)
    t_comments = sum(p.comments_count for p in all_posts)
    t_reposts = sum(p.reposts_count for p in all_posts)
    t_views = sum(p.views_count for p in all_posts)

    # 2. Averages
    avg_likes = t_likes / total_count
    avg_comments = t_comments / total_count
    avg_reposts = t_reposts / total_count
    avg_views = t_views / total_count

    # 3. Tops
    def get_top(attr):
        top_post = max(all_posts, key=lambda x: getattr(x, attr))
        val = getattr(top_post, attr)
        return {"id": str(top_post.vk_post_id), "vk_link": top_post.vk_link, "value": val} if val > 0 else None

    # 4. Chart Data (Group by X)
    chart_map = {} 

    # Функция получения ключа для группировки
    def get_chart_key(dt: datetime, g_by: str) -> str:
        if g_by == 'day':
            return dt.strftime('%Y-%m-%d')
        elif g_by == 'week':
            # ISO week
            return dt.strftime('%Y-W%W')
        elif g_by == 'month':
            return dt.strftime('%Y-%m')
        elif g_by == 'quarter':
            # Custom quarter format YYYY-Qq
            quarter = (dt.month - 1) // 3 + 1
            return f"{dt.year}-Q{quarter}"
        elif g_by == 'year':
            return dt.strftime('%Y')
        return dt.strftime('%Y-%m') # Default

    for p in all_posts:
        if not p.date: continue
        
        key = get_chart_key(p.date, group_by)
        
        if key not in chart_map:
            chart_map[key] = {"date": key, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
        
        entry = chart_map[key]
        entry["count"] += 1
        entry["likes"] += p.likes_count
        entry["comments"] += p.comments_count
        entry["reposts"] += p.reposts_count
        entry["views"] += p.views_count

    # --- ЗАПОЛНЕНИЕ ПРОПУСКОВ (GAP FILLING) ---
    if chart_map:
        # Для custom range используем границы выбора, если они заданы, иначе границы данных
        sorted_keys = sorted(chart_map.keys())
        
        fill_start_dt = None
        fill_end_dt = None

        # Пытаемся определить границы заполнения
        try:
            if group_by == 'day':
                # Если выбран custom диапазон, заполняем от него. Иначе от первого поста.
                if start_date:
                    fill_start_dt = start_date
                else:
                    fill_start_dt = datetime.strptime(sorted_keys[0], '%Y-%m-%d').replace(tzinfo=timezone.utc)
                
                if end_date:
                        fill_end_dt = end_date
                else:
                        fill_end_dt = datetime.strptime(sorted_keys[-1], '%Y-%m-%d').replace(tzinfo=timezone.utc)

            elif group_by == 'month':
                if start_date:
                        fill_start_dt = start_date.replace(day=1)
                else:
                    fill_start_dt = datetime.strptime(sorted_keys[0], '%Y-%m').replace(tzinfo=timezone.utc)
                
                if end_date:
                    fill_end_dt = end_date
                else:
                    fill_end_dt = datetime.strptime(sorted_keys[-1], '%Y-%m').replace(tzinfo=timezone.utc)
        except Exception as e:
            print(f"Date parsing for gap filling error: {e}")

        
        filled_chart_map = chart_map.copy()

        try:
            if fill_start_dt and fill_end_dt and fill_start_dt <= fill_end_dt:
                curr = fill_start_dt
                
                if group_by == 'day':
                    while curr <= fill_end_dt:
                        k = curr.strftime('%Y-%m-%d')
                        if k not in filled_chart_map:
                            filled_chart_map[k] = {"date": k, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
                        curr += timedelta(days=1)
                        
                elif group_by == 'month':
                    # Нормализуем end_dt до начала месяца для корректного сравнения в цикле
                    end_norm = fill_end_dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    curr_norm = curr.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    
                    while curr_norm <= end_norm:
                        k = curr_norm.strftime('%Y-%m')
                        if k not in filled_chart_map:
                            filled_chart_map[k] = {"date": k, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
                        
                        # Increment month
                        if curr_norm.month == 12:
                            curr_norm = curr_norm.replace(year=curr_norm.year + 1, month=1)
                        else:
                            curr_norm = curr_norm.replace(month=curr_norm.month + 1)
        except Exception as e:
            print(f"Gap filling loop error: {e}")
        
        chart_data = sorted(list(filled_chart_map.values()), key=lambda x: x['date'])
    else:
        chart_data = []

    return {
        "post_stats": {
            "total_likes": t_likes,
            "total_comments": t_comments,
            "total_reposts": t_reposts,
            "total_views": t_views,
            "avg_likes": round(avg_likes, 1),
            "avg_comments": round(avg_comments, 1),
            "avg_reposts": round(avg_reposts, 1),
            "avg_views": round(avg_views, 1),
            "top_likes": get_top('likes_count'),
            "top_comments": get_top('comments_count'),
            "top_reposts": get_top('reposts_count'),
            "top_views": get_top('views_count'),
            "chart_data": chart_data
        }
    }
