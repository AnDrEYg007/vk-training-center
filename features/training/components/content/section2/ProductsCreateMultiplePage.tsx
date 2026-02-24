import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: строка товара в таблице массового создания
const MockProductRow: React.FC<{ index: number; hasError?: boolean; onRemove?: () => void }> = ({ index, hasError, onRemove }) => (
    <div className={`grid grid-cols-[40px_120px_150px_1fr_80px_80px_80px_40px] gap-2 items-center p-2 border-b hover:bg-gray-50 ${hasError ? 'bg-red-50' : ''}`}>
        <div className="text-center text-xs text-gray-500">{index}</div>
        <input type="text" className={`w-full h-8 px-2 border rounded text-xs ${hasError ? 'border-red-500' : ''}`} placeholder="URL фото" />
        <input type="text" className={`w-full h-8 px-2 border rounded text-xs ${hasError ? 'border-red-500' : ''}`} placeholder="Название" />
        <input type="text" className="w-full h-8 px-2 border rounded text-xs" placeholder="Описание" />
        <input type="number" className={`w-full h-8 px-2 border rounded text-xs no-spinners ${hasError ? 'border-red-500' : ''}`} placeholder="Цена" />
        <input type="number" className="w-full h-8 px-2 border rounded text-xs no-spinners" placeholder="Старая" />
        <input type="text" className="w-full h-8 px-2 border rounded text-xs" placeholder="Артикул" />
        <button 
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Удалить строку"
        >
            ×
        </button>
    </div>
);

// Mock компонент: всплывающее окно массового создания товаров
const MockCreateMultipleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [rows, setRows] = useState([1, 2, 3]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl animate-fade-in-up flex flex-col max-h-[90vh]">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Массовое создание товаров</h2>
                        <p className="text-xs text-gray-500 mt-1">Заполните таблицу для создания нескольких товаров одновременно</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="p-4 overflow-y-auto custom-scrollbar flex-1">
                    <div className="mb-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Категория <span className="text-red-500">*</span></label>
                                <select className="h-9 px-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm w-48">
                                    <option>Выберите категорию...</option>
                                    <option>Еда</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Подборка</label>
                                <select className="h-9 px-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm w-48">
                                    <option>Не выбрано</option>
                                </select>
                            </div>
                        </div>
                        <button 
                            onClick={() => setRows([...rows, rows.length + 1])}
                            className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            + Добавить строку
                        </button>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-[40px_120px_150px_1fr_80px_80px_80px_40px] gap-2 bg-gray-100 p-2 text-xs font-semibold text-gray-700 border-b">
                                <div className="text-center">#</div>
                                <div>Фото URL <span className="text-red-500">*</span></div>
                                <div>Название <span className="text-red-500">*</span></div>
                                <div>Описание <span className="text-red-500">*</span></div>
                                <div>Цена <span className="text-red-500">*</span></div>
                                <div>Старая цена</div>
                                <div>Артикул</div>
                                <div></div>
                            </div>
                            {rows.map((num, idx) => (
                                <MockProductRow 
                                    key={num} 
                                    index={num}
                                    onRemove={() => setRows(rows.filter((_, i) => i !== idx))}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border hover:bg-gray-50">
                            Вставить из буфера
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border hover:bg-gray-50">
                            AI: Сгенерировать описания
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border hover:bg-gray-50">
                            Переменные
                        </button>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <div className="text-sm text-gray-600">
                        Товаров: <strong>{rows.length}</strong> | Заполнено: <strong>0 / {rows.length}</strong>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700">Создать всё</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

// ===================================================================== 
// Основной компонент страницы
// =====================================================================
export const ProductsCreateMultiplePage: React.FC<ContentProps> = ({ title }) => {
    const [showMultipleModal, setShowMultipleModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Используется для добавления нескольких товаров одновременно через табличный интерфейс. 
                Всплывающее окно открывается через выпадающее меню справа от кнопки "Создать" в основной таблице товаров, 
                пункт "Создать несколько товаров".
            </p>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
                <h4 className="font-bold text-purple-900 mb-2">Когда использовать массовое создание:</h4>
                <ul className="space-y-1 text-sm text-purple-800">
                    <li>• Добавление партии похожих товаров (например, пиццы с разными топпингами)</li>
                    <li>• Быстрое заполнение каталога новым ассортиментом</li>
                    <li>• Создание товаров с одинаковой категорией/подборкой</li>
                    <li>• Импорт данных из буфера обмена (скопированы из Excel/Google Sheets)</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Динамический заголовок</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В верхней части модального окна есть два селектора: <strong>Категория</strong> (обязательно) и <strong>Подборка</strong> (необязательно). 
                Выбранные значения автоматически применятся ко всем товарам в таблице.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура таблицы (10 колонок)</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">Каждая строка таблицы — это один товар. Структура:</p>

            <div className="not-prose overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Колонка</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ширина</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Обязательность</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Описание</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">#</td><td className="px-4 py-2 whitespace-nowrap text-xs">40px</td><td className="px-4 py-2 whitespace-nowrap text-xs">—</td><td className="px-4 py-2 text-xs">Порядковый номер строки (нередактируемый)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Фото URL</td><td className="px-4 py-2 whitespace-nowrap text-xs">120px</td><td className="px-4 py-2 whitespace-nowrap text-xs"><span className="text-red-600">*</span></td><td className="px-4 py-2 text-xs">Ссылка на фото товара</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Название</td><td className="px-4 py-2 whitespace-nowrap text-xs">150px</td><td className="px-4 py-2 whitespace-nowrap text-xs"><span className="text-red-600">*</span></td><td className="px-4 py-2 text-xs">Название товара (мин. 4 символа)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Описание</td><td className="px-4 py-2 whitespace-nowrap text-xs">1fr</td><td className="px-4 py-2 whitespace-nowrap text-xs"><span className="text-red-600">*</span></td><td className="px-4 py-2 text-xs">Описание товара (мин. 10 символов)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Цена</td><td className="px-4 py-2 whitespace-nowrap text-xs">80px</td><td className="px-4 py-2 whitespace-nowrap text-xs"><span className="text-red-600">*</span></td><td className="px-4 py-2 text-xs">Цена в рублях (число)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Старая цена</td><td className="px-4 py-2 whitespace-nowrap text-xs">80px</td><td className="px-4 py-2 whitespace-nowrap text-xs">—</td><td className="px-4 py-2 text-xs">Перечеркнутая цена (опционально)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Артикул</td><td className="px-4 py-2 whitespace-nowrap text-xs">80px</td><td className="px-4 py-2 whitespace-nowrap text-xs">—</td><td className="px-4 py-2 text-xs">SKU/артикул (опционально)</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">×</td><td className="px-4 py-2 whitespace-nowrap text-xs">40px</td><td className="px-4 py-2 whitespace-nowrap text-xs">—</td><td className="px-4 py-2 text-xs">Кнопка удаления строки</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Дополнительные возможности</h2>
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Кнопки внизу таблицы:</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>"Вставить из буфера"</strong> — импорт данных из Excel/Google Sheets (табуляция между колонками)</li>
                <li><strong>"AI: Сгенерировать описания"</strong> — автоматическая генерация описаний для всех товаров на основе названий</li>
                <li><strong>"Переменные"</strong> — вставка переменных проекта (например, адрес ресторана) в выбранное поле</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Счетчик прогресса:</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В футере отображается статистика: "Товаров: <strong>5</strong> | Заполнено: <strong>3 / 5</strong>". 
                Товар считается заполненным, если указаны все обязательные поля (Фото URL, Название, Описание, Цена).
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Валидация и ошибки</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Если в строке не заполнено хотя бы одно обязательное поле, строка подсвечивается красным фоном, 
                а при попытке сохранения появляется ошибка: "Заполните все обязательные поля в строках: 1, 3, 5".
            </p>

            <Sandbox 
                title="Попробуйте: Массовое создание товаров"
                description="Нажмите кнопку ниже, чтобы открыть интерактивный пример модального окна массового создания товаров."
                instructions={[
                    'Нажмите кнопку "Создать несколько товаров"',
                    'Изучите табличный интерфейс с 10 колонками',
                    'Попробуйте добавить новую строку кнопкой "+ Добавить строку"',
                    'Удалите строку кликом на "×" в правой колонке',
                    'Обратите внимание на счетчик в футере: "Товаров: X | Заполнено: Y / X"'
                ]}
            >
                <button 
                    onClick={() => setShowMultipleModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Создать несколько товаров
                </button>
                {showMultipleModal && <MockCreateMultipleModal onClose={() => setShowMultipleModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-5-2-create-multiple" />
        </article>
    );
};
