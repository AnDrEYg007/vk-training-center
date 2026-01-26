"""
Пример задачи публикации отзыва (День 2)
Использует сохраненную сессию с предыдущего дня
"""

import asyncio
import random
from datetime import datetime
from playwright.async_api import async_playwright


class ReviewPoster:
    def __init__(self, account, community_url, review_text, rating=5):
        self.account = account
        self.community_url = community_url
        self.review_text = review_text
        self.rating = rating
        self.browser = None
        self.context = None
        self.page = None
    
    async def post_review(self):
        """Основной процесс публикации отзыва"""
        
        try:
            # 1. Инициализация браузера с восстановлением сессии
            await self._init_browser_with_session()
            
            # 2. Переход в раздел отзывов
            await self._navigate_to_reviews()
            
            # 3. Клик "Оставить отзыв"
            await self._click_add_review()
            
            # 4. Выбор рейтинга
            await self._select_rating()
            
            # 5. Ввод текста отзыва
            await self._type_review()
            
            # 6. Отправка формы
            success = await self._submit_review()
            
            if success:
                # 7. Списание средств с баланса
                await self._charge_campaign()
                
                # 8. Логирование успеха
                self._log_success()
            else:
                self._log_error("Не удалось опубликовать отзыв")
        
        except Exception as e:
            self._log_error(e)
            raise
        
        finally:
            await self._cleanup()
    
    async def _init_browser_with_session(self):
        """Инициализация браузера с восстановлением сессии"""
        
        print(f"[{datetime.now()}] Восстановление сессии аккаунта {self.account.login}")
        
        p = await async_playwright().start()
        
        # Прокси (тот же, что и вчера)
        proxy_config = {
            'server': f'http://{self.account.proxy.host}:{self.account.proxy.port}',
            'username': self.account.proxy.username,
            'password': self.account.proxy.password
        }
        
        # Запуск браузера
        self.browser = await p.chromium.launch(
            headless=True,
            proxy=proxy_config
        )
        
        # Восстановление сохраненной сессии
        import json
        
        if self.account.local_storage:
            storage_state = json.loads(self.account.local_storage)
            self.context = await self.browser.new_context(
                storage_state=storage_state
            )
        else:
            self.context = await self.browser.new_context()
            
            # Восстановление только cookies
            if self.account.cookies:
                cookies = json.loads(self.account.cookies)
                await self.context.add_cookies(cookies)
        
        self.page = await self.context.new_page()
        
        # Проверка авторизации
        await self.page.goto('https://vk.com/')
        await self._random_delay(2, 4)
        
        if not await self.page.query_selector('.left_menu'):
            raise Exception("Сессия истекла, требуется повторная авторизация")
        
        print(f"[{datetime.now()}] Сессия восстановлена успешно")
    
    async def _navigate_to_reviews(self):
        """Переход в раздел отзывов сообщества"""
        
        print(f"[{datetime.now()}] Переход в раздел отзывов")
        
        reviews_url = f'{self.community_url.rstrip("/")}/reviews'
        await self.page.goto(reviews_url)
        await self._random_delay(3, 6)
    
    async def _click_add_review(self):
        """Клик на кнопку 'Оставить отзыв'"""
        
        print(f"[{datetime.now()}] Клик 'Оставить отзыв'")
        
        # Ищем кнопку по разным селекторам
        selectors = [
            'button[aria-label*="отзыв"]',
            'button.FlatButton:has-text("Оставить отзыв")',
            '.page_block_header_extra button'
        ]
        
        button = None
        for selector in selectors:
            button = await self.page.query_selector(selector)
            if button:
                break
        
        if not button:
            raise Exception("Кнопка 'Оставить отзыв' не найдена")
        
        # Плавное движение мыши к кнопке
        box = await button.bounding_box()
        await self.page.mouse.move(
            box['x'] + box['width'] / 2,
            box['y'] + box['height'] / 2
        )
        await self._random_delay(0.5, 1)
        
        await button.click()
        await self._random_delay(2, 4)
    
    async def _select_rating(self):
        """Выбор рейтинга (звезд)"""
        
        print(f"[{datetime.now()}] Выбор рейтинга {self.rating} звезд")
        
        # Ищем radio-кнопку с нужным рейтингом
        rating_selector = f'input[type="radio"][value="{self.rating}"], label:has-text("{self.rating}")'
        rating_input = await self.page.query_selector(rating_selector)
        
        if not rating_input:
            # Альтернативный способ через клик по звездам
            stars = await self.page.query_selector_all('.rating_star')
            if len(stars) >= self.rating:
                await stars[self.rating - 1].click()
        else:
            await rating_input.click()
        
        await self._random_delay(1, 2)
    
    async def _type_review(self):
        """Ввод текста отзыва с имитацией печати"""
        
        print(f"[{datetime.now()}] Ввод текста отзыва")
        
        # Находим поле ввода
        textarea_selectors = [
            'textarea[placeholder*="отзыв"]',
            'textarea.input_field',
            'textarea[name="text"]'
        ]
        
        textarea = None
        for selector in textarea_selectors:
            textarea = await self.page.query_selector(selector)
            if textarea:
                break
        
        if not textarea:
            raise Exception("Поле ввода отзыва не найдено")
        
        # Клик в поле
        await textarea.click()
        await self._random_delay(0.5, 1)
        
        # Печать с опечатками
        for i, char in enumerate(self.review_text):
            # 5% шанс опечатки
            if random.random() < 0.05 and char.isalpha():
                # Печатаем неправильный символ
                wrong_char = random.choice('абвгдеёжзийклмнопрстуфхцчшщъыьэюя')
                await textarea.type(wrong_char, delay=random.randint(80, 150))
                
                # Пауза "осознания"
                await self._random_delay(0.2, 0.5)
                
                # Удаляем
                await self.page.keyboard.press('Backspace')
                await self._random_delay(0.1, 0.3)
            
            # Печатаем правильный символ
            await textarea.type(char, delay=random.randint(80, 200))
            
            # Паузы на знаках препинания
            if char in [',', '.', '!', '?']:
                if random.random() < 0.3:
                    await self._random_delay(0.5, 2.0)
            
            # Длинная пауза в середине текста (имитация обдумывания)
            if i == len(self.review_text) // 2 and random.random() < 0.5:
                await self._random_delay(2, 5)
        
        await self._random_delay(2, 4)
    
    async def _submit_review(self) -> bool:
        """Отправка формы отзыва"""
        
        print(f"[{datetime.now()}] Отправка отзыва")
        
        # Ищем кнопку отправки
        submit_selectors = [
            'button[type="submit"]',
            'button:has-text("Отправить")',
            'button:has-text("Опубликовать")',
            '.FlatButton.FlatButton--primary'
        ]
        
        submit_button = None
        for selector in submit_selectors:
            submit_button = await self.page.query_selector(selector)
            if submit_button:
                break
        
        if not submit_button:
            raise Exception("Кнопка отправки не найдена")
        
        # Клик
        await submit_button.click()
        await self._random_delay(3, 5)
        
        # Проверка успеха
        success_indicators = [
            '.success_message',
            'div:has-text("Ваш отзыв опубликован")',
            'div:has-text("Спасибо за отзыв")'
        ]
        
        for indicator in success_indicators:
            if await self.page.query_selector(indicator):
                print(f"[{datetime.now()}] Отзыв успешно опубликован")
                return True
        
        # Проверка на капчу
        if await self.page.query_selector('.captcha'):
            print(f"[{datetime.now()}] Обнаружена капча, решаем...")
            success = await self._solve_captcha()
            
            if success:
                # Повторная попытка отправки
                return await self._submit_review()
        
        # Проверка ошибок
        error_element = await self.page.query_selector('.error_msg, .form_error')
        if error_element:
            error_text = await error_element.text_content()
            print(f"[ERROR] Ошибка отправки: {error_text}")
            return False
        
        return False
    
    async def _solve_captcha(self) -> bool:
        """Решение капчи через 2captcha"""
        
        from services.captcha_solver import CaptchaSolver
        
        solver = CaptchaSolver(api_key='YOUR_2CAPTCHA_KEY')
        
        # Получаем site_key
        site_key = await self.page.evaluate('''
            () => document.querySelector('[data-sitekey]')?.getAttribute('data-sitekey')
        ''')
        
        if not site_key:
            print("[ERROR] Не удалось получить site_key капчи")
            return False
        
        try:
            # Решаем капчу
            solution = await solver.solve_recaptcha_v2(
                site_key=site_key,
                page_url=self.page.url
            )
            
            # Применяем решение
            await solver.apply_captcha_solution(self.page, solution)
            await self._random_delay(1, 2)
            
            print(f"[{datetime.now()}] Капча решена")
            return True
        
        except Exception as e:
            print(f"[ERROR] Ошибка решения капчи: {e}")
            return False
    
    async def _charge_campaign(self):
        """Списание средств с баланса кампании"""
        
        print(f"[{datetime.now()}] Списание 100₽ с баланса кампании")
        
        campaign = self.account.campaign
        
        if campaign.balance < 100:
            raise Exception("Недостаточно средств на балансе")
        
        campaign.balance -= 100
        campaign.completed_reviews += 1
        campaign.save()
        
        # Запись транзакции
        from models import Transaction
        
        Transaction.objects.create(
            user=campaign.user,
            campaign=campaign,
            amount=-100,
            type='withdrawal',
            description=f'Публикация отзыва аккаунтом {self.account.login}'
        )
    
    async def _cleanup(self):
        """Закрытие браузера"""
        
        if self.browser:
            await self.browser.close()
    
    async def _random_delay(self, min_sec: float, max_sec: float):
        """Случайная задержка"""
        await asyncio.sleep(random.uniform(min_sec, max_sec))
    
    def _log_success(self):
        """Логирование успешной публикации"""
        
        from models import ActionLog
        
        ActionLog.objects.create(
            account=self.account,
            action='review_posted',
            community=self.community_url,
            status='success'
        )
        
        print(f"[{datetime.now()}] Отзыв опубликован и залогирован")
    
    def _log_error(self, error):
        """Логирование ошибки"""
        
        from models import ActionLog
        
        ActionLog.objects.create(
            account=self.account,
            action='review_posted',
            community=self.community_url,
            status='failed',
            error_message=str(error)
        )
        
        print(f"[{datetime.now()}] Ошибка публикации: {error}")


# Celery задача
from celery import shared_task

@shared_task
def post_review_task(
    account_id: int,
    community_url: str,
    review_text: str,
    rating: int = 5
):
    """Celery задача для публикации отзыва"""
    
    from models import VKAccount
    
    account = VKAccount.objects.get(id=account_id)
    poster = ReviewPoster(account, community_url, review_text, rating)
    
    asyncio.run(poster.post_review())
