# Антидетект-механизмы

Методы обхода систем детекта ботов VKontakte.

---

## 1. Browser Fingerprinting

### Генерация уникальных отпечатков браузера

```python
import random
import hashlib

def generate_fingerprint(account_id: int) -> dict:
    """Генерирует уникальный fingerprint для аккаунта"""
    
    # Список реальных User-Agent'ов
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ]
    
    # Популярные разрешения экрана
    resolutions = [
        '1920x1080', '1366x768', '1440x900', '1536x864', 
        '1600x900', '2560x1440', '3840x2160'
    ]
    
    # WebGL вендоры
    webgl_vendors = [
        'Intel Inc.',
        'NVIDIA Corporation',
        'AMD',
        'Apple Inc.'
    ]
    
    # Генерация уникального Canvas hash
    def generate_canvas_hash():
        seed = f"canvas_{account_id}_{random.random()}"
        return hashlib.md5(seed.encode()).hexdigest()
    
    # Генерация уникального Audio hash
    def generate_audio_hash():
        seed = f"audio_{account_id}_{random.random()}"
        return hashlib.sha256(seed.encode()).hexdigest()
    
    return {
        'user_agent': random.choice(user_agents),
        'screen_resolution': random.choice(resolutions),
        'timezone': 'Europe/Moscow',
        'language': 'ru-RU',
        'platform': 'Win32' if 'Windows' in random.choice(user_agents) else 'MacIntel',
        'hardware_concurrency': random.choice([4, 6, 8, 12, 16]),
        'device_memory': random.choice([4, 8, 16, 32]),
        'webgl_vendor': random.choice(webgl_vendors),
        'canvas_hash': generate_canvas_hash(),
        'audio_hash': generate_audio_hash(),
        'do_not_track': random.choice(['1', None]),
        'color_depth': 24,
        'pixel_ratio': random.choice([1, 1.5, 2]),
    }
```

### Применение fingerprint в Playwright

```python
from playwright.async_api import async_playwright

async def create_browser_with_fingerprint(fingerprint: dict, proxy: dict):
    """Создает браузер с заданным fingerprint"""
    
    async with async_playwright() as p:
        # Запуск браузера с прокси
        browser = await p.chromium.launch(
            headless=False,  # В продакшене True
            proxy={
                'server': f'http://{proxy["host"]}:{proxy["port"]}',
                'username': proxy.get('username'),
                'password': proxy.get('password')
            },
            args=[
                f'--window-size={fingerprint["screen_resolution"].split("x")[0]},{fingerprint["screen_resolution"].split("x")[1]}',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
            ]
        )
        
        # Создание контекста с fingerprint
        context = await browser.new_context(
            user_agent=fingerprint['user_agent'],
            viewport={
                'width': int(fingerprint['screen_resolution'].split('x')[0]),
                'height': int(fingerprint['screen_resolution'].split('x')[1])
            },
            device_scale_factor=fingerprint['pixel_ratio'],
            locale=fingerprint['language'],
            timezone_id=fingerprint['timezone'],
        )
        
        # Инъекция дополнительных параметров через JS
        await context.add_init_script(f"""
            Object.defineProperty(navigator, 'hardwareConcurrency', {{
                get: () => {fingerprint['hardware_concurrency']}
            }});
            
            Object.defineProperty(navigator, 'deviceMemory', {{
                get: () => {fingerprint['device_memory']}
            }});
            
            Object.defineProperty(navigator, 'webdriver', {{
                get: () => undefined
            }});
            
            // Переопределение WebGL
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {{
                if (parameter === 37445) {{
                    return '{fingerprint['webgl_vendor']}';
                }}
                return getParameter.apply(this, arguments);
            }};
            
            // Переопределение Canvas fingerprint
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {{
                const canvas = this;
                const ctx = canvas.getContext('2d');
                ctx.fillText('{fingerprint['canvas_hash']}', 0, 0);
                return originalToDataURL.apply(this, arguments);
            }};
        """)
        
        page = await context.new_page()
        return browser, context, page
```

---

## 2. Human Behavior Simulation

### Имитация движений мыши

```python
import numpy as np
from typing import Tuple

class MouseSimulator:
    @staticmethod
    def generate_bezier_curve(
        start: Tuple[int, int],
        end: Tuple[int, int],
        control_points: int = 2
    ) -> list:
        """Генерирует кривую Безье для плавного движения мыши"""
        
        # Генерация контрольных точек
        controls = []
        for i in range(control_points):
            x = start[0] + (end[0] - start[0]) * (i + 1) / (control_points + 1)
            y = start[1] + (end[1] - start[1]) * (i + 1) / (control_points + 1)
            # Добавляем случайное отклонение
            x += np.random.randint(-50, 50)
            y += np.random.randint(-50, 50)
            controls.append((x, y))
        
        # Формула Безье
        points = [start] + controls + [end]
        curve = []
        
        for t in np.linspace(0, 1, 50):
            x = sum(
                self._bernstein(i, len(points) - 1, t) * points[i][0]
                for i in range(len(points))
            )
            y = sum(
                self._bernstein(i, len(points) - 1, t) * points[i][1]
                for i in range(len(points))
            )
            curve.append((int(x), int(y)))
        
        return curve
    
    @staticmethod
    def _bernstein(i, n, t):
        """Полином Бернштейна"""
        from math import comb
        return comb(n, i) * (t ** i) * ((1 - t) ** (n - i))
    
    async def move_to_element(self, page, element):
        """Плавное движение мыши к элементу"""
        
        # Получаем координаты элемента
        box = await element.bounding_box()
        if not box:
            return
        
        target_x = box['x'] + box['width'] / 2
        target_y = box['y'] + box['height'] / 2
        
        # Получаем текущую позицию мыши (приблизительно)
        current_x = np.random.randint(0, 800)
        current_y = np.random.randint(0, 600)
        
        # Генерируем кривую
        curve = self.generate_bezier_curve(
            (current_x, current_y),
            (int(target_x), int(target_y))
        )
        
        # Двигаем мышь по кривой
        for x, y in curve:
            await page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.01, 0.03))
```

### Имитация скролла

```python
class ScrollSimulator:
    @staticmethod
    async def scroll_page_naturally(page, duration: int = 20):
        """Плавный скролл страницы как человек"""
        
        # Получаем высоту страницы
        total_height = await page.evaluate('document.body.scrollHeight')
        viewport_height = await page.evaluate('window.innerHeight')
        
        scrolled = 0
        scroll_steps = random.randint(8, 15)
        
        for _ in range(scroll_steps):
            # Случайное расстояние прокрутки
            scroll_distance = random.randint(150, 400)
            
            # Плавная прокрутка
            await page.evaluate(f'''
                window.scrollBy({{
                    top: {scroll_distance},
                    behavior: 'smooth'
                }});
            ''')
            
            scrolled += scroll_distance
            
            # Случайная пауза (имитация чтения)
            await asyncio.sleep(random.uniform(1.5, 4.0))
            
            # Иногда скроллим назад (перечитывание)
            if random.random() < 0.2:
                back_scroll = random.randint(50, 150)
                await page.evaluate(f'window.scrollBy(0, -{back_scroll})')
                await asyncio.sleep(random.uniform(0.5, 1.5))
            
            # Прерываемся, если достигли конца
            if scrolled >= total_height - viewport_height:
                break
```

### Имитация печати

```python
class TypingSimulator:
    # Частые опечатки (соседние клавиши)
    TYPO_MAP = {
        'а': ['я', 'с'],
        'о': ['р', 'п'],
        'е': ['в', 'к'],
        # ... и т.д. для всей клавиатуры
    }
    
    @staticmethod
    async def type_like_human(page, selector: str, text: str):
        """Печатает текст с опечатками и исправлениями"""
        
        for i, char in enumerate(text):
            # 5% шанс опечатки
            if random.random() < 0.05 and char in TypingSimulator.TYPO_MAP:
                # Печатаем неправильный символ
                wrong_char = random.choice(TypingSimulator.TYPO_MAP[char])
                await page.type(selector, wrong_char, delay=random.uniform(80, 150))
                
                # Небольшая пауза "осознания ошибки"
                await asyncio.sleep(random.uniform(0.2, 0.5))
                
                # Удаляем
                await page.keyboard.press('Backspace')
                await asyncio.sleep(random.uniform(0.1, 0.2))
            
            # Печатаем правильный символ
            await page.type(selector, char, delay=random.uniform(80, 200))
            
            # Случайные паузы (имитация обдумывания)
            if char in [',', '.', '!', '?'] or (i > 0 and text[i-1] == ' '):
                if random.random() < 0.3:
                    await asyncio.sleep(random.uniform(0.5, 2.0))
```

---

## 3. Proxy Management

### Ротация прокси

```python
from dataclasses import dataclass
from datetime import datetime, timedelta
import asyncio

@dataclass
class Proxy:
    id: int
    host: str
    port: int
    username: str
    password: str
    country: str
    city: str
    last_used: datetime = None
    usage_count: int = 0

class ProxyManager:
    def __init__(self, proxy_pool: list[Proxy]):
        self.proxy_pool = proxy_pool
        self.cooldown_minutes = 120  # 2 часа между использованиями
    
    def get_available_proxy(
        self,
        country: str = 'RU',
        city: str = None
    ) -> Proxy:
        """Возвращает доступный прокси"""
        
        now = datetime.now()
        cooldown_threshold = now - timedelta(minutes=self.cooldown_minutes)
        
        # Фильтруем прокси
        available = [
            p for p in self.proxy_pool
            if p.country == country
            and (not city or p.city == city)
            and (not p.last_used or p.last_used < cooldown_threshold)
        ]
        
        if not available:
            raise Exception("Нет доступных прокси")
        
        # Выбираем наименее использованный
        proxy = min(available, key=lambda p: p.usage_count)
        
        # Обновляем статистику
        proxy.last_used = now
        proxy.usage_count += 1
        
        return proxy
    
    def rotate_proxy_after_actions(
        self,
        account,
        action_count: int,
        threshold: int = 10
    ):
        """Меняет прокси после N действий"""
        
        if action_count % threshold == 0:
            new_proxy = self.get_available_proxy(
                country='RU',
                city=random.choice(['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk'])
            )
            account.proxy = new_proxy
            account.save()
            
            return new_proxy
        
        return account.proxy
```

### Проверка "здоровья" прокси

```python
import aiohttp

class ProxyHealthChecker:
    @staticmethod
    async def check_proxy_health(proxy: Proxy) -> bool:
        """Проверяет работоспособность прокси"""
        
        proxy_url = f'http://{proxy.username}:{proxy.password}@{proxy.host}:{proxy.port}'
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    'https://httpbin.org/ip',
                    proxy=proxy_url,
                    timeout=10
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        # Проверяем, что IP изменился
                        return data.get('origin') != 'ваш_реальный_ip'
        except:
            return False
        
        return False
    
    @staticmethod
    async def check_vk_ban(proxy: Proxy) -> bool:
        """Проверяет, не забанен ли IP в VK"""
        
        proxy_url = f'http://{proxy.username}:{proxy.password}@{proxy.host}:{proxy.port}'
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    'https://vk.com/',
                    proxy=proxy_url,
                    timeout=10
                ) as response:
                    html = await response.text()
                    # Проверяем на признаки бана
                    return 'access_denied' not in html and response.status != 403
        except:
            return False
```

---

## 4. Captcha Solving

### Интеграция с 2captcha

```python
import aiohttp

class CaptchaSolver:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://2captcha.com'
    
    async def solve_recaptcha_v2(
        self,
        site_key: str,
        page_url: str
    ) -> str:
        """Решает reCAPTCHA v2"""
        
        # 1. Отправляем запрос на решение
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f'{self.base_url}/in.php',
                data={
                    'key': self.api_key,
                    'method': 'userrecaptcha',
                    'googlekey': site_key,
                    'pageurl': page_url,
                    'json': 1
                }
            ) as response:
                result = await response.json()
                
                if result['status'] != 1:
                    raise Exception(f"Ошибка 2captcha: {result}")
                
                captcha_id = result['request']
        
        # 2. Ждем решения (обычно 20-40 секунд)
        await asyncio.sleep(20)
        
        # 3. Получаем результат
        for _ in range(20):  # Максимум 20 попыток (2 минуты)
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f'{self.base_url}/res.php',
                    params={
                        'key': self.api_key,
                        'action': 'get',
                        'id': captcha_id,
                        'json': 1
                    }
                ) as response:
                    result = await response.json()
                    
                    if result['status'] == 1:
                        return result['request']  # Токен решения
                    
                    if result['request'] == 'CAPCHA_NOT_READY':
                        await asyncio.sleep(5)
                        continue
                    
                    raise Exception(f"Ошибка решения: {result}")
        
        raise Exception("Таймаут решения капчи")
    
    async def apply_captcha_solution(self, page, solution_token: str):
        """Применяет решение капчи на странице"""
        
        await page.evaluate(f'''
            document.getElementById('g-recaptcha-response').innerHTML = '{solution_token}';
            ___grecaptcha_cfg.clients[0].aa.callback('{solution_token}');
        ''')
```

---

## 5. Session Persistence

### Сохранение cookies между сессиями

```python
import json
from datetime import datetime

class SessionManager:
    @staticmethod
    async def save_session(account, browser_context):
        """Сохраняет сессию аккаунта"""
        
        # Получаем cookies
        cookies = await browser_context.cookies()
        
        # Получаем localStorage
        storage = await browser_context.storage_state()
        
        # Сохраняем в базу
        account.cookies = json.dumps(cookies)
        account.local_storage = json.dumps(storage)
        account.last_session = datetime.now()
        account.save()
    
    @staticmethod
    async def restore_session(account, browser_context):
        """Восстанавливает сессию аккаунта"""
        
        if not account.cookies:
            return False
        
        # Восстанавливаем cookies
        cookies = json.loads(account.cookies)
        await browser_context.add_cookies(cookies)
        
        # Восстанавливаем localStorage
        if account.local_storage:
            storage = json.loads(account.local_storage)
            await browser_context.add_storage_state(storage)
        
        return True
```

---

## 6. Временные задержки

```python
class DelayManager:
    # Задержки в секундах
    DELAYS = {
        'after_login': (5, 15),
        'between_actions': (3, 10),
        'before_review': (2, 5),
        'after_page_load': (2, 4),
        'between_accounts': (3600, 7200),  # 1-2 часа
        'proxy_reuse': 7200,  # 2 часа
        'warm_up_period': 86400,  # 24 часа
    }
    
    @staticmethod
    async def random_delay(delay_type: str):
        """Случайная задержка заданного типа"""
        
        if delay_type not in DelayManager.DELAYS:
            raise ValueError(f"Unknown delay type: {delay_type}")
        
        min_delay, max_delay = DelayManager.DELAYS[delay_type]
        delay = random.uniform(min_delay, max_delay)
        
        await asyncio.sleep(delay)
```

---

## 7. Detection Evasion Checklist

```python
async def check_detection_evasion(page) -> dict:
    """Проверяет, насколько хорошо скрыт бот"""
    
    results = {}
    
    # 1. Проверка navigator.webdriver
    results['webdriver'] = await page.evaluate('navigator.webdriver === undefined')
    
    # 2. Проверка navigator.languages
    results['languages'] = await page.evaluate('navigator.languages.length > 0')
    
    # 3. Проверка navigator.plugins
    results['plugins'] = await page.evaluate('navigator.plugins.length > 0')
    
    # 4. Проверка WebGL
    results['webgl'] = await page.evaluate('''
        (() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            return gl !== null;
        })()
    ''')
    
    # 5. Проверка canvas fingerprint
    results['canvas'] = await page.evaluate('''
        (() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.fillText('test', 0, 0);
            return canvas.toDataURL().length > 100;
        })()
    ''')
    
    # 6. Проверка User-Agent
    results['user_agent'] = await page.evaluate('''
        navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Headless')
    ''')
    
    return results
```

---

## Итоговые рекомендации

### Критические моменты:

1. **Fingerprinting** — каждый аккаунт должен иметь уникальный отпечаток
2. **Human behavior** — движения мыши, задержки, опечатки
3. **Proxy rotation** — резидентные прокси с cooldown 2+ часа
4. **Session persistence** — сохранение cookies между днями
5. **Captcha solving** — автоматическое решение через 2captcha

### Метрики успешности обхода:

- Менее 5% аккаунтов забанено в месяц
- Менее 10% отзывов удалено модераторами
- Средняя "жизнь" аккаунта > 6 месяцев

---

**Disclaimer:** Все методы описаны исключительно в образовательных целях. Использование противоправно.
