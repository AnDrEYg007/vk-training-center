
import sys
import os
from sqlalchemy import create_engine, text
from cryptography.fernet import Fernet

# Добавляем родительскую директорию в путь, чтобы импортировать config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

def migrate_to_encrypted():
    """
    Скрипт для шифрования существующих токенов в базе данных.
    Должен быть запущен один раз после внедрения шифрования.
    """
    if not settings.encryption_key:
        print("❌ ОШИБКА: ENCRYPTION_KEY не найден в настройках (.env).")
        print("Сгенерируйте ключ и добавьте его в .env перед запуском.")
        return

    try:
        cipher_suite = Fernet(settings.encryption_key)
    except Exception as e:
        print(f"❌ ОШИБКА: Неверный ключ шифрования: {e}")
        return

    # Подключаемся к БД напрямую, минуя ORM модели (чтобы читать raw данные)
    # Нам нужно видеть "сырой" текст, чтобы понять, зашифрован он или нет
    database_url = settings.database_url if settings.database_url else "sqlite:///./vk_planner.db"
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
        
    engine = create_engine(database_url)

    def encrypt_column(table, column, id_col='id'):
        print(f"\n🔍 Обработка таблицы '{table}', колонка '{column}'...")
        updated_count = 0
        
        with engine.connect() as conn:
            # Читаем все строки
            # Для SQLite и Postgres синтаксис SELECT одинаковый
            try:
                result = conn.execute(text(f"SELECT {id_col}, {column} FROM {table}"))
                rows = result.fetchall()
            except Exception as e:
                print(f"   ⚠️ Не удалось прочитать таблицу (возможно, ее нет): {e}")
                return

            for row in rows:
                record_id = row[0]
                value = row[1]

                if not value:
                    continue

                # Проверяем, зашифровано ли уже (Fernet base64 url-safe начинается обычно с gAAAAA)
                if str(value).startswith("gAAAAA"):
                    # print(f"   ⏩ Запись {record_id} уже зашифрована. Пропуск.")
                    continue
                
                try:
                    # Шифруем
                    encrypted_val = cipher_suite.encrypt(str(value).encode('utf-8')).decode('utf-8')
                    
                    # Обновляем напрямую через SQL
                    conn.execute(
                        text(f"UPDATE {table} SET {column} = :val WHERE {id_col} = :rid"),
                        {"val": encrypted_val, "rid": record_id}
                    )
                    updated_count += 1
                except Exception as e:
                    print(f"   ❌ Ошибка при шифровании записи {record_id}: {e}")

            conn.commit()
            print(f"   ✅ Зашифровано записей: {updated_count}")

    # 1. Projects: communityToken
    encrypt_column("projects", "communityToken")
    
    # 2. Projects: additional_community_tokens
    encrypt_column("projects", "additional_community_tokens")
    
    # 3. System Accounts: token
    encrypt_column("system_accounts", "token")
    
    # 4. AI Tokens: token
    encrypt_column("ai_tokens", "token")

    print("\n🎉 Миграция шифрования завершена.")

if __name__ == "__main__":
    migrate_to_encrypted()
