import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: кнопка "Скачать" с раскрывающимся меню (идентична ProductsExportCsvPage)
const MockDownloadButton: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
                {/* Иконка скачивания (из реального ProductsHeader.tsx) */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Скачать
            </button>

            {showMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-48 animate-fade-in-up">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-gray-700 flex items-center gap-2">
                        <span className="font-medium text-green-700">CSV</span>
                        <span className="text-xs text-gray-500">(текущие фильтры)</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                        <span className="font-medium text-blue-700">XLSX</span>
                        <span className="text-xs text-gray-500">(Excel)</span>
                    </button>
                    <div className="border-t my-1"></div>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-500 flex items-center gap-2">
                        <span className="font-medium">Все товары</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export const ProductsExportXlsxPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экспорт в XLSX (Excel) — полнофункциональный формат для работы с данными товаров. 
                В отличие от CSV, сохраняет форматирование, поддерживает формулы и открывается в Excel без дополнительных настроек.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое XLSX формат</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                XLSX — это современный формат Microsoft Excel (.xlsx), который:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Нативный для Excel</strong> — открывается двойным кликом без настроек</li>
                <li><strong>Сохраняет форматирование</strong> — ширина столбцов, выравнивание, стили</li>
                <li><strong>Поддерживает формулы</strong> — можно создавать вычисления прямо в файле</li>
                <li><strong>Множество листов</strong> — один файл может содержать несколько таблиц</li>
                <li><strong>Кириллица</strong> — всегда отображается корректно, без настроек кодировки</li>
            </ul>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✅ Преимущества XLSX:</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                        <li>Открывается сразу в Excel (не нужен импорт)</li>
                        <li>Сохраняются типы данных (число, текст, дата)</li>
                        <li>Можно использовать формулы</li>
                        <li>Красивое оформление (жирный шрифт для заголовков)</li>
                        <li>Фильтры включены автоматически</li>
                    </ul>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">⚠️ Когда CSV лучше:</h4>
                    <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                        <li>Нужна совместимость с другими системами</li>
                        <li>Большие каталоги (XLSX медленнее для 10000+ товаров)</li>
                        <li>Импорт в базы данных или CRM</li>
                        <li>Нужен минимальный размер файла</li>
                    </ul>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура экспортируемого файла</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При экспорте в XLSX приложение создаёт файл <strong>products_export.xlsx</strong> с той же структурой, что и CSV:
            </p>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Столбец</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Тип данных</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Особенности</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">VK ID</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Число</span></td>
                            <td className="px-4 py-2 text-xs">Отрицательное число (ID товара ВКонтакте)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">VK Link</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Гиперссылка</span></td>
                            <td className="px-4 py-2 text-xs">Кликабельная ссылка на товар</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Название</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">Автоподбор ширины столбца</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Описание</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">Перенос строк сохраняется</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Цена</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Число</span></td>
                            <td className="px-4 py-2 text-xs">Можно использовать формулы (наценка, скидки)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Старая цена</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Число</span></td>
                            <td className="px-4 py-2 text-xs">Пустые ячейки если не задана</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Артикул</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">SKU товара</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Категория</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">Название категории ВКонтакте</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Подборка</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">Название альбома (или пусто)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Фото</td>
                            <td className="px-4 py-2 text-xs"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Текст</span></td>
                            <td className="px-4 py-2 text-xs">Ссылки через запятую</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Дополнительные удобства XLSX:</h4>
                <p className="text-sm text-blue-800 mb-2">
                    В отличие от CSV, XLSX-файл уже содержит:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li><strong>Автофильтры</strong> на заголовках — сразу можно фильтровать по категориям</li>
                    <li><strong>Закреплённая первая строка</strong> — заголовки всегда видны при прокрутке</li>
                    <li><strong>Жирный шрифт</strong> для заголовков таблицы</li>
                    <li><strong>Подогнанные столбцы</strong> — ширина автоматически подстроена под содержимое</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как экспортировать товары в XLSX</h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    На странице <strong>"Товары"</strong> найдите зелёную кнопку <strong>"Скачать"</strong> в правом верхнем углу
                </li>
                <li>
                    Нажмите на кнопку — раскроется меню с вариантами
                </li>
                <li>
                    Выберите <strong>"XLSX (Excel)"</strong> — скачаются отфильтрованные товары
                </li>
                <li>
                    Или выберите <strong>"Все товары"</strong> → <strong>XLSX</strong> — скачается весь каталог
                </li>
                <li>
                    Файл <code>products_export.xlsx</code> автоматически загрузится в папку "Загрузки"
                </li>
                <li>
                    Откройте двойным кликом — сразу видна таблица с товарами
                </li>
            </ol>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий: Цикл "Экспорт → Правка → Импорт"</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                XLSX идеально подходит для круговой работы с товарами:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Экспорт в XLSX</h4>
                        <p className="text-sm text-gray-700">
                            Скачиваете все товары в <code>products_export.xlsx</code> — получаете актуальную базу с VK ID
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Редактирование в Excel</h4>
                        <p className="text-sm text-gray-700">
                            Изменяете цены, описания, артикулы прямо в таблице. Используете формулы для массовых изменений 
                            (например, <code>=ОКРУГЛ(E2*1.15;0)</code> для наценки 15%)
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Импорт с обновлением</h4>
                        <p className="text-sm text-gray-700">
                            Загружаете изменённый XLSX обратно, выбираете режим <strong>"Обновить существующие"</strong>, 
                            критерий <strong>"VK ID"</strong> — все товары обновляются за 30 секунд
                        </p>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-2">✅ Пример реального применения:</h4>
                <p className="text-sm text-green-800">
                    Магазин одежды делает сезонные скидки. SMM-менеджер экспортирует 500 товаров в XLSX, 
                    в столбце "Старая цена" прописывает формулу <code>=E2</code> (копирует текущую цену), 
                    в столбце "Цена" вводит <code>=ОКРУГЛ(E2*0.7;0)</code> (скидка 30%). 
                    Загружает файл обратно — у всех товаров появились старые цены и новые со скидкой.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать XLSX экспорт</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">📊 Сложные вычисления</h4>
                    <p className="text-sm text-purple-800">
                        Формулы для наценок, скидок, расчёта маржи — всё в Excel, затем загрузка обратно
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">🔄 Регулярные обновления</h4>
                    <p className="text-sm text-blue-800">
                        Раз в неделю скачиваете XLSX, меняете цены, загружаете — круговая работа
                    </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">📝 Работа с текстами</h4>
                    <p className="text-sm text-orange-800">
                        Копирайтер редактирует описания в Excel (видны переносы строк, удобный интерфейс)
                    </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">👥 Совместная работа</h4>
                    <p className="text-sm text-green-800">
                        XLSX можно загрузить в Google Sheets — несколько человек редактируют одновременно
                    </p>
                </div>
            </div>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно при работе с формулами:</h4>
                <p className="text-sm text-yellow-800">
                    При импорте XLSX-файла приложение читает только <strong>значения</strong> ячеек, а не формулы. 
                    Поэтому перед загрузкой убедитесь, что формулы пересчитались (нажмите Ctrl+Shift+F9 в Excel для принудительного пересчёта).
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Кнопка экспорта XLSX"
                description="Нажмите кнопку чтобы увидеть интерактивный пример меню экспорта (идентичен CSV, но выбирается XLSX)."
                instructions={[
                    'Нажмите зелёную кнопку "Скачать"',
                    'Раскроется меню с вариантами экспорта',
                    'Выберите "XLSX (Excel)" — в реальном приложении начнётся скачивание',
                    'XLSX-файл откроется в Excel двойным кликом'
                ]}
            >
                <MockDownloadButton />
            </Sandbox>

            <NavigationButtons currentPath="2-3-6-5-export-xlsx" />
        </article>
    );
};
