
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

def get_mailing_specific_stats(
    db: Session, 
    model, 
    project_id: str, 
    total_users: int,
    period: str,
    group_by: str,
    date_from: Optional[str],
    date_to: Optional[str],
    filter_can_write: str
) -> Dict:
    result = {
        "mailing_stats": None,
        "lifetime_stats": None,
        "last_contact_stats": None,
        "mailing_chart_data": []
    }
    
    base_query = db.query(model).filter(model.project_id == project_id)

    # 1. Разрешения
    allowed_count = base_query.filter(model.can_access_closed.is_(True)).count()
    forbidden_count = total_users - allowed_count
    active_allowed_count = base_query.filter(
        model.deactivated.is_(None),
        model.can_access_closed.is_(True)
    ).count()
    
    result["mailing_stats"] = {
        "allowed_count": allowed_count,
        "forbidden_count": forbidden_count,
        "active_allowed_count": active_allowed_count
    }

    # 2. Lifetime Statistics
    try:
        print(f"--- DEBUG LIFETIME STATS for {project_id} ---")
        lt_query = db.query(
            model.can_access_closed,
            model.first_message_date,
            model.last_message_date
        ).filter(
            model.project_id == project_id,
            model.first_message_date.isnot(None),
            model.last_message_date.isnot(None)
        ).all()
        
        print(f"DEBUG: Found {len(lt_query)} records with both dates.")

        total_days_sum = 0
        total_count = 0
        allowed_days_sum = 0
        allowed_count_iter = 0
        forbidden_days_sum = 0
        forbidden_count_iter = 0

        for i, (can_access, first_date, last_date) in enumerate(lt_query):
            # Нормализация таймзон
            fd = first_date
            ld = last_date
            
            # Лог первых 3 записей для проверки типов
            if i < 3:
                print(f"DEBUG Record {i}: FD={fd} (tz={fd.tzinfo}), LD={ld} (tz={ld.tzinfo}), CanAccess={can_access}")
            
            try:
                # Приводим к naive UTC, если есть смещение
                if fd.tzinfo is not None:
                    fd = fd.replace(tzinfo=None)
                if ld.tzinfo is not None:
                    ld = ld.replace(tzinfo=None)
                
                # Вычисляем разницу
                if ld < fd:
                    # Аномалия
                    if i < 3: print(f"DEBUG: Negative diff detected (Last < First). Setting to 0.")
                    diff = 0
                else:
                    diff = (ld - fd).days
                    
                if i < 3: print(f"DEBUG: Diff calculated: {diff} days")

                total_days_sum += diff
                total_count += 1
                
                if can_access:
                    allowed_days_sum += diff
                    allowed_count_iter += 1
                else:
                    forbidden_days_sum += diff
                    forbidden_count_iter += 1
            except Exception as loop_e:
                 print(f"DEBUG: Error processing row {i}: {loop_e}")

        print(f"DEBUG AGGREGATION: TotalDays={total_days_sum}, TotalCount={total_count}")
        print(f"DEBUG AGGREGATION: AllowedDays={allowed_days_sum}, AllowedCount={allowed_count_iter}")
        print(f"DEBUG AGGREGATION: ForbiddenDays={forbidden_days_sum}, ForbiddenCount={forbidden_count_iter}")
        
        if total_count > 0:
            result["lifetime_stats"] = {
                "total_avg": round(total_days_sum / total_count, 1),
                "allowed_avg": round(allowed_days_sum / allowed_count_iter, 1) if allowed_count_iter > 0 else 0,
                "forbidden_avg": round(forbidden_days_sum / forbidden_count_iter, 1) if forbidden_count_iter > 0 else 0
            }
        else:
             result["lifetime_stats"] = {
                "total_avg": 0,
                "allowed_avg": 0,
                "forbidden_avg": 0
            }
            
    except Exception as e:
        print(f"Error calculating lifetime stats: {e}")
        # Возвращаем нули в случае ошибки
        result["lifetime_stats"] = {
            "total_avg": 0,
            "allowed_avg": 0,
            "forbidden_avg": 0
        }
    print(f"--- END DEBUG LIFETIME STATS ---")

    # 3. Last Contact Stats
    now_dt = datetime.now(timezone.utc)
    dt_today_start = now_dt - timedelta(days=1)
    dt_3_days = now_dt - timedelta(days=3)
    dt_week = now_dt - timedelta(days=7)
    dt_month = now_dt - timedelta(days=30)
    dt_3_months = now_dt - timedelta(days=90)
    dt_6_months = now_dt - timedelta(days=180)
    dt_year = now_dt - timedelta(days=365)
    
    try:
        contact_case = db.query(
            func.sum(case((model.last_message_date.is_(None), 1), else_=0)).label('unknown'),
            func.sum(case((model.last_message_date >= dt_today_start, 1), else_=0)).label('today'),
            func.sum(case((and_(model.last_message_date < dt_today_start, model.last_message_date >= dt_3_days), 1), else_=0)).label('3_days'),
            func.sum(case((and_(model.last_message_date < dt_3_days, model.last_message_date >= dt_week), 1), else_=0)).label('week'),
            func.sum(case((model.last_message_date < dt_month, 1), else_=0)).label('month_plus'),
            func.sum(case((model.last_message_date < dt_3_months, 1), else_=0)).label('3_months_plus'),
            func.sum(case((model.last_message_date < dt_6_months, 1), else_=0)).label('6_months_plus'),
            func.sum(case((model.last_message_date < dt_year, 1), else_=0)).label('year_plus'),
        ).filter(model.project_id == project_id).first()
        
        if contact_case:
            result["last_contact_stats"] = {
                "unknown": contact_case[0] or 0,
                "today": contact_case[1] or 0,
                "3_days": (contact_case[1] or 0) + (contact_case[2] or 0),
                "week": (contact_case[1] or 0) + (contact_case[2] or 0) + (contact_case[3] or 0),
                "month_plus": contact_case[4] or 0,
                "3_months_plus": contact_case[5] or 0,
                "6_months_plus": contact_case[6] or 0,
                "year_plus": contact_case[7] or 0,
            }
        else:
            result["last_contact_stats"] = {}
    except Exception as e:
        print(f"Error calculating last contact stats: {e}")
        result["last_contact_stats"] = {}

    # 4. График First Contact
    try:
        start_date = None
        end_date = None
        
        if period == 'custom' and date_from and date_to:
            try:
                start_date = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                end_date = datetime.strptime(date_to, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
            except ValueError:
                pass
        elif period != 'all':
            if period == 'week': start_date = now_dt - timedelta(days=7)
            elif period == 'month': start_date = now_dt - timedelta(days=30)
            elif period == 'quarter': start_date = now_dt - timedelta(days=90)
            elif period == 'year': start_date = now_dt - timedelta(days=365)
        
        chart_query = db.query(model.first_message_date).filter(
            model.project_id == project_id,
            model.first_message_date.isnot(None)
        )
        
        if filter_can_write == 'allowed':
            chart_query = chart_query.filter(model.can_access_closed.is_(True))
        elif filter_can_write == 'forbidden':
            chart_query = chart_query.filter(model.can_access_closed.isnot(True))
        
        if start_date:
            chart_query = chart_query.filter(model.first_message_date >= start_date)
        if end_date:
            chart_query = chart_query.filter(model.first_message_date <= end_date)
            
        dates = chart_query.all()
        
        def get_chart_key(dt: datetime, g_by: str) -> str:
            if g_by == 'day': return dt.strftime('%Y-%m-%d')
            elif g_by == 'week': return dt.strftime('%Y-W%W')
            elif g_by == 'month': return dt.strftime('%Y-%m')
            elif g_by == 'quarter': return f"{dt.year}-Q{(dt.month - 1) // 3 + 1}"
            elif g_by == 'year': return dt.strftime('%Y')
            return dt.strftime('%Y-%m')

        chart_map = {}
        for (dt,) in dates:
            key = get_chart_key(dt, group_by)
            if key not in chart_map:
                chart_map[key] = {"date": key, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
            chart_map[key]["count"] += 1
        
        if chart_map:
            sorted_keys = sorted(chart_map.keys())
            fill_start_dt = None
            fill_end_dt = None
            
            try:
                if group_by == 'day':
                    fill_start_dt = start_date if start_date else datetime.strptime(sorted_keys[0], '%Y-%m-%d').replace(tzinfo=timezone.utc)
                    fill_end_dt = end_date if end_date else datetime.strptime(sorted_keys[-1], '%Y-%m-%d').replace(tzinfo=timezone.utc)
                elif group_by == 'month':
                    fill_start_dt = start_date.replace(day=1) if start_date else datetime.strptime(sorted_keys[0], '%Y-%m').replace(tzinfo=timezone.utc)
                    fill_end_dt = end_date if end_date else datetime.strptime(sorted_keys[-1], '%Y-%m').replace(tzinfo=timezone.utc)
            except Exception:
                pass
            
            filled_chart_map = chart_map.copy()
            if fill_start_dt and fill_end_dt and fill_start_dt <= fill_end_dt:
                curr = fill_start_dt
                if group_by == 'day':
                    while curr <= fill_end_dt:
                        k = curr.strftime('%Y-%m-%d')
                        if k not in filled_chart_map:
                            filled_chart_map[k] = {"date": k, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
                        curr += timedelta(days=1)
                elif group_by == 'month':
                    end_norm = fill_end_dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    curr_norm = curr.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    while curr_norm <= end_norm:
                        k = curr_norm.strftime('%Y-%m')
                        if k not in filled_chart_map:
                            filled_chart_map[k] = {"date": k, "count": 0, "likes": 0, "comments": 0, "reposts": 0, "views": 0}
                        if curr_norm.month == 12:
                            curr_norm = curr_norm.replace(year=curr_norm.year + 1, month=1)
                        else:
                            curr_norm = curr_norm.replace(month=curr_norm.month + 1)
                            
            result["mailing_chart_data"] = sorted(list(filled_chart_map.values()), key=lambda x: x['date'])
        else:
            result["mailing_chart_data"] = []
    except Exception as e:
        print(f"Error calculating mailing chart data: {e}")
        result["mailing_chart_data"] = []

    return result
