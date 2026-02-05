import React, { useState } from 'react';
import { ContentProps } from '../shared';
import { Sandbox } from '../SharedComponents';

// =====================================================================
// Основной компонент: Обзор вкладки "Отложенные" (Календарь)
// =====================================================================
export const ScheduleTabOverview: React.FC<ContentProps> = ({ title }) => {
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
    const [noteVisibility, setNoteVisibility] = useState<'expanded' | 'collapsed' | 'hidden'>('expanded');

    // Mock данные для демо
    const weekDays = ['Пн 03.02', 'Вт 04.02', 'Ср 05.02', 'Чт 06.02', 'Пт 07.02', 'Сб 08.02', 'Вс 09.02'];
    
    const mockPosts = {
        1: [
            { id: 'p1', time: '14:30', text: 'Новое поступление товаров! 🎉', type: 'scheduled', image: true },
        ],
        2: [
            { id: 'p2', time: '10:00', text: 'Утренний пост', type: 'published' },
            { id: 'p3', time: '18:00', text: 'Вечерний пост', type: 'scheduled', image: true },
        ],
        3: [
            { id: 'p6', time: '15:00', text: 'Обычный циклический пост (каждый день в 15:00)', type: 'system', isCyclic: true },
            { id: 'p7', time: '20:00', text: 'Конкурс: "Лучший отзыв месяца"', type: 'system', automationType: 'contest_winner' },
        ],
        4: [
            { id: 'p4', time: '12:00', text: 'AI-пост о новом продукте', type: 'system', isAi: true },
            { id: 'p5', time: '12:30', text: 'AI-пост о новом продукте (призрак)', type: 'system', isAi: true, isGhost: true },
        ],
        5: [
            { id: 'p8', time: '11:00', text: 'СТАРТ: Универсальный конкурс репостов', type: 'system', automationType: 'general_contest_start' },
        ],
        6: [
            { id: 'p9', time: '19:00', text: 'ИТОГИ: Объявление победителей конкурса', type: 'system', automationType: 'general_contest_end' },
        ],
    };

    const mockNotes = {
        0: [{ id: 'n1', time: '09:00', title: 'Напоминание', color: 'yellow' }],
        3: [{ id: 'n2', time: '15:00', title: 'Важно!', color: 'red' }],
    };

    const cycleNoteVisibility = () => {
        setNoteVisibility(prev => {
            if (prev === 'expanded') return 'collapsed';
            if (prev === 'collapsed') return 'hidden';
            return 'expanded';
        });
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Вкладка "Отложенные"</strong> — это календарь, где ты видишь все запланированные и уже опубликованные посты 
                для выбранного сообщества. Здесь ты создаёшь черновики, планируешь публикации, работаешь с автоматизациями 
                и оставляешь напоминания через заметки.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Вся работа с контентом сосредоточена в одном календаре. 
                    Выбрал проект слева → видишь все посты на неделю → кликнул на пост → редактируешь или публикуешь. 
                    Больше не нужно заходить в каждое сообщество VK отдельно.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Что ты увидишь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что ты увидишь в календаре?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Календарь показывает текущую неделю (7 дней). Каждый день — это колонка, внутри которой 
                отображаются посты и заметки, отсортированные по времени публикации.
            </p>

            <Sandbox 
                title="Демо: Календарь на неделю" 
                description="Наведи курсор на день — название дня станет темнее. Попробуй изменить видимость заметок."
                instructions={[
                    '<strong>Наведи</strong> на день — название станет темнее',
                    '<strong>Нажми</strong> на кнопку переключения заметок — увидишь 3 режима отображения',
                    'Посмотри на <strong>цвета карточек</strong> — белые (обычные), фиолетовые (конкурсы), голубые (старт), оранжевые (итоги), синие (AI)',
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    {/* Кнопка переключения заметок */}
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Видимость заметок:</span>
                        <button
                            onClick={cycleNoteVisibility}
                            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 font-medium transition-colors"
                        >
                            {noteVisibility === 'expanded' && 'Развёрнутые →'}
                            {noteVisibility === 'collapsed' && 'Свёрнутые →'}
                            {noteVisibility === 'hidden' && 'Скрытые →'}
                        </button>
                    </div>

                    {/* Сетка календаря */}
                    <div className="grid grid-cols-7 gap-3">
                        {weekDays.map((day, index) => {
                            const isToday = index === 1; // Вторник = сегодня для примера
                            const dayPosts = mockPosts[index as keyof typeof mockPosts] || [];
                            const dayNotes = mockNotes[index as keyof typeof mockNotes] || [];
                            
                            return (
                                <div 
                                    key={index} 
                                    className="flex flex-col"
                                    onMouseEnter={() => setActiveDay(index)}
                                    onMouseLeave={() => setActiveDay(null)}
                                >
                                    {/* Заголовок дня */}
                                    <div className={`border-t-4 ${isToday ? 'border-indigo-500' : 'border-transparent'} mb-2`}>
                                        <div className="text-center">
                                            <p className={`font-bold text-sm ${isToday ? 'text-indigo-600' : activeDay === index ? 'text-gray-800' : 'text-gray-600'} transition-colors`}>
                                                {day.split(' ')[0]}
                                            </p>
                                            <p className={`text-xs ${isToday ? 'text-indigo-500 font-semibold' : 'text-gray-500'}`}>
                                                {day.split(' ')[1]}
                                            </p>
                                        </div>
                                        {/* Кнопка создания поста */}
                                        <button 
                                            className="w-full flex justify-center items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors mt-2"
                                            title="Создать пост"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>

                                    {/* Контент дня */}
                                    <div className="space-y-2 min-h-[200px]">
                                        {/* Заметки */}
                                        {noteVisibility !== 'hidden' && dayNotes.map(note => (
                                            <div 
                                                key={note.id} 
                                                className={`p-1.5 rounded-md border text-xs ${
                                                    note.color === 'yellow' ? 'bg-amber-100 border-amber-200 text-amber-800' : 
                                                    'bg-red-100 border-red-200 text-red-800'
                                                }`}
                                            >
                                                {noteVisibility === 'expanded' && (
                                                    <div>
                                                        <p className="font-semibold">{note.time}</p>
                                                        <p className="font-medium mt-0.5">{note.title}</p>
                                                    </div>
                                                )}
                                                {noteVisibility === 'collapsed' && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">{note.time}</p>
                                                        <p className="truncate text-xs ml-1">{note.title}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Посты */}
                                        {dayPosts.map(post => {
                                            let bgClass = 'bg-white border-gray-200';
                                            let borderClass = 'border';
                                            
                                            if (post.type === 'published') {
                                                bgClass = 'bg-white border-gray-200';
                                            } else if (post.type === 'system') {
                                                // Разные цвета для разных типов автоматизаций
                                                if (post.automationType === 'contest_winner') {
                                                    bgClass = post.isGhost ? 'bg-fuchsia-50/20 opacity-70' : 'bg-fuchsia-50/40';
                                                    borderClass = post.isGhost ? 'border border-fuchsia-200 border-dashed' : 'border border-fuchsia-300';
                                                } else if (post.automationType === 'general_contest_start') {
                                                    bgClass = post.isGhost ? 'bg-sky-50/20 opacity-70' : 'bg-sky-50/40';
                                                    borderClass = post.isGhost ? 'border border-sky-200 border-dashed' : 'border border-sky-300';
                                                } else if (post.automationType === 'general_contest_end') {
                                                    bgClass = post.isGhost ? 'bg-orange-50/20 opacity-70' : 'bg-orange-50/40';
                                                    borderClass = post.isGhost ? 'border border-orange-200 border-dashed' : 'border border-orange-300';
                                                } else if (post.isAi) {
                                                    bgClass = post.isGhost ? 'bg-indigo-50/20 opacity-70' : 'bg-indigo-50/40';
                                                    borderClass = post.isGhost ? 'border border-indigo-200 border-dashed' : 'border border-indigo-300';
                                                } else {
                                                    // Обычные системные/циклические посты
                                                    bgClass = post.isGhost ? 'bg-indigo-50/20 opacity-70' : 'bg-indigo-50/40';
                                                    borderClass = post.isGhost ? 'border border-indigo-200 border-dashed' : 'border border-indigo-300';
                                                }
                                            }
                                            
                                            return (
                                                <div 
                                                    key={post.id}
                                                    className={`p-2.5 rounded-lg ${borderClass} ${bgClass} shadow-sm hover:shadow-md transition-all cursor-pointer relative`}
                                                    title={post.isGhost ? 'Призрачный пост (будущая публикация)' : post.type === 'system' ? 'Автоматическая публикация' : undefined}
                                                >
                                                    {/* Иконка цикличности для обычных системных постов */}
                                                    {post.type === 'system' && post.isCyclic && !post.isGhost && (
                                                        <div className="absolute top-[-8px] right-[-8px] bg-indigo-100 text-indigo-600 rounded-full p-1 border border-indigo-200 shadow-sm" title="Циклическая публикация">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Бейдж для конкурса отзывов */}
                                                    {post.automationType === 'contest_winner' && !post.isGhost && (
                                                        <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1">
                                                            <div className="bg-fuchsia-100 text-fuchsia-700 rounded-full px-1.5 py-0.5 border border-fuchsia-200 shadow-sm flex items-center gap-1" title="Конкурс отзывов">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Бейдж для старта универсального конкурса */}
                                                    {post.automationType === 'general_contest_start' && !post.isGhost && (
                                                        <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1">
                                                            <div className="bg-sky-100 text-sky-700 rounded-full px-1.5 py-0.5 border border-sky-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Старт">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-[9px] font-bold uppercase tracking-wider">Старт</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Бейдж для итогов универсального конкурса */}
                                                    {post.automationType === 'general_contest_end' && !post.isGhost && (
                                                        <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1">
                                                            <div className="bg-orange-100 text-orange-700 rounded-full px-1.5 py-0.5 border border-orange-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Итоги">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-[9px] font-bold uppercase tracking-wider">Итоги</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Бейдж для AI автоматизации */}
                                                    {post.isAi && !post.isGhost && (
                                                        <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1">
                                                            <div className="bg-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 border border-indigo-200 shadow-sm flex items-center gap-1" title="Автоматическая AI генерация">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-[9px] font-bold uppercase tracking-wider">AI Auto</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <p className="text-xs font-semibold text-gray-600 mb-1">{post.time}</p>
                                                    {post.image && (
                                                        <div className="aspect-video bg-gray-200 rounded mb-1">
                                                            <img 
                                                                src={`https://picsum.photos/seed/${post.id}/200/113`} 
                                                                alt="" 
                                                                className="w-full h-full object-cover rounded" 
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-700 line-clamp-2">{post.text}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Типы контента */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типы контента в календаре</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В календаре одновременно отображаются несколько типов контента:
            </p>

            <div className="not-prose space-y-4 my-6">
                {/* Отложенные посты */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <h3 className="font-bold text-blue-900 mb-2">Отложенные посты</h3>
                    <p className="text-sm text-gray-700">
                        Посты, которые ты создал как черновики и отправил в VK в отложку. 
                        Они автоматически опубликуются в указанное время. Белая карточка с обычной рамкой.
                    </p>
                </div>

                {/* Опубликованные посты */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <h3 className="font-bold text-green-900 mb-2">Опубликованные посты</h3>
                    <p className="text-sm text-gray-700">
                        Посты, которые уже вышли на стене сообщества. Показываются для контекста — 
                        чтобы ты видел полную картину расписания. Можно копировать и удалять, но нельзя редактировать.
                    </p>
                </div>

                {/* Системные посты */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50">
                    <h3 className="font-bold text-indigo-900 mb-2">Системные посты (автоматизации)</h3>
                    <p className="text-sm text-gray-700">
                        Посты, созданные через автоматизации: AI-генерация, конкурсы, циклические публикации. 
                        У разных типов автоматизаций <strong>разные цвета фона</strong>: фиолетовый — конкурс отзывов, 
                        голубой — старт универсального конкурса, оранжевый — итоги конкурса, синий — AI-генерация и обычные циклические публикации. 
                        Для циклических постов показываются <strong>призрачные копии</strong> — 
                        это будущие повторяющиеся публикации (полупрозрачные, пунктирная рамка).
                    </p>
                </div>

                {/* Заметки */}
                <div className="border-l-4 border-yellow-400 pl-4 py-3 bg-yellow-50">
                    <h3 className="font-bold text-yellow-900 mb-2">Заметки</h3>
                    <p className="text-sm text-gray-700">
                        Цветные напоминания для себя или команды. Не публикуются в VK, видны только внутри приложения. 
                        Можно выбрать один из 7 цветов (красный, янтарный, зелёный, голубой, индиго, фиолетовый, розовый), добавить заголовок и текст.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Основные действия */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что можно делать в календаре?</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <h3 className="font-bold text-gray-800">Создавать посты</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Нажми на кнопку <strong>+</strong> в любом дне → откроется окно создания поста → 
                        добавляешь текст, картинки, теги → сохраняешь как черновик → отправляешь в VK как отложенный.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <h3 className="font-bold text-gray-800">Редактировать черновики</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Кликни на любой отложенный пост → откроется полный редактор → 
                        меняешь текст, время, картинки → сохраняешь → изменения сразу отправляются в VK.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <h3 className="font-bold text-gray-800">Копировать посты</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Нужно опубликовать один пост в 10 проектах? Кликни на пост → 
                        "Копировать" → выбери проекты из списка → система создаст копии во всех выбранных сообществах.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                        <h3 className="font-bold text-gray-800">Перетаскивать (drag-and-drop)</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Зажми пост → перетащи на другой день → отпусти → откроется окно подтверждения → 
                        выбери новое время → включи <strong>тумблер "Копировать пост"</strong> если нужна копия (или оставь выключенным для переноса) → 
                        если копируешь, выбери куда: "В систему" или "В VK" → готово!
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Навигация по подразделам */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура раздела</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Этот раздел подробно описывает все элементы календаря:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.1. Сайдбар проектов</h3>
                    <p className="text-sm text-gray-700">
                        Как работает список проектов слева: фильтры, поиск, счётчики постов, индикаторы состояния.
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.2. Шапка календаря</h3>
                    <p className="text-sm text-gray-700">
                        Навигация по датам (стрелки, "Сегодня"), кнопка обновления, режимы отображения, массовые действия.
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.3. Сетка календаря</h3>
                    <p className="text-sm text-gray-700">
                        Как устроены дневные колонки, drag-and-drop, быстрое создание заметок двойным кликом.
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.4. Посты в календаре</h3>
                    <p className="text-sm text-gray-700">
                        Детальный разбор трёх типов постов (отложенные, опубликованные, системные), 
                        жизненный цикл системного поста, призрачные посты, карточка поста.
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.5. Заметки</h3>
                    <p className="text-sm text-gray-700">
                        Создание, редактирование, цветовая палитра, три режима отображения (развёрнутые, свёрнутые, скрытые).
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1.6. Истории (Stories)</h3>
                    <p className="text-sm text-gray-700">
                        Как отображаются истории в календаре, статистика просмотров, публикация историй.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Совет:</strong> Начни с раздела <strong>2.1.4. Посты в календаре</strong> — 
                    там подробно разобраны все типы постов и их отличия. Это поможет понять логику работы календаря.
                </p>
            </div>
        </article>
    );
};
