import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: кнопка "Скачать" с раскрывающимся меню
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

export const ProductsExportCsvPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экспорт в CSV — универсальный формат, который открывается в Excel, Google Sheets, LibreOffice и других программах. 
                Идеально подходит для быстрой выгрузки, резервного копирования или передачи данных в другие системы.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое CSV формат</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                CSV (Comma-Separated Values) — текстовый формат, где данные записаны в виде таблицы:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Строки</strong> — каждая строка файла = одна запись (товар)</li>
                <li><strong>Столбцы</strong> — значения разделены запятыми</li>
                <li><strong>Первая строка</strong> — заголовки столбцов</li>
                <li><strong>Кодировка</strong> — UTF-8 с BOM (для правильного отображения кириллицы в Excel)</li>
            </ul>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 my-6 font-mono text-xs overflow-x-auto">
                <pre className="text-gray-800">VK ID,VK Link,Название,Описание,Цена,Старая цена,Артикул,Категория,Подборка,Фото
-522792803,"https://vk.com/product-199...","Футболка Basic белая","Базовая футболка из хлопка",1200,1500,"SKU001","Одежда","Новинки","photo1.jpg"
-522792804,"https://vk.com/product-199...","Джинсы Slim синие","Зауженные джинсы",3500,4200,"SKU002","Одежда","Акции","photo2.jpg"</pre>
            </div>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-2">✅ Преимущества CSV:</h4>
                <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li><strong>Универсальность</strong> — открывается везде без специальных программ</li>
                    <li><strong>Малый размер</strong> — файлы легче чем XLSX (важно для больших каталогов)</li>
                    <li><strong>Скорость</strong> — быстрее генерируется и открывается</li>
                    <li><strong>Совместимость</strong> — можно импортировать в любые системы учёта</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура экспортируемого файла</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При экспорте в CSV приложение создаёт файл <strong>products_export.csv</strong> со следующими столбцами:
            </p>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Столбец</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Описание</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Пример значения</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">VK ID</td>
                            <td className="px-4 py-2 text-xs">Уникальный идентификатор VK</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-500">-522792803</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">VK Link</td>
                            <td className="px-4 py-2 text-xs">Ссылка на товар ВКонтакте</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-500 truncate max-w-xs">https://vk.com/product-199...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Название</td>
                            <td className="px-4 py-2 text-xs">Заголовок товара</td>
                            <td className="px-4 py-2 text-xs text-gray-700">Футболка Basic белая</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Описание</td>
                            <td className="px-4 py-2 text-xs">Полное описание</td>
                            <td className="px-4 py-2 text-xs text-gray-700">Базовая футболка из хлопка</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Цена</td>
                            <td className="px-4 py-2 text-xs">Цена в рублях (число)</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-700">1200</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Старая цена</td>
                            <td className="px-4 py-2 text-xs">Перечёркнутая цена</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-700">1500</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Артикул</td>
                            <td className="px-4 py-2 text-xs">SKU товара</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-700">SKU001</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Категория</td>
                            <td className="px-4 py-2 text-xs">Категория VK</td>
                            <td className="px-4 py-2 text-xs text-gray-700">Одежда</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Подборка</td>
                            <td className="px-4 py-2 text-xs">Название подборки</td>
                            <td className="px-4 py-2 text-xs text-gray-700">Новинки</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-indigo-600">Фото</td>
                            <td className="px-4 py-2 text-xs">Ссылки на изображения</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-500 truncate max-w-xs">photo1.jpg, photo2.jpg</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как экспортировать товары в CSV</h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    На странице <strong>"Товары"</strong> найдите зелёную кнопку <strong>"Скачать"</strong> в правом верхнем углу
                </li>
                <li>
                    Нажмите на кнопку — раскроется меню с вариантами
                </li>
                <li>
                    Выберите <strong>"CSV (текущие фильтры)"</strong> — скачаются только отфильтрованные товары
                </li>
                <li>
                    Или выберите <strong>"Все товары"</strong> — скачаются все товары каталога без фильтров
                </li>
                <li>
                    Файл <code>products_export.csv</code> автоматически загрузится в папку "Загрузки"
                </li>
            </ol>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Экспорт с фильтрами:</h4>
                <p className="text-sm text-blue-800">
                    Если перед экспортом применить фильтры (по категории, подборке, тэгу) — в CSV попадут только подходящие товары. 
                    Удобно для выборочных выгрузок: "Все футболки", "Товары со скидкой", "Новинки февраля".
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать CSV экспорт</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">📊 Анализ данных</h4>
                    <p className="text-sm text-orange-800">
                        Скачайте CSV, откройте в Excel — стройте сводные таблицы, графики, анализируйте продажи
                    </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">💾 Резервные копии</h4>
                    <p className="text-sm text-green-800">
                        Делайте периодические экспорты — если что-то удалилось, можно восстановить из резервной копии
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">🔗 Интеграция с 1С</h4>
                    <p className="text-sm text-blue-800">
                        Экспортируйте товары в CSV, импортируйте в учётную систему — автоматическая синхронизация каталогов
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">✏️ Массовое редактирование</h4>
                    <p className="text-sm text-purple-800">
                        Отредактируйте CSV в Google Sheets (текстовые формулы, автозаполнение), загрузите обратно
                    </p>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Работа с CSV в Excel</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При открытии CSV-файла в Excel важно правильно настроить кодировку, чтобы кириллица отображалась корректно:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Способ 1 (автоматический):</strong> Перетащите файл в открытый Excel — BOM-маркер сработает автоматически
                </li>
                <li>
                    <strong>Способ 2 (через импорт):</strong> Данные → Из текста → Выбрать UTF-8 → Разделитель "Запятая"
                </li>
                <li>
                    После открытия можно редактировать данные, сохранить как CSV и загрузить обратно в приложение
                </li>
            </ol>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про запятые:</h4>
                <p className="text-sm text-yellow-800">
                    CSV использует запятые как разделители. Если в тексте (описание, название) есть запятая, 
                    значение автоматически оборачивается в кавычки: "Футболка, размер M". Excel обрабатывает это корректно.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Кнопка экспорта CSV"
                description="Нажмите кнопку чтобы увидеть интерактивный пример меню экспорта."
                instructions={[
                    'Нажмите зелёную кнопку "Скачать"',
                    'Раскроется меню с вариантами экспорта',
                    'Попробуйте разные варианты (CSV, XLSX, Все товары)',
                    'В реальном приложении начнётся скачивание файла'
                ]}
            >
                <MockDownloadButton />
            </Sandbox>

            <NavigationButtons currentPath="2-3-6-4-export-csv" />
        </article>
    );
};
