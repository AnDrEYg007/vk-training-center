"""
Пример задачи прогрева аккаунта (День 1)
Имитирует естественную активность пользователя перед публикацией отзыва
"""

import asyncio
import random
from datetime import datetime
from playwright.async_api import async_playwright


class AccountWarmer:
    def __init__(self, account, community_url, greeting_message):
        self.account = account
        self.community_url = community_url
        self.greeting_message = greeting_message
        self.browser = None
        self.context = None
        self.page = None
    
    async def warm_account(self):
        """Основной процесс прогрева аккаунта"""
        
        try:
            # 1. Инициализация браузера
            await self._init_browser()
            
            # 2. Авторизация VK
            await self._login()
            
            # 3. Переход в сообщество
            await self._navigate_to_community()
            
            # 4. Скролл страницы
            await self._scroll_page()
            
            # 5. Лайк последнего поста
            await self._like_last_post()
            
            # 6. Сообщение в личку (если доступно)
            await self._send_message()
            
            # 7. Подписка на сообщество
            await self._subscribe()
            
            # 8. Клик на телефон (если есть)
            await self._click_phone()
            
            # 9. Сохранение сессии
            await self._save_session()
            
            # 10. Логирование успеха
            self._log_success()
            
        except Exception as e:
            self._log_error(e)
            raise
        
        finally:
            await self._cleanup()
    
    async def _init_browser(self):
        """Инициализирует браузер с fingerprint и прокси"""
        
        p = await async_playwright().start()
        
        # Прокси
        proxy_config = {
            'server': f'http://{self.account.proxy.host}:{self.account.proxy.port}',
            'username': self.account.proxy.username,
            'password': self.account.proxy.password
        }
        
        # Запуск браузера
        self.browser = await p.chromium.launch(
            headless=True,
            proxy=proxy_config,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
            ]
        )
        
        # Контекст с fingerprint
        fingerprint = self.account.fingerprint
        
        self.context = await self.browser.new_context(
            user_agent=fingerprint['user_agent'],
            viewport={
                'width': int(fingerprint['screen_resolution'].split('x')[0]),
                'height': int(fingerprint['screen_resolution'].split('x')[1])
            },
            locale='ru-RU',
            timezone_id='Europe/Moscow',
        )
        
        # Скрываем автоматизацию
        await self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        self.page = await self.context.new_page()
    
    async def _login(self):
        """Авторизация в VK"""
        
        print(f"[{datetime.now()}] Авторизация аккаунта {self.account.login}")
        
        await self.page.goto('https://vk.com/')
        await self._random_delay(2, 4)
        
        # Ввод логина
        await self.page.fill('#index_email', self.account.login)
        await self._random_delay(0.5, 1)
        
        # Ввод пароля с имитацией печати
        password_field = await self.page.query_selector('#index_pass')
        for char in self.account.password:
            await password_field.type(char, delay=random.randint(80, 150))
        
        await self._random_delay(0.5, 1.5)
        
        # Клик на "Войти"
        await self.page.click('#index_login_button')
        await self._random_delay(5, 10)
        
        # Проверка успешной авторизации
        if await self.page.query_selector('.left_menu'):
            print(f"[{datetime.now()}] Успешная авторизация")
        else:
            raise Exception("Не удалось авторизоваться")
    
    async def _navigate_to_community(self):
        """Переход в сообщество"""
        
        print(f"[{datetime.now()}] Переход в сообщество {self.community_url}")
        
        await self.page.goto(self.community_url)
        await self._random_delay(3, 6)
    
    async def _scroll_page(self):
        """Плавный скролл страницы"""
        
        print(f"[{datetime.now()}] Скролл страницы")
        
        scroll_steps = random.randint(8, 12)
        
        for _ in range(scroll_steps):
            # Прокрутка
            scroll_distance = random.randint(150, 350)
            await self.page.evaluate(f'window.scrollBy(0, {scroll_distance})')
            
            # Пауза (имитация чтения)
            await self._random_delay(1.5, 3.5)
            
            # Иногда скроллим назад
            if random.random() < 0.2:
                back_scroll = random.randint(50, 100)
                await self.page.evaluate(f'window.scrollBy(0, -{back_scroll})')
                await self._random_delay(0.5, 1.2)
    
    async def _like_last_post(self):
        """Лайк последнего поста"""
        
        print(f"[{datetime.now()}] Лайк последнего поста")
        
        # Находим последний пост
        posts = await self.page.query_selector_all('.wall_item')
        
        if not posts:
            print("[WARNING] Нет постов на странице")
            return
        
        last_post = posts[0]
        
        # Скроллим к посту
        await last_post.scroll_into_view_if_needed()
        await self._random_delay(1, 2)
        
        # Находим кнопку лайка
        like_button = await last_post.query_selector('.like_btn')
        
        if like_button:
            # Плавное движение мыши к кнопке
            box = await like_button.bounding_box()
            await self.page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
            await self._random_delay(0.5, 1)
            
            # Клик
            await like_button.click()
            await self._random_delay(1, 2)
            
            print(f"[{datetime.now()}] Лайк поставлен")
    
    async def _send_message(self):
        """Отправка сообщения в личку сообщества"""
        
        print(f"[{datetime.now()}] Попытка отправить сообщение")
        
        # Проверяем, открыты ли сообщения
        message_button = await self.page.query_selector('.page_actions_send_msg')
        
        if not message_button:
            print("[INFO] Сообщения недоступны")
            return
        
        # Клик на "Написать сообщение"
        await message_button.click()
        await self._random_delay(2, 4)
        
        # Вводим текст с имитацией печати
        message_field = await self.page.query_selector('#im_editable')
        
        if message_field:
            for char in self.greeting_message:
                # 5% шанс опечатки
                if random.random() < 0.05:
                    wrong_char = random.choice('абвгдеёжзийклмнопрстуфхцчшщъыьэюя')
                    await message_field.type(wrong_char, delay=random.randint(80, 150))
                    await self._random_delay(0.2, 0.5)
                    await self.page.keyboard.press('Backspace')
                
                await message_field.type(char, delay=random.randint(80, 200))
                
                # Паузы на знаках препинания
                if char in [',', '.', '!', '?']:
                    if random.random() < 0.3:
                        await self._random_delay(0.5, 1.5)
            
            await self._random_delay(1, 2)
            
            # Отправка
            send_button = await self.page.query_selector('.im_send_btn')
            if send_button:
                await send_button.click()
                await self._random_delay(2, 3)
                print(f"[{datetime.now()}] Сообщение отправлено")
    
    async def _subscribe(self):
        """Подписка на сообщество"""
        
        print(f"[{datetime.now()}] Подписка на сообщество")
        
        # Ищем кнопку "Подписаться"
        join_button = await self.page.query_selector('.join_btn, .page_actions_btn')
        
        if join_button:
            button_text = await join_button.text_content()
            
            if 'Подписаться' in button_text or 'Вступить' in button_text:
                await join_button.click()
                await self._random_delay(1, 2)
                print(f"[{datetime.now()}] Подписка выполнена")
            else:
                print(f"[INFO] Уже подписан")
    
    async def _click_phone(self):
        """Клик на номер телефона (если есть)"""
        
        print(f"[{datetime.now()}] Поиск телефона")
        
        phone_element = await self.page.query_selector('.phone_link, .group_info_phone')
        
        if phone_element:
            await phone_element.click()
            await self._random_delay(2, 3)
            print(f"[{datetime.now()}] Клик по телефону выполнен")
        else:
            print(f"[INFO] Телефон не найден")
    
    async def _save_session(self):
        """Сохранение cookies для следующего дня"""
        
        print(f"[{datetime.now()}] Сохранение сессии")
        
        cookies = await self.context.cookies()
        storage = await self.context.storage_state()
        
        # Сохранение в базу данных
        import json
        self.account.cookies = json.dumps(cookies)
        self.account.local_storage = json.dumps(storage)
        self.account.last_session = datetime.now()
        self.account.save()
    
    async def _cleanup(self):
        """Закрытие браузера"""
        
        if self.browser:
            await self.browser.close()
    
    async def _random_delay(self, min_sec: float, max_sec: float):
        """Случайная задержка"""
        await asyncio.sleep(random.uniform(min_sec, max_sec))
    
    def _log_success(self):
        """Логирование успешного прогрева"""
        
        # Сохранение в action_logs
        from models import ActionLog
        
        ActionLog.objects.create(
            account=self.account,
            action='warm_up_day1',
            community=self.community_url,
            status='success'
        )
        
        print(f"[{datetime.now()}] Прогрев аккаунта завершен успешно")
    
    def _log_error(self, error):
        """Логирование ошибки"""
        
        from models import ActionLog
        
        ActionLog.objects.create(
            account=self.account,
            action='warm_up_day1',
            community=self.community_url,
            status='failed',
            error_message=str(error)
        )
        
        print(f"[{datetime.now()}] Ошибка прогрева: {error}")


# Celery задача
from celery import shared_task

@shared_task
def warm_account_task(account_id: int, community_url: str, greeting_message: str):
    """Celery задача для прогрева аккаунта"""
    
    from models import VKAccount
    
    account = VKAccount.objects.get(id=account_id)
    warmer = AccountWarmer(account, community_url, greeting_message)
    
    asyncio.run(warmer.warm_account())
