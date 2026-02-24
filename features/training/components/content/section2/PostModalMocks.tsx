import React, { useState } from 'react';

// =====================================================================
// Mock-компоненты для модального окна поста
// =====================================================================

// =====================================================================
// Вспомогательные компоненты
// =====================================================================

// Кнопка закрытия модалки
const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Закрыть"
    >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
);

// Mock-заголовок модалки
const MockModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <CloseButton onClick={onClose} />
    </div>
);

// Mock-футер модалки
const MockModalFooter: React.FC<{ 
    leftButtons?: React.ReactNode; 
    rightButtons?: React.ReactNode;
}> = ({ leftButtons, rightButtons }) => (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
            {leftButtons}
        </div>
        <div className="flex gap-2">
            {rightButtons}
        </div>
    </div>
);

// Mock-секция контента
const MockContentSection: React.FC<{ 
    title: string; 
    children: React.ReactNode;
}> = ({ title, children }) => (
    <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
        {children}
    </div>
);

// Mock-переключатель (Toggle)
const MockToggle: React.FC<{ 
    label: string; 
    checked: boolean; 
    onChange: () => void;
    disabled?: boolean;
}> = ({ label, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between py-2">
        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                checked ? 'bg-indigo-600' : 'bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

// Mock-textarea
const MockTextarea: React.FC<{ 
    value: string; 
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}> = ({ value, onChange, placeholder, disabled = false }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={8}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
        }`}
    />
);

// Mock-сетка изображений
const MockImageGrid: React.FC<{ 
    count: number; 
    disabled?: boolean;
}> = ({ count, disabled = false }) => (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
        {Array.from({ length: count }).map((_, idx) => (
            <div
                key={idx}
                className={`relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 ${
                    disabled ? 'opacity-50' : 'hover:border-indigo-400 cursor-pointer group'
                }`}
            >
                <img
                    src={`https://picsum.photos/seed/post-modal-${idx}/200/200`}
                    alt={`Изображение ${idx + 1}`}
                    className="w-full h-full object-cover"
                />
                {!disabled && (
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        ))}
    </div>
);

// =====================================================================
// Основные mock-компоненты модального окна
// =====================================================================

// Mock модального окна в режиме просмотра (view)
export const MockPostModalView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <MockModalHeader title="Просмотр поста" onClose={onClose} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <MockContentSection title="Дата публикации">
                        <div className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                            15 февраля 2026, 14:00
                        </div>
                    </MockContentSection>

                    <MockContentSection title="Текст поста">
                        <div className="text-sm text-gray-700 bg-gray-50 rounded-md px-4 py-3 whitespace-pre-wrap">
                            Это пример текста поста в режиме просмотра.{'\n\n'}
                            Здесь может быть несколько абзацев, эмодзи 🎉, ссылки и другие элементы форматирования.
                        </div>
                    </MockContentSection>

                    <MockContentSection title="Изображения (3)">
                        <MockImageGrid count={3} disabled={true} />
                    </MockContentSection>
                </div>

                {/* Footer */}
                <MockModalFooter
                    leftButtons={
                        <>
                            <button className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-100 rounded-md border border-transparent">
                                Опубликовать сейчас
                            </button>
                        </>
                    }
                    rightButtons={
                        <>
                            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md">
                                Редактировать
                            </button>
                        </>
                    }
                />
            </div>
        </div>
    );
};

// Mock модального окна в режиме редактирования (edit)
export const MockPostModalEdit: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [text, setText] = useState('Редактируемый текст поста...');
    const [isBulk, setIsBulk] = useState(false);
    const [isCyclic, setIsCyclic] = useState(false);
    const [isMultiProject, setIsMultiProject] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <MockModalHeader title="Редактировать пост" onClose={onClose} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* Способ публикации */}
                    <MockContentSection title="Способ публикации">
                        <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                            <button className="flex-1 px-4 py-2 text-sm font-medium bg-white shadow text-indigo-700 rounded transition-colors">
                                Запланировать
                            </button>
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded transition-colors">
                                В отложку VK
                            </button>
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded transition-colors">
                                Опубликовать
                            </button>
                        </div>
                    </MockContentSection>

                    {/* Опции создания */}
                    <MockContentSection title="Опции создания">
                        <div className="bg-gray-50 rounded-md p-4 space-y-2">
                            <MockToggle
                                label="Создать несколько постов (до 10 дат)"
                                checked={isBulk}
                                onChange={() => setIsBulk(!isBulk)}
                                disabled={isCyclic}
                            />
                            <MockToggle
                                label="Циклическая публикация"
                                checked={isCyclic}
                                onChange={() => setIsCyclic(!isCyclic)}
                                disabled={isBulk}
                            />
                            <MockToggle
                                label="Мультипроектная публикация"
                                checked={isMultiProject}
                                onChange={() => setIsMultiProject(!isMultiProject)}
                            />
                        </div>
                    </MockContentSection>

                    {/* Дата */}
                    <MockContentSection title="Дата и время">
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                defaultValue="2026-02-15"
                            />
                            <input
                                type="time"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                defaultValue="14:00"
                            />
                        </div>
                    </MockContentSection>

                    {/* Текст */}
                    <MockContentSection title="Текст поста">
                        <div className="mb-2 flex gap-2">
                            <button className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                                AI-помощник
                            </button>
                            <button className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                                Переменные
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors" title="Emoji">
                                😊
                            </button>
                        </div>
                        <MockTextarea value={text} onChange={setText} placeholder="Введите текст поста..." />
                    </MockContentSection>

                    {/* Изображения */}
                    <MockContentSection title="Изображения">
                        <div className="mb-2 flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium bg-green-600 text-white hover:bg-green-700 rounded-md">
                                Загрузить
                            </button>
                            <button className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md">
                                Добавить из галереи
                            </button>
                        </div>
                        <MockImageGrid count={4} />
                    </MockContentSection>
                </div>

                {/* Footer */}
                <MockModalFooter
                    leftButtons={
                        <>
                            <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200">
                                Удалить
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-100 rounded-md border border-transparent">
                                Опубликовать сейчас
                            </button>
                        </>
                    }
                    rightButtons={
                        <>
                            <button className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md">
                                Сохранить
                            </button>
                        </>
                    }
                />
            </div>
        </div>
    );
};

// Mock модального окна в режиме копирования (copy)
export const MockPostModalCopy: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [text, setText] = useState('Копия поста с новой датой и возможностью изменений...');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <MockModalHeader title="Копирование поста" onClose={onClose} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* Уведомление о копировании */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Режим копирования:</strong> Дата автоматически сдвинута на +1 день. 
                            Вы можете изменить все поля перед сохранением.
                        </p>
                    </div>

                    {/* Способ публикации */}
                    <MockContentSection title="Способ публикации">
                        <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                            <button className="flex-1 px-4 py-2 text-sm font-medium bg-white shadow text-indigo-700 rounded transition-colors">
                                Запланировать
                            </button>
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded transition-colors">
                                В отложку VK
                            </button>
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded transition-colors">
                                Опубликовать
                            </button>
                        </div>
                    </MockContentSection>

                    {/* Дата (сдвинута) */}
                    <MockContentSection title="Дата и время">
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                defaultValue="2026-02-16"
                            />
                            <input
                                type="time"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                defaultValue="14:00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Дата изменена с 15.02 на 16.02</p>
                    </MockContentSection>

                    {/* Текст */}
                    <MockContentSection title="Текст поста">
                        <MockTextarea value={text} onChange={setText} placeholder="Введите текст поста..." />
                    </MockContentSection>

                    {/* Изображения */}
                    <MockContentSection title="Изображения (скопированы)">
                        <MockImageGrid count={3} />
                    </MockContentSection>
                </div>

                {/* Footer */}
                <MockModalFooter
                    rightButtons={
                        <>
                            <button className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md">
                                Запланировать
                            </button>
                        </>
                    }
                />
            </div>
        </div>
    );
};

// =====================================================================
// Демо-компонент с переключением режимов
// =====================================================================
export const PostModalModesDemo: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'view' | 'edit' | 'copy' | null>(null);

    return (
        <>
            <div className="flex gap-3">
                <button
                    onClick={() => setActiveMode('view')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-lg transition-all font-medium text-blue-900"
                >
                    Режим просмотра
                </button>
                <button
                    onClick={() => setActiveMode('edit')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-lg transition-all font-medium text-purple-900"
                >
                    Режим редактирования
                </button>
                <button
                    onClick={() => setActiveMode('copy')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-lg transition-all font-medium text-green-900"
                >
                    Режим копирования
                </button>
            </div>

            {activeMode === 'view' && <MockPostModalView onClose={() => setActiveMode(null)} />}
            {activeMode === 'edit' && <MockPostModalEdit onClose={() => setActiveMode(null)} />}
            {activeMode === 'copy' && <MockPostModalCopy onClose={() => setActiveMode(null)} />}
        </>
    );
};

// =====================================================================
// Сравнение структуры модалок
// =====================================================================
export const ModalStructureComparison: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {/* View */}
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50/30">
                <h5 className="font-bold text-blue-900 mb-3 text-center">Просмотр</h5>
                <div className="space-y-2 text-xs text-blue-800">
                    <div className="bg-white p-2 rounded border border-blue-200">Шапка: "Просмотр поста"</div>
                    <div className="bg-white p-2 rounded border border-blue-200">📅 Дата (только чтение)</div>
                    <div className="bg-white p-2 rounded border border-blue-200">📝 Текст (только чтение)</div>
                    <div className="bg-white p-2 rounded border border-blue-200">🖼 Изображения (без удаления)</div>
                    <div className="bg-blue-100 p-2 rounded border border-blue-300 font-medium">
                        Футер: "Опубликовать" + "Редактировать"
                    </div>
                </div>
            </div>

            {/* Edit */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50/30">
                <h5 className="font-bold text-purple-900 mb-3 text-center">Редактирование</h5>
                <div className="space-y-2 text-xs text-purple-800">
                    <div className="bg-white p-2 rounded border border-purple-200">Шапка: "Редактировать пост"</div>
                    <div className="bg-white p-2 rounded border border-purple-200">🔀 Способ публикации (3 кнопки)</div>
                    <div className="bg-white p-2 rounded border border-purple-200">⚙️ Опции (Toggles)</div>
                    <div className="bg-white p-2 rounded border border-purple-200">📅 Дата (редактируется)</div>
                    <div className="bg-white p-2 rounded border border-purple-200">📝 Текст + Панель инструментов</div>
                    <div className="bg-white p-2 rounded border border-purple-200">🖼 Изображения + Загрузка</div>
                    <div className="bg-purple-100 p-2 rounded border border-purple-300 font-medium">
                        Футер: "Удалить" + "Опубликовать" + "Сохранить"
                    </div>
                </div>
            </div>

            {/* Copy */}
            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50/30">
                <h5 className="font-bold text-green-900 mb-3 text-center">Копирование</h5>
                <div className="space-y-2 text-xs text-green-800">
                    <div className="bg-white p-2 rounded border border-green-200">Шапка: "Копирование поста"</div>
                    <div className="bg-green-100 p-2 rounded border border-green-300">💡 Уведомление (дата +1)</div>
                    <div className="bg-white p-2 rounded border border-green-200">🔀 Способ публикации</div>
                    <div className="bg-white p-2 rounded border border-green-200">📅 Дата (сдвинута на +1 день)</div>
                    <div className="bg-white p-2 rounded border border-green-200">📝 Текст (редактируется)</div>
                    <div className="bg-white p-2 rounded border border-green-200">🖼 Изображения (скопированы)</div>
                    <div className="bg-green-100 p-2 rounded border border-green-300 font-medium">
                        Футер: "Отмена" + "Запланировать"
                    </div>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Демонстрация работы подтверждения при закрытии (dirty check)
// =====================================================================
export const DirtyCheckDemo: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState('');
    const [showAI, setShowAI] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [attemptedClose, setAttemptedClose] = useState(false);

    const isDirty = text.trim() !== '' || showAI;

    const handleClose = () => {
        if (isDirty) {
            setShowConfirm(true);
            setAttemptedClose(true);
        } else {
            setShowModal(false);
            setText('');
            setShowAI(false);
            setAttemptedClose(false);
        }
    };

    const confirmClose = () => {
        setShowModal(false);
        setText('');
        setShowAI(false);
        setShowConfirm(false);
        setAttemptedClose(false);
    };

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                Открыть всплывающее окно
            </button>

            {showModal && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        {/* Modal */}
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Редактировать пост</h3>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Текст поста:</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Введите текст..."
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {isDirty ? '✏️ Есть несохранённые изменения' : '✓ Нет изменений'}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <button
                                        onClick={() => setShowAI(!showAI)}
                                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                                    >
                                        {showAI ? '🤖 AI-панель открыта' : 'Открыть AI-помощника'}
                                    </button>
                                    {showAI && (
                                        <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-800">
                                            AI-панель активна (это тоже считается изменением!)
                                        </div>
                                    )}
                                </div>

                                {attemptedClose && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                                        ⚠️ Вы пытались закрыть окно, но есть несохранённые изменения!
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setText('');
                                        setShowAI(false);
                                        setAttemptedClose(false);
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    {showConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Несохранённые изменения</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    У вас есть несохранённые изменения. Вы уверены, что хотите закрыть окно без сохранения?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setAttemptedClose(false);
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={confirmClose}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                                    >
                                        Да, закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// =====================================================================
// Mock: Демонстрация состояния блокировки (lock state)
// =====================================================================
export const LockStateDemo: React.FC = () => {
    const [isLocked, setIsLocked] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Статус поста:</span>
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isLocked
                            ? 'bg-orange-100 text-orange-700 border border-orange-300'
                            : 'bg-green-100 text-green-700 border border-green-300'
                    }`}
                >
                    {isLocked ? '🔒 Публикуется...' : '✓ Готов'}
                </button>
            </div>

            <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Кнопки в футере:</h4>
                <div className="space-y-2">
                    <button
                        disabled={isLocked}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isLocked
                                ? 'bg-red-100 text-red-400 border border-red-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                    >
                        {isLocked ? '🔒 Удалить (заблокировано)' : 'Удалить'}
                    </button>
                    <button
                        disabled={isLocked}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isLocked
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                : 'bg-white text-green-600 border border-transparent hover:bg-green-100'
                        }`}
                    >
                        {isLocked ? '🔒 Опубликовать сейчас (заблокировано)' : 'Опубликовать сейчас'}
                    </button>
                    <button
                        disabled={isLocked}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isLocked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        {isLocked ? '🔒 Сохранить (заблокировано)' : 'Сохранить'}
                    </button>
                </div>
                {isLocked && (
                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                        ⚠️ Пост в процессе публикации — все кнопки заблокированы, кроме кнопки закрытия окна
                    </div>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Демонстрация валидации
// =====================================================================
export const ValidationDemo: React.FC = () => {
    const [text, setText] = useState('');
    const [hasImages, setHasImages] = useState(false);
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!text.trim() && !hasImages) {
            setError('Не удалось сохранить: Текст поста не может быть пустым. Введите текст.');
        } else {
            setError('');
            alert('✓ Пост успешно сохранён!');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Текст поста:</label>
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setError('');
                    }}
                    placeholder="Введите текст..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                    type="checkbox"
                    id="images"
                    checked={hasImages}
                    onChange={(e) => {
                        setHasImages(e.target.checked);
                        setError('');
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="images" className="text-sm text-gray-700">
                    Есть прикреплённые изображения
                </label>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
                Сохранить
            </button>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                💡 <strong>Правило:</strong> Пост можно сохранить только если есть текст ИЛИ хотя бы одно изображение
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Селектор способа публикации
// =====================================================================
export const PublicationMethodSelector: React.FC = () => {
    const [method, setMethod] = useState<'system' | 'vk' | 'now'>('system');
    const [isFutureDate, setIsFutureDate] = useState(false);

    const buttonBaseClass = 'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = 'bg-white shadow text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';
    const disabledClass = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400';

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                    type="checkbox"
                    id="futureDate"
                    checked={isFutureDate}
                    onChange={(e) => {
                        setIsFutureDate(e.target.checked);
                        if (e.target.checked && method === 'now') {
                            setMethod('system');
                        }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="futureDate" className="text-sm text-gray-700">
                    Дата в будущем (блокирует "Опубликовать сейчас")
                </label>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Способ публикации</label>
                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                    <button
                        onClick={() => setMethod('system')}
                        className={`${buttonBaseClass} ${method === 'system' ? activeClass : inactiveClass}`}
                    >
                        Запланировать
                    </button>
                    <button
                        onClick={() => setMethod('vk')}
                        className={`${buttonBaseClass} ${method === 'vk' ? activeClass : inactiveClass}`}
                    >
                        В отложку VK
                    </button>
                    <button
                        onClick={() => setMethod('now')}
                        disabled={isFutureDate}
                        className={`${buttonBaseClass} ${method === 'now' ? activeClass : inactiveClass} ${disabledClass}`}
                    >
                        Опубликовать сейчас
                    </button>
                </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <p className="font-semibold text-blue-900 mb-2">Выбрано:</p>
                <p className="text-blue-800">
                    {method === 'system' && '📅 Запланировать — пост сохраняется в БД приложения'}
                    {method === 'vk' && '⏰ В отложку VK — пост отправляется в отложенные записи VK'}
                    {method === 'now' && '⚡ Опубликовать сейчас — пост публикуется немедленно на стену VK'}
                </p>
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Изменение текста кнопки Save в зависимости от метода
// =====================================================================
export const SaveButtonTextDemo: React.FC = () => {
    const [method, setMethod] = useState<'system' | 'vk' | 'now'>('system');
    const [postCount, setPostCount] = useState(1);
    const [isUploading, setIsUploading] = useState(false);

    const getSaveButtonText = () => {
        if (isUploading) {
            return 'Загрузка...';
        }
        let text = '';
        if (method === 'now') {
            text = 'Опубликовать';
        } else if (method === 'vk') {
            text = 'В отложку VK';
        } else {
            text = 'Запланировать';
        }
        return postCount > 1 ? `${text} (${postCount})` : text;
    };

    const buttonBaseClass = 'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = 'bg-white shadow text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Способ публикации</label>
                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                    <button
                        onClick={() => setMethod('system')}
                        className={`${buttonBaseClass} ${method === 'system' ? activeClass : inactiveClass}`}
                    >
                        Запланировать
                    </button>
                    <button
                        onClick={() => setMethod('vk')}
                        className={`${buttonBaseClass} ${method === 'vk' ? activeClass : inactiveClass}`}
                    >
                        В отложку VK
                    </button>
                    <button
                        onClick={() => setMethod('now')}
                        className={`${buttonBaseClass} ${method === 'now' ? activeClass : inactiveClass}`}
                    >
                        Опубликовать сейчас
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Количество постов (проектов)</label>
                <input
                    type="number"
                    min="1"
                    max="20"
                    value={postCount}
                    onChange={(e) => setPostCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                    type="checkbox"
                    id="uploading"
                    checked={isUploading}
                    onChange={(e) => setIsUploading(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="uploading" className="text-sm text-gray-700">
                    Загрузка медиа (блокирует сохранение)
                </label>
            </div>

            <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-3">Кнопка "Сохранить" в футере:</p>
                <button
                    disabled={isUploading}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {getSaveButtonText()}
                </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                💡 <strong>Динамический текст:</strong> Кнопка меняет текст в зависимости от способа публикации, 
                добавляет счётчик при мультипроекте и показывает "Загрузка..." во время загрузки медиа
            </div>
        </div>
    );
};

// =====================================================================
// Mock: Взаимодействие с датой/временем
// =====================================================================
export const DateTimeInteractionDemo: React.FC = () => {
    const [method, setMethod] = useState<'system' | 'vk' | 'now'>('system');

    const buttonBaseClass = 'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = 'bg-white shadow text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Способ публикации</label>
                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                    <button
                        onClick={() => setMethod('system')}
                        className={`${buttonBaseClass} ${method === 'system' ? activeClass : inactiveClass}`}
                    >
                        Запланировать
                    </button>
                    <button
                        onClick={() => setMethod('vk')}
                        className={`${buttonBaseClass} ${method === 'vk' ? activeClass : inactiveClass}`}
                    >
                        В отложку VK
                    </button>
                    <button
                        onClick={() => setMethod('now')}
                        className={`${buttonBaseClass} ${method === 'now' ? activeClass : inactiveClass}`}
                    >
                        Опубликовать сейчас
                    </button>
                </div>
            </div>

            {method === 'now' ? (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">⚡ Пикер даты/времени скрыт</p>
                    <p className="text-sm text-yellow-800">
                        При выборе "Опубликовать сейчас" пикер полностью исчезает — дата и время 
                        устанавливаются автоматически как текущий момент
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Дата и время публикации</label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="date"
                            defaultValue="2026-02-15"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="time"
                            defaultValue="14:00"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        📅 Пикер доступен для методов "Запланировать" и "В отложку VK"
                    </p>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// Mock: Зависимость опций от метода публикации
// =====================================================================
export const OptionsDependendyDemo: React.FC = () => {
    const [method, setMethod] = useState<'system' | 'vk' | 'now'>('system');
    const [isBulk, setIsBulk] = useState(false);
    const [isCyclic, setIsCyclic] = useState(false);
    const [isMultiproject, setIsMultiproject] = useState(false);

    const buttonBaseClass = 'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = 'bg-white shadow text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';

    // Сайд-эффекты при смене метода
    const handleMethodChange = (newMethod: 'system' | 'vk' | 'now') => {
        setMethod(newMethod);
        if (newMethod === 'now') {
            setIsBulk(false);
            setIsCyclic(false);
        } else if (newMethod === 'vk') {
            setIsCyclic(false);
        }
    };

    const bulkAvailable = method !== 'now';
    const cyclicAvailable = method === 'system';

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Способ публикации</label>
                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                    <button
                        onClick={() => handleMethodChange('system')}
                        className={`${buttonBaseClass} ${method === 'system' ? activeClass : inactiveClass}`}
                    >
                        Запланировать
                    </button>
                    <button
                        onClick={() => handleMethodChange('vk')}
                        className={`${buttonBaseClass} ${method === 'vk' ? activeClass : inactiveClass}`}
                    >
                        В отложку VK
                    </button>
                    <button
                        onClick={() => handleMethodChange('now')}
                        className={`${buttonBaseClass} ${method === 'now' ? activeClass : inactiveClass}`}
                    >
                        Опубликовать сейчас
                    </button>
                </div>
            </div>

            <div className="p-4 bg-white border-2 border-gray-300 rounded-lg space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">Опции создания постов:</p>

                {/* Массовое создание */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                    bulkAvailable ? 'bg-gray-50' : 'bg-gray-100'
                }`}>
                    <span className={`text-sm ${bulkAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                        Массовое создание
                    </span>
                    <button
                        onClick={() => bulkAvailable && setIsBulk(!isBulk)}
                        disabled={!bulkAvailable}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            isBulk && bulkAvailable ? 'bg-indigo-600' : 'bg-gray-300'
                        } ${!bulkAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isBulk && bulkAvailable ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Циклическая публикация */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                    cyclicAvailable ? 'bg-gray-50' : 'bg-gray-100'
                }`}>
                    <span className={`text-sm ${cyclicAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                        Циклическая публикация
                    </span>
                    <button
                        onClick={() => cyclicAvailable && setIsCyclic(!isCyclic)}
                        disabled={!cyclicAvailable}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            isCyclic && cyclicAvailable ? 'bg-indigo-600' : 'bg-gray-300'
                        } ${!cyclicAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isCyclic && cyclicAvailable ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Мультипроект */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Мультипроектная публикация</span>
                    <button
                        onClick={() => setIsMultiproject(!isMultiproject)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            isMultiproject ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isMultiproject ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <p className="font-semibold mb-1">Текущий метод: {
                    method === 'system' ? 'Запланировать' : 
                    method === 'vk' ? 'В отложку VK' : 
                    'Опубликовать сейчас'
                }</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Массовое создание: {bulkAvailable ? '✅ Доступно' : '❌ Заблокировано'}</li>
                    <li>Циклическая публикация: {cyclicAvailable ? '✅ Доступно' : '❌ Заблокировано'}</li>
                    <li>Мультипроект: ✅ Всегда доступно</li>
                </ul>
            </div>
        </div>
    );
};

// =====================================================================
// Mock-компоненты для страницы "Массовое создание"
// =====================================================================

// Демонстрация переключателя массового создания с блокировкой
export const BulkModeToggleDemo: React.FC = () => {
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isCyclic, setIsCyclic] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="space-y-6">
            {/* Управляющие кнопки */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <button
                    onClick={() => setIsCyclic(!isCyclic)}
                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {isCyclic ? '✓' : ''} Включить цикличность (имитация)
                </button>
                <button
                    onClick={() => {
                        setIsSaving(true);
                        setTimeout(() => setIsSaving(false), 1500);
                    }}
                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Имитировать сохранение
                </button>
            </div>

            {/* Переключатель массового создания */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <button
                    type="button"
                    onClick={() => !isSaving && !isCyclic && setIsBulkMode(!isBulkMode)}
                    disabled={isSaving || isCyclic}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${
                        isBulkMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        isBulkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
                <label 
                    onClick={() => !isSaving && !isCyclic && setIsBulkMode(!isBulkMode)}
                    className={`text-sm font-medium text-gray-700 cursor-pointer select-none ${
                        isCyclic ? 'opacity-50' : ''
                    }`}
                >
                    Создать несколько постов
                </label>
            </div>

            {/* Статус */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium">Текущее состояние:</p>
                <ul className="list-disc list-inside mt-2 text-sm text-blue-800 space-y-1">
                    <li>Массовое создание: {isBulkMode ? '✅ Включено' : '❌ Выключено'}</li>
                    <li>Циклическая публикация: {isCyclic ? '✅ Включена (блокирует bulk)' : '❌ Выключена'}</li>
                    <li>Сохранение: {isSaving ? '⏳ В процессе...' : '✅ Готов'}</li>
                    <li>Переключатель: {isCyclic || isSaving ? '🔒 Заблокирован' : '🔓 Активен'}</li>
                </ul>
            </div>
        </div>
    );
};

// Демонстрация списка слотов с добавлением/удалением
export const DateSlotsListDemo: React.FC = () => {
    const [slots, setSlots] = useState([
        { id: 1, date: '2024-03-15', time: '10:00' },
        { id: 2, date: '2024-03-16', time: '10:00' }
    ]);

    const addSlot = () => {
        if (slots.length >= 10) return;
        const lastSlot = slots[slots.length - 1];
        const nextDate = new Date(lastSlot.date);
        nextDate.setDate(nextDate.getDate() + 1);
        const dateString = nextDate.toISOString().split('T')[0];
        setSlots([...slots, { 
            id: slots.length + 1, 
            date: dateString, 
            time: lastSlot.time 
        }]);
    };

    const removeSlot = (id: number) => {
        if (slots.length <= 1) return;
        setSlots(slots.filter(s => s.id !== id));
    };

    const updateSlot = (id: number, field: 'date' | 'time', value: string) => {
        setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="space-y-4">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Даты публикации ({slots.length}/10)
                </label>
                <button
                    onClick={addSlot}
                    disabled={slots.length >= 10}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Добавить дату
                </button>
            </div>

            {/* Список слотов */}
            <div className="space-y-2">
                {slots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-2 animate-fade-in-up">
                        <input
                            type="date"
                            value={slot.date}
                            onChange={(e) => updateSlot(slot.id, 'date', e.target.value)}
                            className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                            type="time"
                            value={slot.time}
                            onChange={(e) => updateSlot(slot.id, 'time', e.target.value)}
                            className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => removeSlot(slot.id)}
                            disabled={slots.length <= 1}
                            className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={slots.length <= 1 ? 'Нельзя удалить последний слот' : 'Удалить'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Подсказка */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                    💡 <strong>Новый слот:</strong> Дата = последний слот + 1 день, время копируется с последнего слота
                </p>
            </div>
        </div>
    );
};

// Интерактивный калькулятор подсчёта постов
export const PostCountCalculatorDemo: React.FC = () => {
    const [projectCount, setProjectCount] = useState(3);
    const [dateCount, setDateCount] = useState(2);
    const [isMultiProject, setIsMultiProject] = useState(true);
    const [isBulkMode, setIsBulkMode] = useState(true);

    const totalPosts = (isMultiProject ? projectCount : 1) * (isBulkMode ? dateCount : 1);

    return (
        <div className="space-y-6">
            {/* Переключатели режимов */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMultiProject(!isMultiProject)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                isMultiProject ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isMultiProject ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Мультипроект</span>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBulkMode(!isBulkMode)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                isBulkMode ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isBulkMode ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Массовое создание</span>
                    </div>
                </div>
            </div>

            {/* Ползунки */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество проектов: <span className="text-indigo-600 font-bold">{projectCount}</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={projectCount}
                        onChange={(e) => setProjectCount(Number(e.target.value))}
                        disabled={!isMultiProject}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество дат: <span className="text-indigo-600 font-bold">{dateCount}</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={dateCount}
                        onChange={(e) => setDateCount(Number(e.target.value))}
                        disabled={!isBulkMode}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Формула и результат */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Формула расчёта:</p>
                <div className="font-mono text-sm text-gray-800 mb-4">
                    postCount = ({isMultiProject ? projectCount : <span className="text-gray-400">1</span>}) × ({isBulkMode ? dateCount : <span className="text-gray-400">1</span>})
                </div>
                <div className="text-center">
                    <p className="text-4xl font-bold text-green-700">{totalPosts}</p>
                    <p className="text-sm text-green-600 mt-1">
                        {totalPosts === 1 ? 'пост' : totalPosts < 5 ? 'поста' : 'постов'} будет создано
                    </p>
                </div>
            </div>

            {/* Пример кнопки сохранения */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Так будет выглядеть кнопка сохранения:</p>
                <button className="w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700">
                    {totalPosts > 1 ? `Запланировать (${totalPosts})` : 'Запланировать'}
                </button>
            </div>
        </div>
    );
};

// Демонстрация взаимоисключения режимов
export const BulkModeInteractionDemo: React.FC = () => {
    const [publicationMethod, setPublicationMethod] = useState<'system' | 'vk' | 'now'>('system');
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isCyclic, setIsCyclic] = useState(false);

    // Эмуляция логики из реального кода
    const handleMethodChange = (method: 'system' | 'vk' | 'now') => {
        setPublicationMethod(method);
        if (method === 'now') {
            setIsBulkMode(false);
            setIsCyclic(false);
        }
        if (method === 'vk') {
            setIsCyclic(false);
        }
    };

    const handleBulkToggle = () => {
        if (publicationMethod === 'now') return;
        if (isCyclic) return;
        setIsBulkMode(!isBulkMode);
    };

    const handleCyclicToggle = () => {
        if (publicationMethod === 'now') return;
        if (!isCyclic && isBulkMode) {
            setIsBulkMode(false);
        }
        setIsCyclic(!isCyclic);
    };

    const bulkVisible = publicationMethod !== 'now';
    const bulkEnabled = !isCyclic && publicationMethod !== 'now';
    const cyclicEnabled = publicationMethod !== 'now';

    return (
        <div className="space-y-6">
            {/* Выбор способа публикации */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Способ публикации:</label>
                <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
                    {(['system', 'vk', 'now'] as const).map((method) => (
                        <button
                            key={method}
                            onClick={() => handleMethodChange(method)}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                publicationMethod === method
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {method === 'system' && 'Через систему'}
                            {method === 'vk' && 'В отложку VK'}
                            {method === 'now' && 'Опубликовать сейчас'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Переключатели режимов */}
            <div className="space-y-3">
                {bulkVisible && (
                    <div className={`flex items-center gap-3 p-4 bg-white rounded-lg border ${
                        bulkEnabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <button
                            onClick={handleBulkToggle}
                            disabled={!bulkEnabled}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${
                                isBulkMode ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isBulkMode ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <label className={`text-sm font-medium text-gray-700 ${!bulkEnabled ? 'opacity-50' : ''}`}>
                            Создать несколько постов
                        </label>
                        {!bulkEnabled && isCyclic && (
                            <span className="ml-auto text-xs text-red-600">🔒 Заблокировано циклической публикацией</span>
                        )}
                    </div>
                )}

                <div className={`flex items-center gap-3 p-4 bg-white rounded-lg border ${
                    cyclicEnabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                }`}>
                    <button
                        onClick={handleCyclicToggle}
                        disabled={!cyclicEnabled}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${
                            isCyclic ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            isCyclic ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                    <label className={`text-sm font-medium text-gray-700 ${!cyclicEnabled ? 'opacity-50' : ''}`}>
                        Циклическая публикация
                    </label>
                    {!cyclicEnabled && (
                        <span className="ml-auto text-xs text-red-600">🔒 Недоступно при "Опубликовать сейчас"</span>
                    )}
                </div>
            </div>

            {/* Статус совместимости */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Текущее состояние:</p>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li>Способ публикации: <strong>{
                        publicationMethod === 'system' ? 'Через систему' :
                        publicationMethod === 'vk' ? 'В отложку VK' : 'Опубликовать сейчас'
                    }</strong></li>
                    <li>Массовое создание: {bulkVisible ? (isBulkMode ? '✅ Включено' : '⭕ Выключено') : '❌ Скрыто'}</li>
                    <li>Циклическая публикация: {isCyclic ? '✅ Включена' : '⭕ Выключена'}</li>
                </ul>
                {publicationMethod === 'now' && (
                    <p className="mt-3 text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                        ⚠️ При выборе "Опубликовать сейчас" оба режима автоматически выключаются и скрываются
                    </p>
                )}
                {isCyclic && (
                    <p className="mt-3 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                        🚫 Массовое создание и циклическая публикация взаимоисключающие — может быть включён только один из них
                    </p>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// Mock-компоненты для страницы "Мультипроектная публикация"
// =====================================================================

// Демонстрация переключателя мультипроектной публикации
export const MultiProjectToggleDemo: React.FC = () => {
    const [isMultiProjectMode, setIsMultiProjectMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="space-y-6">
            {/* Кнопка имитации сохранения */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <button
                    onClick={() => {
                        setIsSaving(true);
                        setTimeout(() => setIsSaving(false), 1500);
                    }}
                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Имитировать сохранение
                </button>
            </div>

            {/* Переключатель мультипроекта */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <button
                    type="button"
                    onClick={() => !isSaving && setIsMultiProjectMode(!isMultiProjectMode)}
                    disabled={isSaving}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${
                        isMultiProjectMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        isMultiProjectMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
                <label 
                    onClick={() => !isSaving && setIsMultiProjectMode(!isMultiProjectMode)}
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                    Мультипроектная публикация
                </label>
            </div>

            {/* Статус */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium">Текущее состояние:</p>
                <ul className="list-disc list-inside mt-2 text-sm text-blue-800 space-y-1">
                    <li>Мультипроект: {isMultiProjectMode ? '✅ Включён' : '❌ Выключен'}</li>
                    <li>Сохранение: {isSaving ? '⏳ В процессе...' : '✅ Готов'}</li>
                    <li>Переключатель: {isSaving ? '🔒 Заблокирован' : '🔓 Активен'}</li>
                </ul>
            </div>
        </div>
    );
};

// Демонстрация селектора проектов
export const MultiProjectSelectorDemo: React.FC = () => {
    const mockProjects = [
        { id: '1', name: 'Кофейня "Бодрость"', team: 'Команда А', isCurrent: true },
        { id: '2', name: 'Фитнес-клуб "Энергия"', team: 'Команда А', isCurrent: false },
        { id: '3', name: 'Салон красоты "Стиль"', team: 'Команда Б', isCurrent: false },
        { id: '4', name: 'Ресторан "Вкусно&Точка"', team: 'Команда Б', isCurrent: false },
        { id: '5', name: 'Автосервис "Мастер"', team: 'Без команды', isCurrent: false },
        { id: '6', name: 'Книжный магазин "Читай-город"', team: 'Команда А', isCurrent: false },
        { id: '7', name: 'Детский сад "Радуга"', team: 'Команда Б', isCurrent: false },
        { id: '8', name: 'Пекарня "Хлебница"', team: 'Без команды', isCurrent: false }
    ];

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1']));
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<string>('All');

    const teams = ['Команда А', 'Команда Б', 'Без команды'];

    const filteredProjects = mockProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
        return matchesSearch && matchesTeam;
    });

    const handleToggle = (id: string, isCurrent: boolean) => {
        if (isCurrent) return; // Текущий проект нельзя снять
        const newIds = new Set(selectedIds);
        if (newIds.has(id)) {
            newIds.delete(id);
        } else {
            newIds.add(id);
        }
        setSelectedIds(newIds);
    };

    const handleSelectAll = () => {
        const newIds = new Set(selectedIds);
        filteredProjects.forEach(p => newIds.add(p.id));
        setSelectedIds(newIds);
    };

    const handleDeselectAll = () => {
        const newIds = new Set<string>();
        // Текущий проект всегда остаётся
        newIds.add('1');
        setSelectedIds(newIds);
    };

    return (
        <div className="space-y-4 animate-fade-in-up">
            {/* Заголовок с счётчиком */}
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Выберите проекты:</h4>
                <span className="text-sm font-medium text-gray-600">Выбрано: {selectedIds.size}</span>
            </div>

            {/* Поиск */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Фильтры по командам */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setTeamFilter('All')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                        teamFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Все
                </button>
                {teams.map(team => (
                    <button
                        key={team}
                        onClick={() => setTeamFilter(team)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                            teamFilter === team ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {team}
                    </button>
                ))}
            </div>

            {/* Действия над списком */}
            <div className="flex gap-2 text-xs">
                <button onClick={handleSelectAll} className="text-indigo-600 hover:text-indigo-800">
                    Выбрать все видимые
                </button>
                <span>|</span>
                <button onClick={handleDeselectAll} className="text-indigo-600 hover:text-indigo-800">
                    Снять выделение
                </button>
            </div>

            {/* Список проектов (с прокруткой) */}
            <div className="max-h-48 overflow-y-auto custom-scrollbar border rounded-md p-2 space-y-1 bg-white">
                {filteredProjects.map((project) => {
                    const isChecked = selectedIds.has(project.id);
                    return (
                        <label
                            key={project.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                                project.isCurrent ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={project.isCurrent}
                                onChange={() => handleToggle(project.id, project.isCurrent)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                            />
                            <span className={`ml-3 text-sm font-medium ${
                                project.isCurrent ? 'text-gray-500' : 'text-gray-800'
                            }`}>
                                {project.name}
                                {project.isCurrent && ' (текущий проект)'}
                            </span>
                        </label>
                    );
                })}
                {filteredProjects.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Ничего не найдено</p>
                )}
            </div>

            {/* Подсказка */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                    💡 <strong>Текущий проект</strong> (из которого открыта модалка) всегда выбран и не может быть снят
                </p>
            </div>
        </div>
    );
};

// Калькулятор подсчёта постов с мультипроектом
export const MultiProjectPostCountDemo: React.FC = () => {
    const [projectCount, setProjectCount] = useState(3);
    const [dateCount, setDateCount] = useState(2);
    const [isMultiProject, setIsMultiProject] = useState(true);
    const [isBulk, setIsBulk] = useState(true);

    const totalPosts = (isMultiProject ? projectCount : 1) * (isBulk ? dateCount : 1);

    return (
        <div className="space-y-6">
            {/* Переключатели */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMultiProject(!isMultiProject)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                isMultiProject ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isMultiProject ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Мультипроект</span>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBulk(!isBulk)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                isBulk ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isBulk ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Массовое создание</span>
                    </div>
                </div>
            </div>

            {/* Ползунки */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество проектов: <span className="text-indigo-600 font-bold">{projectCount}</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={projectCount}
                        onChange={(e) => setProjectCount(Number(e.target.value))}
                        disabled={!isMultiProject}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество дат: <span className="text-indigo-600 font-bold">{dateCount}</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={dateCount}
                        onChange={(e) => setDateCount(Number(e.target.value))}
                        disabled={!isBulk}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Формула и результат */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Формула расчёта:</p>
                <div className="font-mono text-sm text-gray-800 mb-4">
                    postCount = ({isMultiProject ? projectCount : <span className="text-gray-400">1</span>}) × ({isBulk ? dateCount : <span className="text-gray-400">1</span>})
                </div>
                <div className="text-center">
                    <p className="text-4xl font-bold text-green-700">{totalPosts}</p>
                    <p className="text-sm text-green-600 mt-1">
                        {totalPosts === 1 ? 'пост' : totalPosts < 5 ? 'поста' : 'постов'} будет создано
                    </p>
                </div>
            </div>

            {/* Пример кнопки */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Так будет выглядеть кнопка сохранения:</p>
                <button className="w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700">
                    {totalPosts > 1 ? `Запланировать (${totalPosts})` : 'Запланировать'}
                </button>
            </div>
        </div>
    );
};

// Демонстрация логики параллельного сохранения
export const MultiProjectSaveDemo: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState<{ project: string; status: 'pending' | 'success' | 'error' }[]>([]);

    const mockProjects = ['Кофейня "Бодрость"', 'Фитнес-клуб "Энергия"', 'Салон красоты "Стиль"'];
    const mockDates = ['15 марта, 10:00', '16 марта, 10:00'];

    const handleSave = async () => {
        setIsSaving(true);
        const allCombinations = mockProjects.flatMap(project => 
            mockDates.map(date => ({ project, date }))
        );

        const initialProgress = allCombinations.map((combo, idx) => ({
            project: `${combo.project} → ${combo.date}`,
            status: 'pending' as const
        }));
        setProgress(initialProgress);

        // Имитация параллельного сохранения
        await new Promise(resolve => setTimeout(resolve, 500));

        for (let i = 0; i < initialProgress.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setProgress(prev => prev.map((item, idx) => 
                idx === i ? { ...item, status: Math.random() > 0.1 ? 'success' as const : 'error' as const } : item
            ));
        }

        setIsSaving(false);
    };

    return (
        <div className="space-y-4">
            {/* Сценарий */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Сценарий:</p>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li>{mockProjects.length} проектов × {mockDates.length} даты = <strong>{mockProjects.length * mockDates.length} постов</strong></li>
                    <li>Все посты создаются <strong>параллельно</strong> (Promise.allSettled)</li>
                    <li>Ошибка в одном посте не прерывает сохранение остальных</li>
                </ul>
            </div>

            {/* Кнопка запуска */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Сохранение...' : `Запланировать (${mockProjects.length * mockDates.length})`}
            </button>

            {/* Прогресс */}
            {progress.length > 0 && (
                <div className="border rounded-md p-3 bg-white space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {progress.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                            {item.status === 'pending' && <span className="text-gray-400">⏳</span>}
                            {item.status === 'success' && <span className="text-green-600">✅</span>}
                            {item.status === 'error' && <span className="text-red-600">❌</span>}
                            <span className={
                                item.status === 'success' ? 'text-green-700' : 
                                item.status === 'error' ? 'text-red-700' : 'text-gray-600'
                            }>
                                {item.project}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Итог */}
            {!isSaving && progress.length > 0 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                        ✅ Создано: {progress.filter(p => p.status === 'success').length} из {progress.length} постов
                        {progress.some(p => p.status === 'error') && (
                            <span className="block mt-1 text-red-700">⚠️ Некоторые посты не удалось создать</span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// TEXT EDITING: Mock-компоненты для страницы "Работа с текстом"
// =====================================================================

// Mock-компонент: Текстовый редактор с кнопками управления
export const TextEditorDemo: React.FC = () => {
    const [text, setText] = useState('Привет! 👋 Это пример текста в редакторе.\n\nВы можете использовать переменные, AI-помощника и эмодзи.');
    const [showVariables, setShowVariables] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    return (
        <div className="bg-white rounded-lg border border-gray-300 p-4">
            {/* Панель инструментов */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <button
                    onClick={() => setShowVariables(!showVariables)}
                    className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
                        showVariables 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    Переменные
                </button>
                <button
                    onClick={() => setShowAI(!showAI)}
                    className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
                        showAI 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    AI-помощник
                </button>
                <span className="text-gray-300">|</span>
                <button
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    title="Обновить переменные"
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 3.938 9m0 0H9m4 11v-5h-.582M12.062 15a8.001 8.001 0 0 0 11.52-6.938" />
                    </svg>
                </button>
                <button
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    title="Настроить переменные"
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </button>
            </div>

            {/* Textarea с кнопкой эмодзи */}
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[120px] p-3 pr-10 text-sm text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none custom-scrollbar"
                    placeholder="Введите текст поста..."
                />
                <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    title="Добавить эмодзи"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                        <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14s1.5 2 4 2 4-2 4-2" />
                    </svg>
                </button>
            </div>

            {/* Счетчик символов (фейковый - в реале его нет) */}
            <div className="mt-2 text-xs text-gray-500">
                Символов: {text.length}
            </div>
        </div>
    );
};

// Mock-компонент: Панель выбора переменных
export const VariablesSelectorDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'global' | 'project' | 'vk'>('global');
    const [searchQuery, setSearchQuery] = useState('');

    const globalVars = [
        { name: 'Благодарность автору', value: '{global_AUTHOR_THANKS}' },
        { name: 'Хештег проекта', value: '{global_PROJECT_HASHTAG}' },
        { name: 'Призыв к подписке', value: '{global_SUBSCRIBE_CTA}' },
    ];

    const projectVars = [
        { name: 'Ссылка на сообщество', value: 'https://vk.com/mygroup' },
        { name: 'Ссылка на сообщения', value: 'https://vk.me/mygroup' },
        { name: 'Название сообщества', value: 'Моё сообщество' },
        { name: 'Упоминание сообщества', value: '@mygroup (Моё сообщество)' },
    ];

    const vkConstructs = [
        { name: '[ссылка|текст]', value: '[https://vk.com|Текст ссылки]' },
        { name: '@упоминание', value: '@mygroup (название)' },
    ];

    const getCurrentVars = () => {
        if (activeTab === 'global') return globalVars;
        if (activeTab === 'project') return projectVars;
        return vkConstructs;
    };

    const filteredVars = getCurrentVars().filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {[
                    { key: 'global' as const, label: 'Глобальные' },
                    { key: 'project' as const, label: 'Проектные' },
                    { key: 'vk' as const, label: 'Конструкции VK' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.key
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Поиск */}
            <div className="p-3 border-b border-gray-200">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск переменных..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Список переменных */}
            <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                    {filteredVars.map((variable, idx) => (
                        <button
                            key={idx}
                            className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-md transition-colors"
                        >
                            <div className="font-medium text-gray-900">{variable.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 font-mono">{variable.value}</div>
                        </button>
                    ))}
                </div>
                {filteredVars.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Переменные не найдены</p>
                )}
            </div>
        </div>
    );
};

// Mock-компонент: Быстрые действия AI
export const AIQuickActionsDemo: React.FC = () => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const actions = [
        { 
            id: 'rewrite', 
            label: 'Рерайт', 
            hasIcon: true,
            description: 'Переписать текст, сохранив смысл' 
        },
        { 
            id: 'fix', 
            label: 'Исправить ошибки', 
            hasIcon: true,
            description: 'Исправить орфографию и пунктуацию' 
        },
        { 
            id: 'shorten', 
            label: 'Сократи', 
            hasIcon: false,
            description: 'Сократить текст' 
        },
        { 
            id: 'expand', 
            label: 'Расширь', 
            hasIcon: false,
            description: 'Добавить деталей' 
        },
        { 
            id: 'add-emoji', 
            label: '+ эмоджи', 
            hasIcon: false,
            description: 'Добавить эмодзи' 
        },
        { 
            id: 'remove-emoji', 
            label: '- эмоджи', 
            hasIcon: false,
            description: 'Убрать лишние эмодзи' 
        },
    ];

    const handleAction = (id: string) => {
        setSelectedAction(id);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setSelectedAction(null);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Быстрые действия</h4>
            <div className="flex flex-wrap gap-2">
                {actions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        disabled={isProcessing}
                        title={action.description}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        {action.hasIcon && action.id === 'rewrite' && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 3.938 9m0 0H9m4 11v-5h-.582M12.062 15a8.001 8.001 0 0 0 11.52-6.938" />
                            </svg>
                        )}
                        {action.hasIcon && action.id === 'fix' && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        )}
                        <span>{selectedAction === action.id && isProcessing ? 'Обработка...' : action.label}</span>
                    </button>
                ))}
            </div>
            {selectedAction && isProcessing && (
                <div className="mt-3 p-2 bg-indigo-50 rounded-md border border-indigo-200">
                    <p className="text-xs text-indigo-700">⏳ AI обрабатывает ваш запрос...</p>
                </div>
            )}
        </div>
    );
};

// Mock-компонент: Emoji Picker
export const EmojiPickerDemo: React.FC = () => {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const emojiCategories = {
        'Смайлики': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘'],
        'Жесты': ['👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪', '🦾'],
        'Символы': ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗'],
    };

    return (
        <div className="bg-white rounded-lg border border-gray-300 p-4 max-w-md">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Выберите эмодзи</h4>
                <button className="text-xs text-gray-500 hover:text-gray-700">Закрыть</button>
            </div>

            {/* Поиск */}
            <input
                type="text"
                placeholder="Поиск эмодзи..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
            />

            {/* Категории и эмодзи */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-3">
                {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category}>
                        <h5 className="text-xs font-semibold text-gray-600 mb-2">{category}</h5>
                        <div className="grid grid-cols-8 gap-2">
                            {emojis.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedEmoji(emoji)}
                                    className={`w-8 h-8 flex items-center justify-center text-lg hover:bg-indigo-50 rounded transition-colors ${
                                        selectedEmoji === emoji ? 'bg-indigo-100' : ''
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedEmoji && (
                <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                    <p className="text-xs text-green-700">✅ Эмодзи {selectedEmoji} вставлен в текст</p>
                </div>
            )}
        </div>
    );
};

// Mock-компонент: Демонстрация валидации
export const TextValidationDemo: React.FC = () => {
    const [text, setText] = useState('');
    const [hasMedia, setHasMedia] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSave = () => {
        if (!text.trim() && !hasMedia) {
            setShowError(true);
        } else {
            setShowError(false);
            alert('✅ Пост сохранен!');
        }
    };

    const canSave = text.trim() || hasMedia;

    return (
        <div className="bg-white rounded-lg border border-gray-300 p-4">
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Текст поста</label>
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setShowError(false);
                    }}
                    className="w-full min-h-[80px] p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Введите текст..."
                />
            </div>

            <div className="mb-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={hasMedia}
                        onChange={(e) => {
                            setHasMedia(e.target.checked);
                            setShowError(false);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Есть изображения или медиа</span>
                </label>
            </div>

            {showError && (
                <div className="mb-3 p-3 bg-red-50 rounded-md border border-red-200">
                    <p className="text-sm text-red-700">❌ Текст поста не может быть пустым. Введите текст.</p>
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        canSave
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Сохранить
                </button>
                <p className="text-xs text-gray-500">
                    {canSave 
                        ? '✅ Можно сохранить' 
                        : '⚠️ Нужен текст или медиа'
                    }
                </p>
            </div>
        </div>
    );
};

// =====================================================================
// AI-ПОМОЩНИК В ПОСТЕ (2.1.7.6)
// =====================================================================

// Mock: Кнопка "AI-помощник" (text-only, без иконки)
export const AIButtonDemo: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="space-y-4">
            {/* Пример в контексте панели редактирования */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Инструменты редактирования</span>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
                            isActive 
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        AI-помощник
                    </button>
                </div>
                
                {isActive && (
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <p className="text-sm text-indigo-700">
                            ✨ AI-помощник активен
                        </p>
                    </div>
                )}
            </div>

            {/* Индикатор состояния */}
            <div className="text-sm text-gray-600">
                <strong>Текущее состояние:</strong> {isActive ? '🟢 Открыт' : '⚪ Закрыт'}
            </div>
        </div>
    );
};

// Mock: 6 быстрых действий с иконками
export const QuickActionsDemo: React.FC = () => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = (action: string) => {
        setSelectedAction(action);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            {/* Панель быстрых действий */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">Быстрые действия:</p>
                <div className="flex flex-wrap gap-2">
                    {/* 1. Рерайт (с иконкой SVG) */}
                    <button
                        onClick={() => handleAction('Рерайт')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Переписать основной текст поста, сохранив смысл"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                        Рерайт
                    </button>

                    {/* 2. Исправить ошибки (с иконкой SVG) */}
                    <button
                        onClick={() => handleAction('Исправить ошибки')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Исправить орфографию и пунктуацию в основном тексте поста"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Исправить ошибки
                    </button>

                    {/* 3. Сократи (text-only) */}
                    <button
                        onClick={() => handleAction('Сократи')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Сократить текст, сохранив смысл"
                    >
                        Сократи
                    </button>

                    {/* 4. Расширь (text-only) */}
                    <button
                        onClick={() => handleAction('Расширь')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Расширить текст, добавив деталей"
                    >
                        Расширь
                    </button>

                    {/* 5. + эмоджи (text-only) */}
                    <button
                        onClick={() => handleAction('+ эмоджи')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Добавить эмоджи в текст"
                    >
                        + эмоджи
                    </button>

                    {/* 6. - эмоджи (text-only) */}
                    <button
                        onClick={() => handleAction('- эмоджи')}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        title="Убрать лишние эмоджи из текста"
                    >
                        - эмоджи
                    </button>
                </div>

                {/* Индикатор работы */}
                {isProcessing && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-700">
                            ⏳ Обработка: {selectedAction}...
                        </p>
                    </div>
                )}

                {!isProcessing && selectedAction && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700">
                            ✅ Действие "{selectedAction}" выполнено
                        </p>
                    </div>
                )}
            </div>

            {/* Подсказка */}
            <div className="text-xs text-gray-500">
                💡 Первые 2 кнопки имеют иконки, остальные 4 — только текст
            </div>
        </div>
    );
};

// Mock: Чат-диалог с AI
export const ChatDialogDemo: React.FC = () => {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
        { role: 'user', text: 'Сделай текст более официальным' },
        { role: 'ai', text: 'Уважаемые коллеги! Представляем вашему вниманию новое предложение по оптимизации рабочих процессов.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        
        setMessages([...messages, { role: 'user', text: inputValue }]);
        setInputValue('');

        // Имитация ответа AI
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: 'Вот переработанный вариант текста с учётом вашего запроса.' 
            }]);
        }, 1000);
    };

    return (
        <div className="bg-white border border-indigo-200 rounded-lg overflow-hidden">
            {/* История чата */}
            <div className="h-64 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">Начните диалог с AI</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Поле ввода */}
            <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Напишите запрос AI..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mock: Системные инструкции (toggle + presets)
export const SystemPromptDemo: React.FC = () => {
    const [useCustom, setUseCustom] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>('default');

    const presets = [
        { id: 'default', name: 'По умолчанию' },
        { id: 'formal', name: 'Официальный стиль' },
        { id: 'creative', name: 'Креативный' },
        { id: 'concise', name: 'Краткий' }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Использовать свои инструкции</span>
                <button 
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                        useCustom ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setUseCustom(!useCustom)}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        useCustom ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
            </div>

            {/* Presets selector */}
            {useCustom && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Выберите пресет:</label>
                    <select
                        value={selectedPreset}
                        onChange={(e) => setSelectedPreset(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {presets.map(preset => (
                            <option key={preset.id} value={preset.id}>
                                {preset.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Или введите свои инструкции..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>
            )}

            {/* Индикатор */}
            <div className="text-xs text-gray-500">
                {useCustom ? '🎨 Используются кастомные инструкции' : '📋 Используются стандартные инструкции'}
            </div>
        </div>
    );
};

// Mock: Селектор контекста (товары, компания)
export const ContextSelectorDemo: React.FC = () => {
    const [contextOpen, setContextOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const products = [
        { id: '1', name: 'iPhone 15 Pro', price: '89990 ₽' },
        { id: '2', name: 'AirPods Pro', price: '24990 ₽' },
        { id: '3', name: 'MacBook Air M2', price: '109990 ₽' }
    ];

    return (
        <div className="space-y-3">
            <button
                onClick={() => setContextOpen(!contextOpen)}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
                {contextOpen ? '▼' : '▶'} Добавить контекст проекта
            </button>

            {contextOpen && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Товары:</label>
                        <div className="space-y-2">
                            {products.map(product => (
                                <label key={product.id} className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedProduct === product.id}
                                        onChange={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                                        className="mt-1"
                                    />
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-gray-500">{product.price}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {selectedProduct && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-700">
                                ✅ Контекст добавлен: AI будет учитывать информацию о товаре
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Mock: Действия с сообщением (Regenerate, Copy, Add to post)
export const MessageActionsDemo: React.FC = () => {
    const [action, setAction] = useState<string | null>(null);

    const handleAction = (actionName: string) => {
        setAction(actionName);
        setTimeout(() => setAction(null), 2000);
    };

    return (
        <div className="space-y-3">
            {/* Пример AI-сообщения с кнопками */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 mb-3">
                    Вот переработанный текст: "Новая коллекция смартфонов уже в наличии! 📱"
                </p>

                {/* Кнопки действий */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleAction('Regenerate')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Сгенерировать заново"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                        Regenerate
                    </button>

                    <button
                        onClick={() => handleAction('Copy')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Скопировать"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                    </button>

                    <button
                        onClick={() => handleAction('Add to post')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                        title="Добавить в пост"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add to post
                    </button>
                </div>
            </div>

            {/* Индикатор действия */}
            {action && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                        ✅ Действие "{action}" выполнено
                    </p>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// Mock-компоненты для страницы "Работа с медиа"
// =====================================================================

// Mock: Три способа загрузки
export const MockMediaUploadMethods: React.FC = () => {
    const [uploadedCount, setUploadedCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = (method: string) => {
        setUploadedCount(prev => prev + 1);
        setTimeout(() => {
            alert(`Загружено через: ${method}`);
        }, 100);
    };

    return (
        <div className="space-y-4">
            {/* Кнопки загрузки */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handleUpload('кнопку "Загрузить"')}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                    Загрузить
                </button>
                <button 
                    onClick={() => handleUpload('галерею VK')}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                    Добавить фото
                </button>
            </div>

            {/* Drag & Drop зона */}
            <div 
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { 
                    e.preventDefault(); 
                    setIsDragging(false); 
                    handleUpload('перетаскивание файлов');
                }}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging 
                        ? 'border-indigo-500 bg-indigo-100 bg-opacity-75' 
                        : 'border-gray-300 bg-gray-50'
                }`}
            >
                <svg 
                    className={`mx-auto h-12 w-12 transition-colors ${
                        isDragging ? 'text-indigo-500' : 'text-gray-400'
                    }`} 
                    stroke="currentColor" 
                    fill="none" 
                    viewBox="0 0 48 48"
                >
                    <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
                <p className={`mt-2 text-sm font-semibold ${isDragging ? 'text-indigo-700' : 'text-gray-600'}`}>
                    {isDragging ? 'Отпустите файлы для загрузки' : 'Перетащите файлы сюда'}
                </p>
            </div>

            {/* Счётчик загрузок */}
            {uploadedCount > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                        ✅ Загружено файлов: {uploadedCount}
                    </p>
                </div>
            )}
        </div>
    );
};

// Mock: Сетка изображений с управлением
export const MockMediaGrid: React.FC = () => {
    const [images, setImages] = useState([
        { id: 1, url: 'https://picsum.photos/seed/media-1/200/200' },
        { id: 2, url: 'https://picsum.photos/seed/media-2/200/200' },
        { id: 3, url: 'https://picsum.photos/seed/media-3/200/200' },
        { id: 4, url: 'https://picsum.photos/seed/media-4/200/200' },
    ]);

    const handleRemove = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleAdd = () => {
        const newId = Math.max(...images.map(img => img.id), 0) + 1;
        setImages(prev => [...prev, { 
            id: newId, 
            url: `https://picsum.photos/seed/media-${newId}/200/200` 
        }]);
    };

    return (
        <div className="space-y-4">
            <button 
                onClick={handleAdd}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
                + Добавить изображение
            </button>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 hover:border-indigo-400 cursor-pointer group"
                    >
                        <img
                            src={img.url}
                            alt={`Изображение ${img.id}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => handleRemove(img.id)}
                            className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-md text-center">
                    Изображения не добавлены
                </div>
            )}
        </div>
    );
};

// Mock: Галерея VK с альбомами
export const MockVKGallery: React.FC = () => {
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

    const albums = [
        { id: 'wall', name: 'Фото со стены', count: 156 },
        { id: 'profile', name: 'Фото профиля', count: 12 },
        { id: 'saved', name: 'Сохранённые фото', count: 89 },
        { id: 'custom', name: 'Мой альбом', count: 45 },
    ];

    const photos = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/vk-${i}/200/200`,
    }));

    const togglePhoto = (id: number) => {
        setSelectedPhotos(prev => 
            prev.includes(id) 
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="border rounded-lg overflow-hidden bg-white">
            {/* Вкладки */}
            <div className="p-3 border-b bg-gray-50">
                <div className="flex border-b">
                    <button className="px-4 py-2 text-sm font-medium flex-1 border-b-2 border-indigo-500 text-indigo-600">
                        Проект
                    </button>
                    <button className="px-4 py-2 text-sm font-medium flex-1 border-b-2 border-transparent text-gray-500">
                        Агентство
                    </button>
                </div>
            </div>

            {/* Список альбомов */}
            {!selectedAlbum && (
                <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {albums.map(album => (
                            <button
                                key={album.id}
                                onClick={() => setSelectedAlbum(album.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-400"
                            >
                                <span>{album.name}</span>
                                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700">
                                    {album.count}
                                </span>
                            </button>
                        ))}
                        <button className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full border-blue-400 text-blue-600 bg-white hover:bg-blue-50">
                            + Создать альбом
                        </button>
                    </div>
                </div>
            )}

            {/* Сетка фото */}
            {selectedAlbum && (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button 
                            onClick={() => { setSelectedAlbum(null); setSelectedPhotos([]); }}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            ← Альбомы
                        </button>
                        <button 
                            disabled={selectedPhotos.length === 0}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white disabled:bg-gray-400"
                        >
                            Добавить {selectedPhotos.length > 0 ? `(${selectedPhotos.length})` : ''} фото
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {photos.map(photo => {
                            const isSelected = selectedPhotos.includes(photo.id);
                            return (
                                <div 
                                    key={photo.id}
                                    onClick={() => togglePhoto(photo.id)}
                                    className="relative aspect-square cursor-pointer group"
                                >
                                    <img 
                                        src={photo.url} 
                                        alt="" 
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <div className="absolute top-1 right-1 w-5 h-5 rounded-sm border-2 border-white bg-black/25 flex items-center justify-center">
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <div className="absolute inset-0 ring-2 ring-offset-2 ring-indigo-500 rounded-md"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock: Компактный режим с оверлеем
export const MockCompactMode: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const images = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/compact-${i}/200/200`,
    }));

    const visibleImages = isExpanded ? images : images.slice(0, 4);
    const hiddenCount = images.length - 3;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {visibleImages.map((img, index) => {
                    const isOverlay = !isExpanded && index === 3;
                    return (
                        <div key={img.id} className="relative aspect-square">
                            <img
                                src={img.url}
                                alt={`Изображение ${img.id}`}
                                className="w-full h-full object-cover rounded"
                            />
                            {isOverlay && (
                                <div 
                                    onClick={() => setIsExpanded(true)}
                                    className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-black/50 transition-colors backdrop-blur-[1px]"
                                >
                                    +{hiddenCount}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isExpanded && (
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1 ml-auto"
                >
                    Свернуть
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// Mock: Состояния загрузки
export const MockUploadStates: React.FC = () => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {/* Обычное изображение */}
            <div className="relative aspect-square group">
                <img 
                    src="https://picsum.photos/seed/state-1/200/200" 
                    className="w-full h-full object-cover rounded" 
                    alt="Загружено"
                />
                <button className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    &times;
                </button>
            </div>

            {/* Загрузка */}
            <div className="relative aspect-square">
                <img 
                    src="https://picsum.photos/seed/state-2/200/200" 
                    className="w-full h-full object-cover rounded opacity-50" 
                    alt="Загрузка"
                />
                <div className="absolute inset-0 rounded flex items-center justify-center text-white bg-black/50">
                    <div className="loader border-white border-t-transparent"></div>
                </div>
            </div>

            {/* Ошибка */}
            <div className="relative aspect-square">
                <img 
                    src="https://picsum.photos/seed/state-3/200/200" 
                    className="w-full h-full object-cover rounded opacity-50" 
                    alt="Ошибка"
                />
                <div className="absolute inset-0 rounded flex items-center justify-center text-white bg-red-800/80">
                    <div className="text-center p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs">Ошибка</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// ДОПОЛНИТЕЛЬНЫЕ MOCK-КОМПОНЕНТЫ ДЛЯ ГАЛЕРЕИ VK
// =====================================================================

// Mock: Переключатель размера сетки (3×3 / 4×4 / 5×5)
export const MockGridSizeSwitch: React.FC = () => {
    const [gridSize, setGridSize] = useState(3);

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Размер сетки:</span>
            <div className="flex items-center p-0.5 bg-gray-200 rounded-md">
                {[3, 4, 5].map(size => (
                    <button 
                        key={size} 
                        onClick={() => setGridSize(size)} 
                        title={`Сетка ${size}×${size}`}
                        className={`p-2 rounded transition-colors ${gridSize === size ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            {Array.from({length: size * size}).map((_, i) => {
                                const col = i % size;
                                const row = Math.floor(i / size);
                                const s = 16 / size;
                                const gap = s > 4 ? 1.5 : 1;
                                return (
                                    <rect 
                                        key={i} 
                                        x={col * s + gap/2} 
                                        y={row * s + gap/2} 
                                        width={s - gap} 
                                        height={s - gap} 
                                        rx="1"
                                    />
                                );
                            })}
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Mock: Drag & Drop оверлей при перетаскивании
export const MockDragDropOverlay: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="space-y-4">
            <button 
                onClick={() => setIsDragging(!isDragging)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
                {isDragging ? 'Отпустить файлы' : 'Симуляция перетаскивания'}
            </button>

            <div className="relative border-2 border-gray-300 rounded-lg p-8 bg-gray-50 h-64">
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="aspect-square">
                            <img 
                                src={`https://picsum.photos/seed/drag-${i}/150/150`} 
                                alt="" 
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    ))}
                </div>

                {isDragging && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-indigo-100 bg-opacity-75 border-2 border-dashed border-indigo-500 rounded-lg">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-indigo-700">
                                Загрузить в альбом "Мой альбом"
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mock: Модалка создания альбома (доработанная версия с валидацией)
export const MockCreateAlbumModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!title.trim()) {
            setError('Название альбома не может быть пустым.');
            return;
        }
        setIsSaving(true);
        setError(null);
        setTimeout(() => {
            setIsSaving(false);
            setIsOpen(false);
            setTitle('');
        }, 1500);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle('');
        setError(null);
    };

    return (
        <div>
            <button 
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full border-blue-400 text-blue-600 bg-white hover:bg-blue-50"
            >
                + Создать альбом
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={handleClose}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <header className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Создать новый альбом</h2>
                            <button 
                                onClick={handleClose}
                                disabled={isSaving}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                title="Закрыть"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>
                        <main className="p-6 space-y-4">
                            <div>
                                <label htmlFor="album-title-mock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Название альбома
                                </label>
                                <input
                                    id="album-title-mock"
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    disabled={isSaving}
                                    placeholder="Например, 'Акции Июля'"
                                    className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
                            )}
                        </main>
                        <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button 
                                onClick={handleClose}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!title.trim() || isSaving}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 w-28 flex justify-center items-center"
                            >
                                {isSaving ? (
                                    <div className="loader border-white border-t-transparent h-4 w-4"></div>
                                ) : (
                                    'Создать'
                                )}
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock: Состояния загрузки фото в альбом
export const MockPhotoUploadStates: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Загрузка (uploading) */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">Загрузка</p>
                <div className="relative aspect-square">
                    <img 
                        src="https://picsum.photos/seed/upload-1/200/200" 
                        className="w-full h-full object-cover rounded opacity-50" 
                        alt="Загрузка"
                    />
                    <div className="absolute inset-0 rounded flex items-center justify-center text-white bg-black/50">
                        <div className="loader border-white border-t-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Успешно загружено (completed) */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">Загружено</p>
                <div className="relative aspect-square group">
                    <img 
                        src="https://picsum.photos/seed/upload-2/200/200" 
                        className="w-full h-full object-cover rounded" 
                        alt="Загружено"
                    />
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-sm border-2 border-white bg-black/25 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Ошибка (failed) */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">Ошибка</p>
                <div className="relative aspect-square">
                    <img 
                        src="https://picsum.photos/seed/upload-3/200/200" 
                        className="w-full h-full object-cover rounded opacity-50" 
                        alt="Ошибка"
                    />
                    <div className="absolute inset-0 rounded flex items-center justify-center text-white bg-red-800/80">
                        <div className="text-center p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs mt-1">Превышен размер</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
