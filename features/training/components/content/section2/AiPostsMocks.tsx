import React, { useState } from 'react';

// =====================================================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// =====================================================================

interface MockAiPost {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    nextRun: string;
    recurrenceType: string;
    recurrenceInterval: number;
    systemPrompt: string;
    userPrompt: string;
    generatedText: string;
    images: string[];
    mediaMode: 'all' | 'subset';
    mediaCount?: number;
    mediaType?: 'order' | 'random';
}

// =====================================================================
// MOCK ДАННЫЕ
// =====================================================================

const mockAiPosts: MockAiPost[] = [
    {
        id: '1',
        title: 'Посты про меню',
        description: 'Автоматическая публикация блюд из меню',
        isActive: true,
        nextRun: '20.02.26, 12:00',
        recurrenceType: 'days',
        recurrenceInterval: 2,
        systemPrompt: 'Ты — копирайтер ресторана. Пиши аппетитные описания блюд.',
        userPrompt: 'Создай пост про блюдо из меню с эмоджи и призывом к действию',
        generatedText: '🍝 Карбонара — классика итальянской кухни! 😋\n\nНежная паста с беконом, яйцом и сыром пармезан. Готовится по традиционному рецепту.\n\n💰 Цена: 450 ₽\n📍 Закажи прямо сейчас!',
        images: [
            'https://picsum.photos/seed/pasta1/400/300',
            'https://picsum.photos/seed/pasta2/400/300',
            'https://picsum.photos/seed/pasta3/400/300',
        ],
        mediaMode: 'subset',
        mediaCount: 1,
        mediaType: 'random',
    },
    {
        id: '2',
        title: 'Акции и скидки',
        description: 'Посты про текущие акции',
        isActive: true,
        nextRun: '21.02.26, 10:00',
        recurrenceType: 'weeks',
        recurrenceInterval: 1,
        systemPrompt: 'Ты — маркетолог. Пиши продающие тексты про акции.',
        userPrompt: 'Напиши пост про еженедельную акцию с призывом воспользоваться',
        generatedText: '🔥 АКЦИЯ НЕДЕЛИ! 🔥\n\n-30% на все пиццы при заказе через приложение!\n\nУспей заказать до воскресенья! 🍕\n\n👉 Переходи в приложение и выбирай любимую пиццу со скидкой!',
        images: [
            'https://picsum.photos/seed/promo1/400/300',
        ],
        mediaMode: 'all',
    },
    {
        id: '3',
        title: 'Утреннее меню',
        description: '',
        isActive: false,
        nextRun: '22.02.26, 08:00',
        recurrenceType: 'days',
        recurrenceInterval: 1,
        systemPrompt: 'Ты — SMM-специалист кафе. Пиши посты про завтраки.',
        userPrompt: 'Создай пост про утреннее меню с позитивным настроением',
        generatedText: '☀️ Доброе утро! Начни день с вкусного завтрака!\n\nСегодня в меню:\n🥐 Круассаны\n🍳 Омлеты\n☕ Ароматный кофе\n\nЖдём тебя с 8:00 до 11:00!',
        images: [],
        mediaMode: 'all',
    },
];

// =====================================================================
// КОМПОНЕНТ: Карточка AI-поста в списке
// =====================================================================

interface MockAiPostCardProps {
    post: MockAiPost;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const MockAiPostCard: React.FC<MockAiPostCardProps> = ({ post, onEdit, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getRecurrenceLabel = () => {
        const interval = post.recurrenceInterval;
        const typeMap: Record<string, string> = {
            'minutes': 'мин.', 'hours': 'ч.', 'days': 'дн.', 'weeks': 'нед.', 'months': 'мес.'
        };
        const type = typeMap[post.recurrenceType] || post.recurrenceType;
        return `Каждые ${interval} ${type}`;
    };

    const hasMedia = post.images.length > 0;

    return (
        <div 
            className={`bg-white rounded-lg shadow-sm border flex flex-col h-full transition-all ${
                isHovered ? 'shadow-md' : ''
            } ${post.isActive ? 'border-indigo-100' : 'border-gray-200 bg-gray-50/50'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* ЗАГОЛОВОК, ОПИСАНИЕ, СТАТУС */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-bold truncate ${post.isActive ? 'text-gray-900' : 'text-gray-500'}`} title={post.title}>
                            {post.title}
                        </h3>
                        {post.description ? (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                        ) : (
                            <p className="text-xs text-gray-400 italic mt-1">Нет описания</p>
                        )}
                    </div>
                    
                    <div className="flex-shrink-0">
                        {post.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide border border-green-200">
                                Активно
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600 uppercase tracking-wide border border-gray-300">
                                Пауза
                            </span>
                        )}
                    </div>
                </div>

                {/* Информация о запуске */}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span><span className="font-medium text-gray-700">След. запуск:</span> {post.nextRun}</span>
                    </div>
                    <div className="h-3 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>{getRecurrenceLabel()}</span>
                    </div>
                </div>
            </div>

            {/* AI КОНФИГУРАЦИЯ */}
            <div className="px-4 py-3 space-y-3 bg-white">
                {/* Системная роль */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Системная роль</p>
                    </div>
                    <div className="text-xs text-gray-600 italic leading-snug line-clamp-2 pl-2 border-l-2 border-indigo-200">
                        {post.systemPrompt}
                    </div>
                </div>

                {/* Задача (Prompt) */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Задача (Prompt)</p>
                    <div className="text-xs text-gray-800 font-medium leading-snug line-clamp-3">
                        {post.userPrompt}
                    </div>
                </div>
            </div>
            
            {/* РЕЗУЛЬТАТ */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ориентировочный результат генерации</p>
                    {post.generatedText && <span className="text-[9px] text-gray-400">{post.generatedText.length} симв.</span>}
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                    {post.generatedText || <span className="italic text-gray-400">Текст еще не сгенерирован</span>}
                </p>
            </div>

            {/* МЕДИА ВЛОЖЕНИЯ */}
            {hasMedia ? (
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Медиа вложения</p>
                        <div className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {post.mediaMode === 'all' 
                                ? `Все (${post.images.length})` 
                                : `Часть: ${post.mediaCount} шт. (${post.mediaType === 'order' ? 'По порядку' : 'Случайно'})`
                            }
                        </div>
                    </div>
                    
                    <div className="w-full flex gap-2">
                        {post.images.slice(0, 4).map((img, index) => {
                            const isLast = index === 3;
                            const showOverlay = isLast && post.images.length > 4;
                            const remainingCount = post.images.length - 3;

                            return (
                                <div key={index} className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 group">
                                    <img src={img} className="w-full h-full object-cover" alt="media" />
                                    {showOverlay && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">+{remainingCount}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <p className="text-[10px] text-gray-400 italic text-center">Медиа вложения отсутствуют</p>
                </div>
            )}

            {/* ФУТЕР */}
            <div className="flex justify-end p-3 border-t border-gray-200 gap-2 bg-gray-50 rounded-b-lg flex-shrink-0 mt-auto">
                {onEdit && (
                    <button 
                        onClick={onEdit}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-3 py-1.5 rounded hover:bg-white transition-colors flex items-center gap-1 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                        Изменить
                    </button>
                )}
                {onDelete && (
                    <button 
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors border border-transparent"
                    >
                        Удалить
                    </button>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// КОМПОНЕНТ: Список AI-постов
// =====================================================================

interface MockAiPostsListProps {
    onCreateClick?: () => void;
    onEditClick?: (postId: string) => void;
}

export const MockAiPostsList: React.FC<MockAiPostsListProps> = ({ onCreateClick, onEditClick }) => {
    const [posts] = useState(mockAiPosts);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* HEADER */}
            <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm flex-shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-indigo-900">AI Автопубликация</h2>
                    <p className="text-xs text-indigo-700">Циклические посты с автоматической генерацией контента</p>
                </div>
                <button 
                    onClick={onCreateClick}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Создать автоматизацию
                </button>
            </header>

            {/* CONTENT */}
            <main className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {posts.map(post => (
                        <MockAiPostCard 
                            key={post.id}
                            post={post}
                            onEdit={() => onEditClick?.(post.id)}
                            onDelete={() => {}}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

// =====================================================================
// КОМПОНЕНТ: Превью AI-поста в календаре
// =====================================================================

interface MockAiPostPreviewProps {
    onClose?: () => void;
    onNavigateToSettings?: () => void;
}

export const MockAiPostPreview: React.FC<MockAiPostPreviewProps> = ({ onClose, onNavigateToSettings }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0 bg-indigo-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">AI Авто-публикация</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            Это <strong>системный циклический AI-пост</strong>. Его контент генерируется автоматически перед каждой публикацией.
                            <br/><br/>
                            Текущий текст в базе является заглушкой или результатом предыдущей генерации. Новый текст будет создан в момент публикации.
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4 bg-white relative">
                            <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-gray-300">Превью (Пример)</span>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                🍝 Карбонара — классика итальянской кухни! 😋{'\n\n'}
                                Нежная паста с беконом, яйцом и сыром пармезан. Готовится по традиционному рецепту.{'\n\n'}
                                💰 Цена: 450 ₽{'\n'}
                                📍 Закажи прямо сейчас!
                            </p>
                        </div>

                        <div className="text-xs text-gray-400">
                            Запланировано на: 20 февраля 2026 г., 12:00
                        </div>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Закрыть
                    </button>
                    <button 
                        onClick={onNavigateToSettings} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Настроить автоматизацию
                    </button>
                </footer>
            </div>
        </div>
    );
};

// =====================================================================
// КОМПОНЕНТ: Упрощённый редактор AI-поста
// =====================================================================

export const MockAiPostEditor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'settings' | 'ai'>('settings');

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm flex-shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-indigo-900">Создание Автоматического AI-поста</h2>
                    <p className="text-xs text-indigo-700">Настройте и протестируйте шаблон для циклической генерации контента.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">Отмена</button>
                    <button className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center shadow-sm">
                        Запустить автоматизацию
                    </button>
                </div>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden h-full min-h-0">
                {/* ЛЕВАЯ КОЛОНКА: Настройки */}
                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 min-w-0 h-full">
                    
                    {/* 1. Основные настройки */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">1. Основные настройки</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Название автоматизации <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value="Посты про меню"
                                    readOnly
                                    placeholder="Например: Посты про меню" 
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (для себя)</label>
                                <input 
                                    type="text" 
                                    value="Автоматическая публикация блюд из меню"
                                    readOnly
                                    placeholder="Краткое описание назначения"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. Расписание */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">2. Расписание</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата первого запуска</label>
                                    <input type="text" value="20.02.2026" readOnly className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
                                    <input type="text" value="12:00" readOnly className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Цикличность</label>
                                <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                                    <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">Минуты</button>
                                    <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">Часы</button>
                                    <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white shadow text-indigo-700 ring-1 ring-black/5">Дни</button>
                                    <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">Недели</button>
                                    <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">Месяцы</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Интервал повторения</label>
                                <input type="number" value="2" readOnly className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                                <p className="text-xs text-gray-500 mt-1">Каждые 2 дня</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Условия завершения */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">3. Условия завершения</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                                <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white shadow text-indigo-700 ring-1 ring-black/5">Бесконечно</button>
                                <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">По количеству</button>
                                <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">По дате</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ПРАВАЯ КОЛОНКА: AI-генератор */}
                <div className="flex flex-col bg-indigo-50 border border-indigo-200 rounded-lg p-4 overflow-hidden h-full">
                    <h3 className="text-base font-bold text-indigo-900 uppercase tracking-wider mb-3">4. AI-генератор текста</h3>
                    
                    {/* Упрощённый интерфейс AI */}
                    <div className="flex-1 bg-white rounded-lg border border-indigo-200 p-4 flex flex-col">
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Системная роль</label>
                            <textarea 
                                value="Ты — копирайтер ресторана. Пиши аппетитные описания блюд."
                                readOnly
                                rows={2}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Задача (Prompt)</label>
                            <textarea 
                                value="Создай пост про блюдо из меню с эмоджи и призывом к действию"
                                readOnly
                                rows={2}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                            />
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-md p-3 border border-gray-200 overflow-y-auto custom-scrollbar">
                            <p className="text-xs text-gray-500 mb-2">Результат генерации:</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                🍝 Карбонара — классика итальянской кухни! 😋{'\n\n'}
                                Нежная паста с беконом, яйцом и сыром пармезан. Готовится по традиционному рецепту.{'\n\n'}
                                💰 Цена: 450 ₽{'\n'}
                                📍 Закажи прямо сейчас!
                            </p>
                        </div>

                        <button className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 w-full">
                            Сгенерировать
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
