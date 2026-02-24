import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: всплывающее окно изменения старой цены
const MockBulkOldPriceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeMode, setActiveMode] = useState<'set' | 'round' | 'change' | 'from_current'>('from_current');
    const [setValue, setSetValue] = useState('1500');
    const [roundTarget, setRoundTarget] = useState<0 | 5 | 9>(9);
    const [roundDirection, setRoundDirection] = useState<'up' | 'down'>('up');
    const [changeAction, setChangeAction] = useState<'increase' | 'decrease'>('increase');
    const [changeType, setChangeType] = useState<'amount' | 'percent'>('percent');
    const [changeValue, setChangeValue] = useState('20');
    const [fromCurrentAction, setFromCurrentAction] = useState<'more' | 'less'>('more');
    const [fromCurrentType, setFromCurrentType] = useState<'amount' | 'percent'>('percent');
    const [fromCurrentValue, setFromCurrentValue] = useState('20');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение старой цены</h2>
                    <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>42</strong> выбранным товарам.</p>
                </header>

                {/* Табы режимов */}
                <div className="p-4 border-b">
                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                        <button 
                            onClick={() => setActiveMode('set')} 
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeMode === 'set' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Установить
                        </button>
                        <button 
                            onClick={() => setActiveMode('round')} 
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeMode === 'round' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Округлить
                        </button>
                        <button 
                            onClick={() => setActiveMode('change')} 
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeMode === 'change' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Изменить на
                        </button>
                        <button 
                            onClick={() => setActiveMode('from_current')} 
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeMode === 'from_current' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            От цены
                        </button>
                    </div>
                </div>

                <main className="p-6">
                    {activeMode === 'set' && (
                        <div className="space-y-2 animate-fade-in-up">
                            <label className="block text-sm font-medium text-gray-700">Новая старая цена</label>
                            <input
                                type="number"
                                value={setValue}
                                onChange={e => setSetValue(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Например, 1500"
                            />
                            <p className="text-xs text-gray-500">Одинаковое значение для всех выбранных товаров</p>
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
                                        placeholder="Например, 100 или 20"
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

                    {activeMode === 'from_current' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                <p className="text-xs text-indigo-800">
                                    <strong>Режим "От цены"</strong> рассчитывает старую цену на основе <strong>текущей цены</strong> товара. 
                                    Например, если текущая цена 1000₽, а вы выбрали "больше цены на 20%", старая цена станет 1200₽.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Соотношение с ценой</label>
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    <button 
                                        onClick={() => setFromCurrentAction('more')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${fromCurrentAction === 'more' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Больше цены на
                                    </button>
                                    <button 
                                        onClick={() => setFromCurrentAction('less')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${fromCurrentAction === 'less' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Меньше цены на
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-700">Значение</label>
                                    <input
                                        type="number"
                                        value={fromCurrentValue}
                                        onChange={e => setFromCurrentValue(e.target.value)}
                                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Например, 200 или 20"
                                    />
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                        <button 
                                            onClick={() => setFromCurrentType('amount')} 
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${fromCurrentType === 'amount' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            ₽
                                        </button>
                                        <button 
                                            onClick={() => setFromCurrentType('percent')} 
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${fromCurrentType === 'percent' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
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

export const ProductsBulkOldPricePage: React.FC<ContentProps> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Старая цена — это перечёркнутое значение над текущей ценой. Используется для отображения скидок и распродаж. 
                Массовое редактирование старой цены поддерживает четыре режима, включая уникальный режим "От цены".
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">Зачем нужна старая цена:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Показывает размер скидки покупателям</li>
                    <li>Создаёт ощущение выгоды ("было 2000₽, стало 1500₽")</li>
                    <li>Повышает конверсию в распродажный период</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Четыре режима редактирования</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Первые три режима идентичны изменению обычной цены: <strong>Установить</strong>, <strong>Округлить</strong> и <strong>Изменить на</strong>. 
                Четвёртый режим — <strong>От цены</strong> — уникален и позволяет рассчитать старую цену на основе текущей.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим "От цены" — самый полезный</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Этот режим вычисляет старую цену автоматически, основываясь на <strong>текущей цене</strong> каждого товара. 
                Он идеален для ситуаций, когда нужно показать скидку после снижения цен.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вариант 1: Больше цены на</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Старая цена будет <strong>выше</strong> текущей на указанную величину.
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Больше цены на 20%:</strong> если цена 1000₽, старая станет 1200₽</li>
                <li><strong>Больше цены на 200₽:</strong> если цена 1000₽, старая станет 1200₽</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вариант 2: Меньше цены на</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Старая цена будет <strong>ниже</strong> текущей (используется редко, но возможно).
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Меньше цены на 10%:</strong> если цена 1000₽, старая станет 900₽</li>
            </ul>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Текущая цена</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Больше на 20%</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Больше на 300₽</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Меньше на 10%</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">1000₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">1200₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">1300₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">900₽</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">2500₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">3000₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">2800₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">2250₽</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">5000₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">6000₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">5300₽</td>
                            <td className="px-4 py-2 font-bold text-red-600">4500₽</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практический сценарий: запуск распродажи</h2>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-3">Задача: показать скидку 20% на все товары категории "Летняя коллекция"</h4>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-green-800 mb-1">Шаг 1: Выставить старую цену</p>
                        <p className="text-xs text-green-700">
                            Отфильтруйте товары по категории, выберите все через "Выбрать" → "Изменить" → "Старая цена" → 
                            режим <strong>"От цены"</strong> → <strong>"Больше цены на 25%"</strong> → "Применить".
                        </p>
                        <p className="text-xs text-green-600 mt-1 italic">
                            Старая цена теперь на 25% выше текущей (например, 1000₽ → старая 1250₽).
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-800 mb-1">Шаг 2: Снизить текущую цену</p>
                        <p className="text-xs text-green-700">
                            Не закрывая выделение, снова "Изменить" → "Цена" → режим <strong>"Изменить на"</strong> → 
                            <strong>"Снизить на 20%"</strong> → "Применить".
                        </p>
                        <p className="text-xs text-green-600 mt-1 italic">
                            Результат: было 1250₽ (старая) / 1000₽ (цена) → стало 1250₽ (старая) / 800₽ (цена со скидкой).
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Другие режимы (кратко)</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Установить</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Все выбранные товары получат одинаковую старую цену. Подходит для акций "Везде было по 2000₽".
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Округлить</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Округляет существующие старые цены до красивых окончаний (0, 5, 9). Используется редко, 
                так как старую цену обычно вручную не редактируют после установки.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Изменить на</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Поднять или снизить старые цены на фиксированную сумму или процент. Например, если старая цена была 2000₽, 
                можно поднять её на 10% до 2200₽.
            </p>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про удаление старой цены:</h4>
                <p className="text-sm text-yellow-800">
                    Чтобы убрать старую цену (перечёркнутое число), установите её в 0 через режим "Установить" с пустым полем 
                    или удалите вручную в режиме редактирования отдельного товара.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение старой цены"
                description="Интерактивное окно с четырьмя режимами, включая уникальный режим 'От цены'."
                instructions={[
                    'Нажмите кнопку "Открыть окно"',
                    'Переключитесь на режим "От цены" (четвёртая вкладка)',
                    'Попробуйте "Больше цены на 20%" — старая цена будет выше текущей',
                    'Переключите между ₽ и % для разных вариантов расчёта',
                    'Обратите внимание на подсказку внутри режима "От цены"'
                ]}
            >
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Открыть окно
                </button>
                {showModal && <MockBulkOldPriceModal onClose={() => setShowModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-2-bulk-old-price" />
        </article>
    );
};
