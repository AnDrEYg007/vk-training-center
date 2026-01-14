
# Фаза 1: Сколько постов обрабатываем за 1 запрос execute (Fast Scan)
MULTI_POST_BATCH_SIZE = 5 

# Фаза 2: Настройки глубокого сканирования (Deep Scan)
LIKES_INNER_COUNT = 1000
LIKES_ITERATIONS = 25 

COMMENTS_INNER_COUNT = 100
COMMENTS_ITERATIONS = 25

REPOSTS_INNER_COUNT = 1000
REPOSTS_ITERATIONS = 25

# Ограничение количества потоков для взаимодействий, чтобы избежать ошибки 'Too many requests' (Code 6)
INTERACTIONS_MAX_WORKERS = 4
