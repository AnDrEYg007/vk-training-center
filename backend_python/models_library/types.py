from sqlalchemy import TypeDecorator, Text
from cryptography.fernet import Fernet
from config import settings

# Инициализируем шифратор, если ключ предоставлен
cipher_suite = None
if settings.encryption_key:
    try:
        cipher_suite = Fernet(settings.encryption_key)
    except Exception as e:
        print(f"⚠️ ENCRYPTION ERROR: Invalid ENCRYPTION_KEY provided. Data will not be encrypted. Error: {e}")
else:
    print("⚠️ ENCRYPTION WARNING: No ENCRYPTION_KEY found in .env. Sensitive data will be stored as plain text.")

class EncryptedString(TypeDecorator):
    """
    Тип данных SQLAlchemy для автоматического шифрования при записи
    и расшифровки при чтении.
    """
    impl = Text
    cache_ok = True

    def process_bind_param(self, value, dialect):
        """Шифрует данные перед сохранением в БД."""
        if value is None:
            return None
        
        # Если шифрование не настроено, сохраняем как есть (fallback)
        if not cipher_suite:
            return value

        if not isinstance(value, str):
            value = str(value)

        try:
            encrypted_value = cipher_suite.encrypt(value.encode('utf-8'))
            return encrypted_value.decode('utf-8')
        except Exception as e:
            print(f"Error encrypting data: {e}")
            return value

    def process_result_value(self, value, dialect):
        """Расшифровывает данные после получения из БД."""
        if value is None:
            return None

        # Если шифрование не настроено, возвращаем как есть
        if not cipher_suite:
            return value

        try:
            # Fernet токены всегда начинаются с gAAAAA
            if not value.startswith("gAAAAA"):
                # Если данные не выглядят зашифрованными (например, старые данные), возвращаем как есть
                return value
                
            decrypted_value = cipher_suite.decrypt(value.encode('utf-8'))
            return decrypted_value.decode('utf-8')
        except Exception as e:
            # Если не удалось расшифровать (неверный ключ или данные не зашифрованы),
            # возвращаем сырые данные, чтобы не ломать приложение.
            print(f"Error decrypting data (returning raw): {e}")
            return value