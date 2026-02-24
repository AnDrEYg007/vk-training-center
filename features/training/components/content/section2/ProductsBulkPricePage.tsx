import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: всплывающее окно изменения цены
const MockBulkPriceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeMode, setActiveMode] = useState<'set' | 'round' | 'change'>('set');
    const [setValue, setSetValue] = useState('1200');
    const [roundTarget, setRoundTarget] = useState<0 | 5 | 9>(0);
    const [roundDirection, setRoundDirection] = useState<'up' | 'down'>('up');
    const [changeAction, setChangeAction] = useState<'increase' | 'decrease'>('increase');
    const [changeType, setChangeType] = useState<'amount' | 'percent'>('percent');
    const [changeValue, setChangeValue] = useState('10');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение цены</h2>
                    <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>42</strong> выбранным товарам.</p>
                </header>

                {/* Табы режимов */}
                <div className="p-4 border-b">
                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                        <button 
                            onClick={() => setActiveMode('set')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'set' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Установить
                        </button>
                        <button 
                            onClick={() => setActiveMode('round')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'round' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Округлить
                        </button>
                        <button 
                            onClick={() => setActiveMode('change')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'change' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Изменить на
                        </button>
                    </div>
                </div>

                <main className="p-6">
                    {activeMode === 'set' && (
                        <div className="space-y-2 animate-fade-in-up">
                            <label className="block text-sm font-medium text-gray-700">Новая цена</label>
                            <input
                                type="number"
                                value={setValue}
                                onChange={e => setSetValue(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Например, 1000"
                            />
                        </div>
                    )}

                    {activeMode === 'round' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Округлить до</label>
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    {[0, 5, 9].map(t => (
                                        <button 
                                            key={t} 
                                            onClick={() => setRoundTarget(t as 0 | 5 | 9)} 
                                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundTarget === t ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Направление</label>
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    <button 
                                        onClick={() => setRoundDirection('up')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundDirection === 'up' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        В большую
                                    </button>
                                    <button 
                                        onClick={() => setRoundDirection('down')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundDirection === 'down' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        В меньшую
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMode === 'change' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Действие</label>
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    <button 
                                        onClick={() => setChangeAction('increase')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeAction === 'increase' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Поднять на
                                    </button>
                                    <button 
                                        onClick={() => setChangeAction('decrease')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeAction === 'decrease' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Снизить на
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-700">Значение</label>
                                    <input
                                        type="number"
                                        value={changeValue}
                                        onChange={e => setChangeValue(e.target.value)}
                                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Например, 100 или 10"
                                    />
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                        <button 
                                            onClick={() => setChangeType('amount')} 
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeType === 'amount' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            ₽
                                        </button>
                                        <button 
                                            onClick={() => setChangeType('percent')} 
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeType === 'percent' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            %
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Применить</button>
                </footer>
            </div>
        </div>
    );
};

export const ProductsBulkPricePage: React.FC<ContentProps> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое изменение цен — самая частая операция при работе с товарами. Приложение предлагает три режима: 
                установить одинаковую цену для всех, округлить до красивых чисел или изменить на сумму/процент.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим 1: Установить цену</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Все выбранные товары получат одинаковую цену. Подходит для:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Акций "Всё по 999₽"</li>
                <li>Выравнивания цен внутри категории</li>
                <li>Быстрой установки стандартной цены для новых товаров</li>
            </ul>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">Пример:</h4>
                <p className="text-sm text-blue-800">
                    Выбрали 50 товаров с разными ценами (от 500₽ до 1200₽), ввели "999" в поле "Новая цена" — 
                    у всех 50 товаров цена стала 999₽.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим 2: Округлить цену</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Округляет существующие цены до красивых окончаний: 0, 5 или 9. Выбирается направление округления.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Округление до 0</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Цены становятся круглыми числами, кратными 10:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>1147₽ → <strong>1150₽</strong> (в большую сторону)</li>
                <li>1147₽ → <strong>1140₽</strong> (в меньшую сторону)</li>
                <li>2893₽ → <strong>2890₽</strong> (в меньшую)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Округление до 9</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Психологический приём — цены выглядят ниже:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>1142₽ → <strong>1149₽</strong> (в большую)</li>
                <li>1152₽ → <strong>1149₽</strong> (в меньшую)</li>
                <li>2000₽ → <strong>1999₽</strong> (в меньшую)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Округление до 5</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Компромиссный вариант между 0 и 9:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>1142₽ → <strong>1145₽</strong> (в большую)</li>
                <li>1148₽ → <strong>1145₽</strong> (в меньшую)</li>
            </ul>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">💡 Совет:</h4>
                <p className="text-sm text-purple-800">
                    Для дорогих товаров (от 5000₽) используйте округление до 9 в меньшую сторону — 
                    4973₽ → 4969₽. Выглядит дешевле, но потеря прибыли всего 4 рубля.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим 3: Изменить на сумму или процент</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый гибкий режим — изменяет каждую цену индивидуально, сохраняя разницу между товарами.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Изменение на сумму (₽)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Добавляет или вычитает фиксированную сумму:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Поднять на 100₽:</strong> 1200₽ → 1300₽, 3500₽ → 3600₽</li>
                <li><strong>Снизить на 50₽:</strong> 1200₽ → 1150₽, 3500₽ → 3450₽</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Изменение на процент (%)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Изменяет пропорционально — дорогие товары изменятся сильнее:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Поднять на 10%:</strong> 1000₽ → 1100₽, 5000₽ → 5500₽</li>
                <li><strong>Снизить на 15%:</strong> 1000₽ → 850₽, 5000₽ → 4250₽</li>
            </ul>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Было</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">+100₽</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">+10%</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">-15%</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">1000₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">1100₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">1100₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">850₽</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">3000₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">3100₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">3300₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">2550₽</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">5000₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">5100₽</td>
                            <td className="px-4 py-2 font-bold text-green-600">5500₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">4250₽</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про дробные числа:</h4>
                <p className="text-sm text-yellow-800">
                    При изменении на процент может получиться дробная цена (например, 1247.50₽). 
                    Система автоматически округляет до целых рублей: 1247.50₽ → 1248₽.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выбрать режим</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Установить</h4>
                    <p className="text-sm text-green-800 mb-2">Когда использовать:</p>
                    <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
                        <li>Акция "Всё по 999₽"</li>
                        <li>Быстрая установка цены для новых товаров</li>
                        <li>Выравнивание цен</li>
                    </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Округлить</h4>
                    <p className="text-sm text-blue-800 mb-2">Когда использовать:</p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>После импорта с некрасивыми ценами</li>
                        <li>Для улучшения восприятия</li>
                        <li>Психологический эффект (до 9)</li>
                    </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Изменить на</h4>
                    <p className="text-sm text-purple-800 mb-2">Когда использовать:</p>
                    <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
                        <li>Сезонные изменения цен</li>
                        <li>Инфляция (+% ко всем)</li>
                        <li>Сохранение разницы между товарами</li>
                    </ul>
                </div>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение цены"
                description="Интерактивное всплывающее окно с тремя режимами изменения цены."
                instructions={[
                    'Нажмите кнопку "Открыть окно"',
                    'Переключайтесь между режимами: Установить, Округлить, Изменить на',
                    'В режиме "Округлить" попробуйте разные цели (0, 5, 9) и направления',
                    'В режиме "Изменить на" переключите между ₽ и %',
                    'Обратите внимание на подсветку активных элементов (индиго-цвет)'
                ]}
            >
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Открыть окно
                </button>
                {showModal && <MockBulkPriceModal onClose={() => setShowModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-1-bulk-price" />
        </article>
    );
};
