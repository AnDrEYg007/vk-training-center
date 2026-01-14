
import models

def get_model_by_list_type(list_type: str):
    """Определяет модель SQLAlchemy на основе типа списка."""
    if list_type == 'mailing':
        return models.SystemListMailing
    elif list_type == 'history_join':
        return models.SystemListHistoryJoin
    elif list_type == 'history_leave':
        return models.SystemListHistoryLeave
    elif list_type == 'likes':
        return models.SystemListLikes
    elif list_type == 'comments':
        return models.SystemListComments
    elif list_type == 'reposts':
        return models.SystemListReposts
    elif list_type == 'authors':
        return models.SystemListAuthor
    else:
        return models.SystemListSubscriber
