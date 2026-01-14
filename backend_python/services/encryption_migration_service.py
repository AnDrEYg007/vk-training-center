
from sqlalchemy import create_engine, text
from cryptography.fernet import Fernet
import sys
import time
from config import settings
from database import engine

def migrate_to_encrypted():
    """
    Проверяет и автоматически шифрует токены в БД, если они хранятся в открытом виде.
    Запускается при старте приложения.
    """
    if not settings.encryption_key:
        print("⚠️ ENCRYPTION: Ключ не найден. Пропускаем миграцию шифрования.")
        return

    try:
        cipher_suite = Fernet(settings.encryption_key)
    except Exception as e:
        print(f"❌ ENCRYPTION ERROR: Неверный ключ: {e}")
        return

    print("🔒 ENCRYPTION: Проверка данных на необходимость шифрования...")

    def encrypt_column(table, column, id_col='id'):
        updated_count = 0
        
        with engine.connect() as conn:
            try:
                # Проверяем существование таблицы
                conn.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
                
                # Читаем данные
                result = conn.execute(text(f"SELECT {id_col}, {column} FROM {table}"))
                rows = result.fetchall()
            except Exception:
                # Таблицы может не быть (например, при первом запуске до миграций)
                return

            for row in rows:
                record_id = row[0]
                value = row[1]

                if not value:
                    continue

                # Если данные уже начинаются на gAAAAA, считаем их зашифрованными
                if str(value).startswith("gAAAAA"):
                    continue
                
                try:
                    # Шифруем
                    encrypted_val = cipher_suite.encrypt(str(value).encode('utf-8')).decode('utf-8')
                    
                    # Обновляем
                    conn.execute(
                        text(f"UPDATE {table} SET {column} = :val WHERE {id_col} = :rid"),
                        {"val": encrypted_val, "rid": record_id}
                    )
                    updated_count += 1
                except Exception as e:
                    print(f"   ❌ Ошибка шифрования {table}:{record_id} -> {e}")

            if updated_count > 0:
                conn.commit()
                print(f"   ✅ {table}.{column}: Зашифровано {updated_count} записей.")

    # Список полей для шифрования
    encrypt_column("projects", "communityToken")
    encrypt_column("projects", "additional_community_tokens")
    encrypt_column("system_accounts", "token")
    encrypt_column("ai_tokens", "token")


def rotate_keys_using_env():
    """
    Выполняет ротацию ключей, если задана переменная ENCRYPTION_KEY_NEW.
    После успешной ротации завершает работу приложения, требуя обновления конфига.
    """
    new_key = settings.encryption_key_new
    current_key = settings.encryption_key

    if not new_key:
        return

    print("\n" + "="*60)
    print("🔐 ОБНАРУЖЕН НОВЫЙ КЛЮЧ ШИФРОВАНИЯ (ENCRYPTION_KEY_NEW)")
    print("🚀 ЗАПУСК ПРОЦЕДУРЫ РОТАЦИИ КЛЮЧЕЙ...")
    print("="*60)

    if not current_key:
        print("❌ ОШИБКА: Текущий ENCRYPTION_KEY не задан. Ротация невозможна.")
        return

    try:
        cipher_old = Fernet(current_key)
        cipher_new = Fernet(new_key)
    except Exception as e:
        print(f"❌ ОШИБКА ИНИЦИАЛИЗАЦИИ КЛЮЧЕЙ: {e}")
        print("Проверьте формат ключей (должен быть base64-encoded 32-byte key).")
        sys.exit(1)

    targets = [
        ("projects", "communityToken"),
        ("projects", "additional_community_tokens"),
        ("system_accounts", "token"),
        ("ai_tokens", "token"),
    ]

    total_rotated = 0

    with engine.connect() as conn:
        for table, column in targets:
            print(f"🔄 Обработка таблицы '{table}', колонка '{column}'...")
            try:
                conn.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
            except Exception:
                print(f"   ⚠️ Таблица {table} не найдена, пропускаем.")
                continue

            result = conn.execute(text(f"SELECT id, {column} FROM {table}"))
            rows = result.fetchall()
            
            updated_in_table = 0
            
            for row in rows:
                record_id = row[0]
                value = row[1]
                if not value: continue
                
                try:
                    # Расшифровка старым
                    if not str(value).startswith("gAAAAA"):
                        decrypted_data = str(value) # Данные не были зашифрованы
                    else:
                        decrypted_data = cipher_old.decrypt(value.encode('utf-8')).decode('utf-8')
                    
                    # Шифрование новым
                    new_encrypted_value = cipher_new.encrypt(decrypted_data.encode('utf-8')).decode('utf-8')

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

    print("\n" + "="*60)
    print(f"🎉 РОТАЦИЯ УСПЕШНО ЗАВЕРШЕНА. Перешифровано полей: {total_rotated}")
    print("="*60)
    print("\n⚠️ ВНИМАНИЕ! ДЕЙСТВИЯ, НЕОБХОДИМЫЕ СЕЙЧАС:")
    print("1. Данные в БД теперь зашифрованы НОВЫМ ключом.")
    print("2. Приложение будет ОСТАНОВЛЕНО, так как его текущий конфиг (ENCRYPTION_KEY) устарел.")
    print("3. Вам нужно создать новую ревизию контейнера (или обновить .env):")
    print(f"   -> Установите ENCRYPTION_KEY = {new_key}")
    print("   -> Удалите переменную ENCRYPTION_KEY_NEW")
    print("\nЗавершение работы...")
    print("="*60)
    
    # Принудительно завершаем работу, чтобы не допустить запуска с неверным ключом
    sys.exit(0)
