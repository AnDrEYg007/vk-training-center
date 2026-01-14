
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

# Добавляем путь к корню бэкенда для импорта модулей
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SQLALCHEMY_DATABASE_URL
from models import Project
from config import settings
from services.vk_api.api_client import call_vk_api as raw_vk_call

def fix_avatars():
    print("="*60)
    print("🖼️  ОБНОВЛЕНИЕ АВАТАРОК ПРОЕКТОВ")
    print("="*60)

    # 1. Настройка БД
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 2. Получаем все проекты
        projects = db.query(Project).all()
        print(f"Найдено проектов: {len(projects)}")
        
        token = settings.vk_user_token
        if not token:
            print("❌ Ошибка: VK_USER_TOKEN не найден в .env")
            return

        # 3. Собираем ID групп для пакетного запроса
        # Используем словарь для маппинга vk_id -> project_db_object
        projects_map = {}
        group_ids = []

        for p in projects:
            # Очищаем ID от минусов если есть, так как groups.getById принимает положительные ID
            clean_id = p.vkProjectId.replace('-', '')
            projects_map[clean_id] = p
            group_ids.append(clean_id)

        if not group_ids:
            print("Нет проектов для обновления.")
            return

        # Разбиваем на пачки по 500 (лимит VK)
        CHUNK_SIZE = 400
        updated_count = 0
        
        for i in range(0, len(group_ids), CHUNK_SIZE):
            chunk = group_ids[i:i + CHUNK_SIZE]
            ids_str = ",".join(chunk)
            
            print(f"Запрос данных для {len(chunk)} групп...")
            
            try:
                response = raw_vk_call('groups.getById', {
                    'group_ids': ids_str,
                    'fields': 'photo_200',
                    'access_token': token
                })
                
                # Обработка ответа
                groups_data = []
                if isinstance(response, list):
                    groups_data = response
                elif isinstance(response, dict) and 'groups' in response:
                    groups_data = response['groups']
                
                for group_info in groups_data:
                    g_id = str(group_info['id'])
                    photo = group_info.get('photo_200')
                    
                    if g_id in projects_map and photo:
                        project = projects_map[g_id]
                        if project.avatar_url != photo:
                            project.avatar_url = photo
                            updated_count += 1
                            print(f"  -> Обновлено: {project.name}")
            
            except Exception as e:
                print(f"⚠️ Ошибка при запросе к VK: {e}")
                continue
            
            time.sleep(0.35) # Лимиты

        db.commit()
        print("-" * 60)
        print(f"✅ Готово! Обновлено аватарок: {updated_count}")
        print("Перезапустите бэкенд, чтобы увидеть изменения.")

    finally:
        db.close()

if __name__ == "__main__":
    fix_avatars()
