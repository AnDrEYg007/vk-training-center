import React, { useState } from 'react';

// =====================================================================
// Mock: Состояния футера (обычный, пустое поле, сохранение)
// =====================================================================
export const MockFooterStates: React.FC = () => {
    const [activeState, setActiveState] = useState<'normal' | 'empty' | 'saving'>('normal');
    const [title, setTitle] = useState('Мой новый проект');

    const handleStateChange = (state: 'normal' | 'empty' | 'saving') => {
        setActiveState(state);
        if (state === 'empty') {
            setTitle('');
        } else if (state === 'normal') {
            setTitle('Мой новый проект');
        }
    };

    const renderFooter = () => {
        const isEmpty = activeState === 'empty';
        const isSaving = activeState === 'saving';

        return (
            <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                <button 
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => handleStateChange('normal')}
                >
                    Отмена
                </button>
                <button
                    disabled={isEmpty || isSaving}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 w-28 flex justify-center items-center"
                >
                    {isSaving ? (
                        <div className="loader border-white border-t-transparent h-4 w-4"></div>
                    ) : (
                        'Сохранить'
                    )}
                </button>
            </footer>
        );
    };

    return (
        <div className="space-y-4">
            {/* Переключатели состояний */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleStateChange('normal')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeState === 'normal' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Обычное состояние
                </button>
                <button
                    onClick={() => handleStateChange('empty')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeState === 'empty' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Поле пустое
                </button>
                <button
                    onClick={() => handleStateChange('saving')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeState === 'saving' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Идёт сохранение
                </button>
            </div>

            {/* Всплывающее окно с футером */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Создать проект</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="p-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (activeState !== 'saving') {
                                    setActiveState(e.target.value.trim() ? 'normal' : 'empty');
                                }
                            }}
                            disabled={activeState === 'saving'}
                            className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Например, 'Кафе на Пушкина'"
                        />
                    </div>
                    {activeState === 'empty' && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md mt-2">Название проекта не может быть пустым.</p>
                    )}
                </main>
                {renderFooter()}
            </div>

            {/* Подсказка */}
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded-md">
                <strong>Попробуйте:</strong> Переключайте состояния кнопками сверху или редактируйте поле ввода. Обратите внимание, как меняются кнопки в футере.
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Варианты расположения кнопок в футере
// =====================================================================
export const MockFooterVariants: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Стандартный футер (кнопки справа) */}
            <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Стандартный футер (justify-end)</p>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <header className="p-4 border-b">
                        <h3 className="text-base font-semibold text-gray-800">Создать альбом</h3>
                    </header>
                    <main className="p-6">
                        <p className="text-sm text-gray-600">Содержимое окна...</p>
                    </main>
                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 w-28 flex justify-center items-center">Создать</button>
                    </footer>
                </div>
            </div>

            {/* Футер с кнопками по краям */}
            <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Футер поста (justify-between)</p>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <header className="p-4 border-b">
                        <h3 className="text-base font-semibold text-gray-800">Редактировать пост</h3>
                    </header>
                    <main className="p-6">
                        <p className="text-sm text-gray-600">Содержимое окна...</p>
                    </main>
                    <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                        <div className="flex items-center">
                            <button className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 border border-red-200">Удалить</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 text-sm font-medium rounded-md text-green-600 hover:bg-green-100">Опубликовать сейчас</button>
                            <button className="px-6 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 min-w-[120px] flex justify-center items-center">Сохранить</button>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Футер с одной кнопкой */}
            <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Футер просмотра (только закрытие)</p>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <header className="p-4 border-b">
                        <h3 className="text-base font-semibold text-gray-800">Результат сохранения</h3>
                    </header>
                    <main className="p-6">
                        <p className="text-sm text-gray-600">✅ Успешно сохранено 5 товаров</p>
                    </main>
                    <footer className="p-4 border-t bg-gray-50 flex justify-end">
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Закрыть</button>
                    </footer>
                </div>
            </div>
        </div>
    );
};
