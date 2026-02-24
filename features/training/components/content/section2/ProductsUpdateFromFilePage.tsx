import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: заголовок модального окна обновления
const MockUpdateHeader: React.FC = () => {
    const [matchKey, setMatchKey] = useState<'vk_id' | 'title' | 'sku'>('vk_id');
    const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(['title', 'price', 'description']));

    const toggleField = (field: string) => {
        const newSet = new Set(selectedFields);
        if (newSet.has(field)) {
            newSet.delete(field);
        } else {
            newSet.add(field);
        }
        setSelectedFields(newSet);
    };

    return (
        <div className="p-5 border-b bg-gray-50 space-y-5">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Обновление из файла</h2>
                    <p className="text-sm text-gray-500 mt-1">Файл: <span className="font-medium text-gray-700">products_update.xlsx</span> - 50 строк</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Блок 1: Искать по */}
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">1. Искать совпадения по:</label>
                    <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
                        {[
                            { key: 'vk_id', label: 'VK ID' },
                            { key: 'title', label: 'Название' },
                            { key: 'sku', label: 'Артикул' }
                        ].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setMatchKey(opt.key as any)}
                                className={`flex-1 h-8 text-sm font-medium rounded-md transition-all shadow-sm ${
                                    matchKey === opt.key 
                                    ? 'bg-white text-indigo-600 shadow' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Блок 2: Обновлять поля */}
                <div className="flex-[2]">
                    <div className="flex items-center gap-4 mb-2.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">2. Обновлять поля:</label>
                        <div className="flex gap-2">
                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline">Выбрать все</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline">Сбросить</button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Название', 'Описание', 'Цена', 'Старая цена', 'Артикул'].map(field => {
                            const fieldKey = field.toLowerCase().replace(' ', '_');
                            const isSelected = selectedFields.has(fieldKey) || selectedFields.has(field.toLowerCase());
                            return (
                                <button
                                    key={field}
                                    onClick={() => toggleField(fieldKey)}
                                    className={`px-3 h-8 flex items-center text-sm font-medium rounded-md border transition-all shadow-sm ${
                                        isSelected
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {field}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock компонент: вкладки
const MockUpdateTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'updates' | 'unchanged' | 'not_found'>('updates');

    return (
        <div className="flex bg-gray-200 rounded-lg p-1 gap-1 mb-4 self-start">
            <button
                onClick={() => setActiveTab('updates')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm ${
                    activeTab === 'updates' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-300/50'
                }`}
            >
                Товары для обновления - 42
            </button>
            <button
                onClick={() => setActiveTab('unchanged')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm ${
                    activeTab === 'unchanged' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-300/50'
                }`}
            >
                Без изменений - 5
            </button>
            <button
                onClick={() => setActiveTab('not_found')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm ${
                    activeTab === 'not_found' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-300/50'
                }`}
            >
                Не найдено / Новые - 3
            </button>
        </div>
    );
};

// Mock компонент: полное всплывающее окно обновления
const MockUpdateModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] animate-fade-in-up flex flex-col h-[85vh]" onClick={e => e.stopPropagation()}>
            <MockUpdateHeader />

            <main className="flex-grow p-4 overflow-hidden flex flex-col bg-gray-50">
                <MockUpdateTabs />
                
                <div className="flex-grow overflow-auto custom-scrollbar bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-sm">Здесь отображается таблица сравнения "Было → Стало"</p>
                        <p className="text-xs mt-2">В реальном интерфейсе показываются строки с изменениями</p>
                    </div>
                </div>
            </main>

            <footer className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Выбрано товаров: <strong>42</strong>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700">Применить изменения</button>
                </div>
            </footer>
        </div>
    </div>
);

export const ProductsUpdateFromFilePage: React.FC<ContentProps> = ({ title }) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Режим обновления из файла позволяет изменить данные существующих товаров без создания дубликатов. 
                Система умно находит совпадения и показывает, что изменится.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать обновление</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">💰 Массовое изменение цен</h4>
                    <p className="text-sm text-blue-800">
                        Скачали xlsx, изменили цены в Excel, загрузили обратно — все цены обновились
                    </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">📝 Редактирование описаний</h4>
                    <p className="text-sm text-green-800">
                        Копирайтер доработал тексты в Google Sheets — загружаем и применяем
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">🔄 Синхронизация с 1С</h4>
                    <p className="text-sm text-purple-800">
                        Выгрузили артикулы и цены из 1С, обновили в VK одним файлом
                    </p>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 1: Выбор критерия поиска</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В верхней части окна обновления есть блок <strong>"1. Искать совпадения по:"</strong> с четырьмя вариантами:
            </p>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Критерий</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Когда использовать</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Надёжность</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-bold text-indigo-600">VK ID</td>
                            <td className="px-4 py-2 text-xs">Файл был экспортирован из приложения</td>
                            <td className="px-4 py-2 text-xs"><span className="text-green-600 font-bold">100% точность</span></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-bold text-indigo-600">VK Link</td>
                            <td className="px-4 py-2 text-xs">Есть ссылки на товары VK</td>
                            <td className="px-4 py-2 text-xs"><span className="text-green-600 font-bold">100% точность</span></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-bold text-yellow-600">Название</td>
                            <td className="px-4 py-2 text-xs">Названия уникальны в каталоге</td>
                            <td className="px-4 py-2 text-xs"><span className="text-yellow-600">Возможны дубликаты</span></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 whitespace-nowrap font-bold text-yellow-600">Артикул</td>
                            <td className="px-4 py-2 text-xs">У всех товаров заполнен артикул</td>
                            <td className="px-4 py-2 text-xs"><span className="text-yellow-600">Если артикулы уникальны</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-2">✅ Рекомендация:</h4>
                <p className="text-sm text-green-800">
                    Всегда используйте <strong>VK ID</strong> или <strong>VK Link</strong> если они есть в файле — это гарантирует 100% правильное сопоставление. 
                    Экспортируйте товары из приложения перед редактированием.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 2: Выбор полей для обновления</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Блок <strong>"2. Обновлять поля:"</strong> позволяет выбрать, какие именно данные изменить. Доступные поля:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Название</strong> — заголовок товара</li>
                <li><strong>Описание</strong> — полное описание</li>
                <li><strong>Цена</strong> — текущая цена</li>
                <li><strong>Старая цена</strong> — перечёркнутая цена</li>
                <li><strong>Артикул</strong> — SKU товара</li>
                <li><strong>Подборка</strong> — привязка к альбому</li>
                <li><strong>Категория</strong> — категория VK</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Поля выбираются кликом — активные подсвечиваются индиго-цветом. Есть быстрые кнопки: "Выбрать все" / "Сбросить".
            </p>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно:</h4>
                <p className="text-sm text-yellow-800">
                    Если поле не выбрано, оно не будет изменено даже если в файле есть новое значение. 
                    Например, сняли галочку с "Описание" — описания товаров останутся прежними.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 3: Анализ результатов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После настройки критерия и полей система анализирует файл и показывает 4 вкладки:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Товары для обновления"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Найденные товары с изменениями. Для каждого поля показывается:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Было:</strong> текущее значение в системе (серый фон)</li>
                <li><strong>Стало:</strong> новое значение из файла (зелёный фон)</li>
                <li>Изменения можно редактировать прямо в таблице</li>
                <li>Красные строки — товары с ошибками валидации</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Без изменений"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Товары, которые нашлись, но все выбранные поля совпадают с текущими значениями. 
                Эти товары не будут обновлены.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Дубликаты"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Строки из файла, по которым найдено несколько товаров в системе (при поиске по названию/артикулу). 
                Требуют ручного выбора правильного варианта или переключения критерия поиска на VK ID.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Не найдено / Новые"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Товары из файла, которые не нашлись в системе. Внизу модального окна появится кнопка 
                "Добавить в очередь создания" — эти товары можно создать после применения обновлений.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаг 4: Применение изменений</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Проверьте таблицу "Было → Стало", убедитесь что всё корректно, нажмите кнопку 
                <strong> "Применить изменения"</strong>. Система отправит изменения в VK и покажет результат в модальном окне.
            </p>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">💡 Совет:</h4>
                <p className="text-sm text-purple-800">
                    Перед массовым обновлением сделайте экспорт текущих товаров — это резервная копия. 
                    Если что-то пойдёт не так, можно откатить изменения загрузкой старого файла.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Обновление из файла"
                description="Нажмите кнопку чтобы открыть интерактивный пример модального окна обновления товаров."
                instructions={[
                    'Нажмите кнопку "Открыть обновление"',
                    'Изучите два блока настроек: критерий поиска и поля для обновления',
                    'Попробуйте переключить критерий поиска (VK ID, Название, Артикул)',
                    'Кликайте на кнопки полей — они подсвечиваются индиго при выборе',
                    'Переключайтесь между вкладками внизу: "Товары для обновления", "Без изменений", "Не найдено"'
                ]}
            >
                <button 
                    onClick={() => setShowUpdateModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Открыть обновление
                </button>
                {showUpdateModal && <MockUpdateModal onClose={() => setShowUpdateModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-6-3-update-from-file" />
        </article>
    );
};
