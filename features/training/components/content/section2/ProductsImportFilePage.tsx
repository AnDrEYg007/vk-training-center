import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: всплывающее окно выбора режима загрузки
const MockUploadOptionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [addPrefix, setAddPrefix] = useState(true);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Загрузка товаров из файла</h2>
                    <p className="text-sm text-gray-500 mt-1">Файл: <span className="font-medium">products.xlsx</span></p>
                </header>
                
                <main className="p-6 space-y-4">
                    <p className="text-sm text-gray-700">Что вы хотите сделать с данными из этого файла?</p>
                    
                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                        <button 
                            onClick={() => setMode('create')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'create' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Создать новые товары
                        </button>
                        <button 
                            onClick={() => setMode('update')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'update' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Обновить существующие
                        </button>
                    </div>

                    {mode === 'create' && (
                        <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg animate-fade-in-up">
                            <p className="text-xs text-indigo-700 mb-3">Данные из файла будут добавлены в таблицу массового создания. Поля "VK ID" и "VK Link" будут проигнорированы.</p>
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setAddPrefix(prev => !prev)}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${addPrefix ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${addPrefix ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <label 
                                    onClick={() => setAddPrefix(prev => !prev)}
                                    className="text-sm text-gray-700 cursor-pointer"
                                >
                                    Добавить "NEW" в начало названия
                                </label>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'update' && (
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg animate-fade-in-up">
                            <p className="text-xs text-blue-700">Система попытается найти товары из вашего файла среди существующих в проекте и предложит применить изменения.</p>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Продолжить</button>
                </footer>
            </div>
        </div>
    );
};

// Mock компонент: кнопка загрузки файла
const MockUploadButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" transform="rotate(180 12 12)" />
        </svg>
        Загрузить
    </button>
);

export const ProductsImportFilePage: React.FC<ContentProps> = ({ title }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Загрузка товаров из файла CSV или XLSX позволяет добавить сразу много товаров или обновить существующие. 
                Кнопка "Загрузить" находится в правом верхнем углу таблицы товаров.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Поддерживаемые форматы</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        CSV (с разделителем запятая)
                    </h4>
                    <p className="text-sm text-green-800 mb-2">Обычный текстовый формат, открывается в Excel/LibreOffice</p>
                    <ul className="text-xs text-green-700 space-y-1">
                        <li>✓ Поддержка кириллицы (UTF-8 с BOM)</li>
                        <li>✓ Быстрая загрузка больших файлов</li>
                        <li>✓ Совместимость с любыми таблицами</li>
                    </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        XLSX (Microsoft Excel)
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">Современный формат Excel, сохраняет форматирование</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>✓ Нативная работа в Excel/Google Sheets</li>
                        <li>✓ Поддержка формул (пересчёт перед загрузкой)</li>
                        <li>✓ Удобное редактирование</li>
                    </ul>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 1: Выбор файла</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Нажмите кнопку <strong>"Загрузить"</strong> в шапке таблицы товаров. Откроется диалог выбора файла. 
                Система принимает файлы с расширениями <code className="text-xs">.csv</code>, <code className="text-xs">.xlsx</code>, <code className="text-xs">.xls</code>.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 2: Выбор режима работы</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                После выбора файла появится всплывающее окно с двумя режимами работы:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 1: Создать новые товары</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Данные из файла добавятся в таблицу массового создания товаров</li>
                <li>Можно включить автоматическое добавление префикса "NEW " к названиям</li>
                <li>Поля "VK ID" и "VK Link" игнорируются (они присваиваются VK при создании)</li>
                <li>После маппинга колонок откроется окно массового создания для проверки и редактирования</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 2: Обновить существующие</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Система найдёт товары из файла среди существующих в проекте</li>
                <li>Поиск по VK ID, ссылке VK, названию или артикулу (выбирается в следующем окне)</li>
                <li>Показывает что изменится: было → стало</li>
                <li>Можно выбрать, какие поля обновлять (название, цена, описание и т.д.)</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про режим обновления:</h4>
                <p className="text-sm text-yellow-800">
                    Если в файле есть товары, которых нет в системе (не нашлись по выбранному критерию), 
                    они попадут в категорию "Не найдено / Новые". Их можно будет создать отдельной кнопкой 
                    после завершения обновления существующих.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 3: Настройка маппинга колонок</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                После выбора режима откроется окно сопоставления колонок файла с полями системы. 
                Подробнее об этом читайте в разделе <strong>"Маппинг колонок при импорте"</strong>.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура файла для импорта</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Файл должен содержать заголовки в первой строке. Система автоматически распознаёт стандартные названия:
            </p>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Название колонки (рус)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Поле системы</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Обязательность</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">VK ID</td><td className="px-4 py-2 text-xs">Идентификатор товара в VK</td><td className="px-4 py-2 text-xs">Для обновления</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">VK Link</td><td className="px-4 py-2 text-xs">Ссылка на товар в VK</td><td className="px-4 py-2 text-xs">Для обновления</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Название</td><td className="px-4 py-2 text-xs">Название товара</td><td className="px-4 py-2 text-xs"><span className="text-red-600">Обязательно</span></td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Описание</td><td className="px-4 py-2 text-xs">Описание товара</td><td className="px-4 py-2 text-xs"><span className="text-red-600">Обязательно</span></td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Цена</td><td className="px-4 py-2 text-xs">Цена в рублях</td><td className="px-4 py-2 text-xs"><span className="text-red-600">Обязательно</span></td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Старая цена</td><td className="px-4 py-2 text-xs">Перечёркнутая цена</td><td className="px-4 py-2 text-xs">Необязательно</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Артикул</td><td className="px-4 py-2 text-xs">SKU товара</td><td className="px-4 py-2 text-xs">Необязательно</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Фото (URL)</td><td className="px-4 py-2 text-xs">Ссылка на изображение</td><td className="px-4 py-2 text-xs"><span className="text-red-600">Обязательно</span></td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Подборка</td><td className="px-4 py-2 text-xs">Название подборки</td><td className="px-4 py-2 text-xs">Необязательно</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">Категория</td><td className="px-4 py-2 text-xs">Категория VK</td><td className="px-4 py-2 text-xs">Необязательно</td></tr>
                    </tbody>
                </table>
            </div>

            <Sandbox 
                title="Попробуйте: Загрузка файла"
                description="Нажмите кнопку 'Загрузить' чтобы открыть всплывающее окно выбора режима импорта."
                instructions={[
                    'Нажмите кнопку "Загрузить"',
                    'Изучите два режима работы: "Создать новые товары" и "Обновить существующие"',
                    'Попробуйте переключить переключатель "Добавить NEW в начало названия"',
                    'Обратите внимание на разные цвета фона для каждого режима (индиго и синий)'
                ]}
            >
                <MockUploadButton onClick={() => setShowUploadModal(true)} />
                {showUploadModal && <MockUploadOptionsModal onClose={() => setShowUploadModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-6-1-import-file" />
        </article>
    );
};
