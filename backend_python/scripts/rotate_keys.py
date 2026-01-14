
import sys
import os
from sqlalchemy import create_engine, text
from cryptography.fernet import Fernet

# Добавляем путь к корню бэкенда для импорта config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

def rotate_keys():
    print("="*60)
    print("🔐 СКРИПТ РОТАЦИИ КЛЮЧЕЙ ШИФРОВАНИЯ")
    print("="*60)
    print("ВНИМАНИЕ: Перед запуском рекомендуется сделать резервную копию базы данных.")
    print("Остановите приложение перед выполнением этого скрипта, чтобы избежать конфликтов записи.")
    print("-" * 60)

    # 1. Получаем ключи
    current_key_input = input("Введите СТАРЫЙ (текущий) ключ шифрования: ").strip()
    new_key_input = input("Введите НОВЫЙ ключ шифрования: ").strip()

    if not current_key_input or not new_key_input:
        print("❌ Ошибка: Оба ключа должны быть введены.")
        return

    try:
        cipher_old = Fernet(current_key_input)
        cipher_new = Fernet(new_key_input)
    except Exception as e:
        print(f"❌ Ошибка инициализации ключей (проверьте формат base64): {e}")
        return

    # 2. Подключение к БД
    database_url = settings.database_url if settings.database_url else "sqlite:///./vk_planner.db"
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
        
    engine = create_engine(database_url)
    
    # 3. Список полей для обработки
    targets = [
        ("projects", "communityToken"),
        ("projects", "additional_community_tokens"),
        ("system_accounts", "token"),
        ("ai_tokens", "token"),
    ]

    total_rotated = 0

    with engine.connect() as conn:
        for table, column in targets:
            print(f"\n🔄 Обработка таблицы '{table}', колонка '{column}'...")
            
            try:
                # Проверяем существование таблицы
                conn.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
            except Exception:
                print(f"   ⚠️ Таблица {table} не найдена, пропускаем.")
                continue

            # Читаем данные
            result = conn.execute(text(f"SELECT id, {column} FROM {table}"))
            rows = result.fetchall()
            
            updated_in_table = 0
            
            for row in rows:
                record_id = row[0]
                value = row[1]

                if not value:
                    continue
                
                # Пробуем расшифровать старым ключом
                try:
                    # Если данные сырые (не gAAAAA...), то шифруем их новым ключом сразу
                    if not str(value).startswith("gAAAAA"):
                        decrypted_data = str(value)
                        # print(f"   ℹ️ Запись {record_id}: данные были не зашифрованы.")
                    else:
                        decrypted_data = cipher_old.decrypt(value.encode('utf-8')).decode('utf-8')
                    
                    # Шифруем новым ключом
                    new_encrypted_value = cipher_new.encrypt(decrypted_data.encode('utf-8')).decode('utf-8')

                    # Обновляем
                    conn.execute(
                        text(f"UPDATE {table} SET {column} = :val WHERE id = :rid"),
                        {"val": new_encrypted_value, "rid": record_id}
                    )
                    updated_in_table += 1
                except Exception as e:
                    print(f"   ❌ Ошибка обработки записи {record_id}: {e}")
            
            if updated_in_table > 0:
                conn.commit()
                print(f"   ✅ Обновлено {updated_in_table} записей.")
                total_rotated += updated_in_table
            else:
                print("   ℹ️ Нет записей для обновления.")

    print("\n" + "="*60)
    print(f"🎉 РОТАЦИЯ ЗАВЕРШЕНА. Всего обновлено: {total_rotated} полей.")
    print("Теперь обновите переменную ENCRYPTION_KEY в настройках сервера на НОВЫЙ ключ.")
    print("="*60)

if __name__ == "__main__":
    rotate_keys()
