import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// Детальные страницы вынесены в отдельные файлы
export { ProductsTableColumnsPage } from './ProductsTableColumnsPage';
export { ProductsColumnVisibilityPage } from './ProductsColumnVisibilityPage';
export { ProductsSearchPage } from './ProductsSearchPage';
export { ProductsAlbumFiltersPage } from './ProductsAlbumFiltersPage';
export { ProductsCategoryFiltersPage } from './ProductsCategoryFiltersPage';
export { ProductsCreateIntroPage } from './ProductsCreateIntroPage';
export { ProductsCreateSinglePage } from './ProductsCreateSinglePage';
export { ProductsCreateMultiplePage } from './ProductsCreateMultiplePage';
export { ProductsPasteClipboardPage } from './ProductsPasteClipboardPage';
export { ProductsImportExportIntroPage } from './ProductsImportExportIntroPage';
export { ProductsImportFilePage } from './ProductsImportFilePage';
export { ProductsColumnMappingPage } from './ProductsColumnMappingPage';
export { ProductsUpdateFromFilePage } from './ProductsUpdateFromFilePage';
export { ProductsExportCsvPage } from './ProductsExportCsvPage';
export { ProductsExportXlsxPage } from './ProductsExportXlsxPage';
export { ProductsBulkEditIntroPage } from './ProductsBulkEditIntroPage';
export { ProductsBulkPricePage } from './ProductsBulkPricePage';
export { ProductsBulkOldPricePage } from './ProductsBulkOldPricePage';
export { ProductsBulkTitlePage } from './ProductsBulkTitlePage';
export { ProductsBulkDescriptionPage } from './ProductsBulkDescriptionPage';
export { ProductsBulkAlbumPage } from './ProductsBulkAlbumPage';
export { ProductsBulkCategoryPage } from './ProductsBulkCategoryPage';
export { ProductsAICategoriesPage } from './ProductsAICategoriesPage';
export { ProductsDescriptionEditorPage } from './ProductsDescriptionEditorPage';
export { ProductsDiffViewerPage } from './ProductsDiffViewerPage';
export { ProductsSaveResultsPage } from './ProductsSaveResultsPage';

// Заглушка для страниц, которые ещё не созданы
const PlaceholderPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Эта страница находится в разработке.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Нажмите кнопку <strong>"Колонки"</strong> в шапке</li>
                <li>Откроется всплывающее окно со списком всех колонок</li>
                <li>Снимите галочки с ненужных столбцов — они исчезнут из таблицы</li>
                <li>Настройки автоматически сохраняются в localStorage браузера</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример:</strong> Если вы работаете только с ценами, скройте все колонки кроме названия, фото и цены. 
                Таблица станет компактной, работать будет удобнее.
            </p>

            <NavigationButtons currentPath="2-3-2-2-column-visibility" />
        </article>
    );
};

export const ProductsSortSearchPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Поиск по всем полям</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Поле поиска в шапке таблицы ищет одновременно по всем текстовым полям:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Название товара</li>
                <li>Описание</li>
                <li>Артикул (SKU)</li>
                <li>Цена (можно ввести "1200" и найти все товары по этой цене)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Поиск мгновенный — результаты обновляются по мере ввода. 
                <strong>Пример:</strong> Введите "футболка" — увидите все товары с этим словом в названии или описании.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сортировка колонок</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Нажмите на заголовок любой колонки — таблица отсортируется по этому полю:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>По названию:</strong> Алфавитный порядок (А→Я или Я→А)</li>
                <li><strong>По цене:</strong> От дешёвых к дорогим или наоборот</li>
                <li><strong>По доступности:</strong> Сначала в наличии, потом отсутствующие</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Повторное нажатие меняет направление сортировки (возрастание ↔ убывание).
            </p>

            <NavigationButtons currentPath="2-3-2-3-sort-search" />
        </article>
    );
};

export const ProductsImportExportPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Импорт и экспорт — это самый мощный инструмент для работы с большими объёмами товаров. 
                Вместо ручного редактирования сотен товаров, вы работаете в привычном Excel или Google Таблицах.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Экспорт товаров
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Нажмите кнопку <strong>"Скачать"</strong> (↓) в шапке и выберите формат:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>CSV:</strong> Текстовый формат, открывается в любом редакторе, легковесный</li>
                <li><strong>XLSX:</strong> Формат Excel с форматированием, удобнее для просмотра</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Файл содержит все текущие товары с учётом активных фильтров. 
                Если выбрана подборка "Новинки" — скачаются только товары из неё.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Импорт: два режима работы
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При загрузке файла система предложит выбрать режим:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Режим 1: Создание новых товаров
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Все товары из файла добавляются как новые</li>
                <li>Система не проверяет дубликаты</li>
                <li>Подходит для первичной загрузки ассортимента</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Режим 2: Обновление существующих товаров
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Система сопоставляет товары из файла с товарами в VK</li>
                <li>Обновляет только изменённые поля</li>
                <li>Новые товары (без совпадений) создаются автоматически</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Сопоставление происходит по одному из полей:</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>vk_id:</strong> Внутренний ID товара в VK (самый надёжный способ)</li>
                <li><strong>vk_link:</strong> Ссылка на товар в VK (например, https://vk.com/market-123_456)</li>
                <li><strong>Артикул (SKU):</strong> Уникальный артикул товара</li>
                <li><strong>Название:</strong> Сопоставление по точному совпадению названия</li>
            </ul>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Маппинг колонок (сопоставление)
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После загрузки файла откроется окно маппинга — это интерфейс, где вы указываете, какая колонка файла соответствует какому полю товара:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Система автоматически угадывает колонки по названиям (например, "Название" → title, "Цена" → price)</li>
                <li>Если автоопределение ошиблось — выберите правильное соответствие вручную</li>
                <li>Колонки, которые не нужны, можно оставить "Не импортировать"</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример:</strong> В вашем файле колонка называется "Наименование", а система ожидает "Название". 
                В окне маппинга вы просто выбираете "Наименование" → "title", и импорт пройдёт корректно.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Предпросмотр изменений
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Перед применением импорта система показывает детальный отчёт:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Будет создано:</strong> Количество новых товаров</li>
                <li><strong>Будет обновлено:</strong> Количество изменённых товаров</li>
                <li><strong>Изменения по каждому товару:</strong> Визуализация "было → стало" (красный текст = удалено, зелёный = добавлено)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Только после подтверждения система применит изменения. Это защита от случайных ошибок.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Типичный сценарий: массовое обновление цен
            </h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Экспортируйте товары в XLSX</li>
                <li>Откройте файл в Excel, измените цены в колонке "Цена"</li>
                <li>Сохраните файл</li>
                <li>Загрузите файл обратно в систему, выберите режим "Обновление существующих"</li>
                <li>Убедитесь, что маппинг правильный (колонка "vk_id" должна быть сопоставлена)</li>
                <li>Просмотрите изменения — система покажет какие цены изменятся</li>
                <li>Подтвердите — все товары обновятся в VK</li>
            </ol>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Результат:</strong> Вы изменили цены 200 товаров за 2 минуты вместо 2 часов ручной работы.
            </p>

            <NavigationButtons currentPath="2-3-6-import-export" />
        </article>
    );
};

export const ProductsBulkEditPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое редактирование позволяет изменить один параметр у десятков товаров одновременно. 
                Это быстрее, чем редактировать каждый товар вручную или использовать импорт из файла.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как использовать массовое редактирование
            </h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Включите режим выбора (чекбокс в шапке таблицы)</li>
                <li>Отметьте нужные товары (или используйте фильтры и выберите все)</li>
                <li>Нажмите кнопку <strong>"Изменить"</strong></li>
                <li>Выберите поле для редактирования из выпадающего меню</li>
                <li>Откроется всплывающее окно с настройками изменения</li>
                <li>Просмотрите предпросмотр изменений</li>
                <li>Подтвердите — изменения применятся ко всем выбранным товарам</li>
            </ol>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Виды массового редактирования
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                1. Массовое редактирование цен
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Три режима изменения цены:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Установить новую цену:</strong> Все товары получат одинаковую цену (например, 1000₽)</li>
                <li><strong>Округлить до:</strong> Округление до 10, 50, 100, 500, 1000₽ (1234₽ → 1200₽)</li>
                <li><strong>Изменить на:</strong> Увеличить/уменьшить на фиксированную сумму или процент (например, +10% или -200₽)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                2. Массовое редактирование старых цен
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Работает так же, как с основной ценой, плюс дополнительная опция:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Установить из текущей цены:</strong> Старая цена = текущая цена + N% (для быстрого создания скидок)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример:</strong> Товар стоит 1000₽, вы ставите "Установить из текущей +20%" — старая цена станет 1200₽, 
                на сайте VK товар будет отображаться со скидкой 200₽.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                3. Массовое редактирование названий
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Два режима:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Вставить текст:</strong> Добавить фразу в начало или конец каждого названия (например, "🔥 " в начало)</li>
                <li><strong>Удалить текст:</strong> Убрать фразу из названий (например, удалить " [АКЦИЯ]" из всех товаров)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                4. Массовое редактирование описаний
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Работает так же, как с названиями — вставка или удаление текста. 
                Полезно для добавления условий доставки или контактов в конец каждого описания.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                5. Массовое изменение подборок
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Выберите новую подборку из списка — все товары переместятся в неё. 
                Можно также выбрать "Убрать из подборки" — товары останутся вне альбомов.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                6. Массовое изменение категорий
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Два режима:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Выбрать категорию вручную:</strong> Все товары получат одинаковую категорию</li>
                <li><strong>AI-подбор:</strong> Искусственный интеллект проанализирует название и описание каждого товара и подберёт подходящую категорию</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Важно:</strong> AI-подбор работает индивидуально для каждого товара — разные товары могут получить разные категории.
            </p>

            <NavigationButtons currentPath="2-3-7-bulk-edit" />
        </article>
    );
};
