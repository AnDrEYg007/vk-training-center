
import csv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Убедимся, что скрипт может найти другие модули, такие как models и crud
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SQLALCHEMY_DATABASE_URL
from models import Project
from crud import get_project_by_id

# Настройка сессии базы данных
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

CSV_FILE_PATH = 'projects.csv'

def migrate_projects():
    """
    Читает данные из projects.csv и переносит их в базу данных SQLite.
    """
    db = SessionLocal()
    
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Ошибка: Файл '{CSV_FILE_PATH}' не найден.")
        print("Пожалуйста, экспортируйте лист 'Projects' из Google Sheets в этот файл и поместите его в папку backend_python.")
        return

    print(f"Начинаем миграцию проектов из файла '{CSV_FILE_PATH}'...")
    
    imported_count = 0
    skipped_count = 0
    
    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                project_id = row.get('id')
                
                # Если id пустой, генерируем его на основе vkProjectId, как это делала старая миграция
                if not project_id:
                    vk_project_id = row.get('vkProjectId')
                    if vk_project_id:
                        project_id = f"proj-{vk_project_id}"
                    else:
                        print(f"Пропуск строки {reader.line_num}: отсутствует 'id' и 'vkProjectId'.")
                        continue
                
                # Проверка на существование проекта в БД
                existing_project = get_project_by_id(db, project_id)
                if existing_project:
                    print(f"Проект '{row.get('name')}' (ID: {project_id}) уже существует. Пропускаем.")
                    skipped_count += 1
                    continue
                
                # Преобразование строкового 'TRUE'/'FALSE' в boolean
                is_disabled = row.get('disabled', 'FALSE').strip().upper() == 'TRUE'
                
                # Создание объекта модели SQLAlchemy
                db_project = Project(
                    id=project_id,
                    vkProjectId=row.get('vkProjectId'),
                    vkGroupShortName=row.get('vkGroupShortName'),
                    vkGroupName=row.get('vkGroupName'),
                    vkLink=row.get('vkLink'),
                    name=row.get('name'),
                    team=row.get('team') or None, # Сохраняем пустую строку как None
                    disabled=is_disabled,
                    notes=row.get('notes'),
                    communityToken=row.get('communityToken'),
                    variables=row.get('variables')
                )
                
                db.add(db_project)
                print(f"Проект '{db_project.name}' (ID: {db_project.id}) подготовлен к добавлению.")
                imported_count += 1
        
        if imported_count > 0:
            print("\nСохранение изменений в базе данных...")
            db.commit()
            print("Изменения успешно сохранены.")
        
        print("\n--- Миграция завершена ---")
        print(f"Успешно импортировано: {imported_count} проектов.")
        print(f"Пропущено (дубликаты): {skipped_count} проектов.")

    except Exception as e:
        print(f"\nПроизошла ошибка во время миграции: {e}")
        print("Откатываем изменения...")
        db.rollback()
    finally:
        db.close()
        print("Соединение с базой данных закрыто.")

if __name__ == "__main__":
    migrate_projects()
