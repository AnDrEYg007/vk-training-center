import React, { useState, DragEvent } from 'react';
import { MockPostCard, ActionIcon, StatusTable } from './PostCardMocks';
import { NavigationButtons } from './shared';

// =====================================================================
// Интерактивная песочница (компонент-демо)
// =====================================================================
const InteractiveDemo = () => {
    // Определяем тип для наших демо-постов
    interface DemoPost {
        id: string;
        column: 'mon' | 'tue' | 'wed';
        time: string;
        text: string;
        imagesCount: number;
    }

    // Состояние для постов: массив, чтобы можно было добавлять копии
    const [posts, setPosts] = useState<DemoPost[]>([
        { 
            id: 'demo-post-1', 
            column: 'mon', 
            time: '11:00', 
            text: 'Это длинный текст поста, который изначально свернут для экономии места. В реальном приложении здесь может быть ваш рекламный текст, анонс или любая другая информация. Кликните на этот абзац, и он плавно развернется, чтобы показать все содержимое. Повторный клик снова свернет его. Эта механика позволяет держать календарь чистым и организованным, даже если у вас очень объемные посты.', 
            imagesCount: 3 
        }
    ]);

    // Состояние для отслеживания, какой пост развернут
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    // Состояние для перетаскиваемого поста
    const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
    // Состояние для модального окна подтверждения
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        postId: string | null;
        targetColumn: 'mon' | 'tue' | 'wed' | null;
    }>({ isOpen: false, postId: null, targetColumn: null });

    // Обработчик для сворачивания/разворачивания текста
    const handleToggleExpand = (postId: string) => {
        setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    // Обработчики Drag-and-Drop
    const handleDragStart = (e: DragEvent<HTMLDivElement>, post: DemoPost) => {
        setDraggedPostId(post.id);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
        setDraggedPostId(null);
    };
    
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumn: 'mon' | 'tue' | 'wed') => {
        e.preventDefault();
        const draggedPost = posts.find(p => p.id === draggedPostId);
        if (draggedPost && draggedPost.column !== targetColumn) {
            setConfirmModalState({ isOpen: true, postId: draggedPostId, targetColumn });
        }
    };

    // Обработчики модального окна
    const handleConfirmAction = (isCopy: boolean) => {
        const { postId, targetColumn } = confirmModalState;
        if (!postId || !targetColumn) return;

        if (isCopy) {
            const originalPost = posts.find(p => p.id === postId);
            if (originalPost) {
                const newPost: DemoPost = {
                    ...originalPost,
                    id: `demo-post-${Date.now()}`,
                    column: targetColumn,
                };
                setPosts(prev => [...prev, newPost]);
            }
        } else { // Перемещение
            setPosts(prev => prev.map(p => (p.id === postId ? { ...p, column: targetColumn } : p)));
        }
        setConfirmModalState({ isOpen: false, postId: null, targetColumn: null });
    };

    const handleCancelAction = () => {
        setConfirmModalState({ isOpen: false, postId: null, targetColumn: null });
    };

    // Компоненты-заглушки для UI
    const DemoDayColumn: React.FC<{ title: string; columnId: 'mon' | 'tue' | 'wed'; children: React.ReactNode; onDrop: (e: DragEvent<HTMLDivElement>, colId: 'mon' | 'tue' | 'wed') => void }> = 
    ({ title, columnId, children, onDrop }) => (
        <div 
            className="p-3 bg-gray-50 border rounded-lg min-h-[200px] transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, columnId)}
            onDragEnter={(e) => (e.currentTarget.style.backgroundColor = '#eef2ff')}
            onDragLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
        >
            <p className="font-bold text-center text-sm text-gray-700 mb-3">{title}</p>
            <div className="space-y-2">{children}</div>
        </div>
    );
    
    const ConfirmMoveModalMock: React.FC<{ onConfirm: (isCopy: boolean) => void; onCancel: () => void; }> = ({ onConfirm, onCancel }) => (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20 rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-bold">Подтвердите действие</h2>
                <p>Переместить или скопировать пост?</p>
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button onClick={() => onConfirm(true)} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Копировать</button>
                    <button onClick={() => onConfirm(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Переместить</button>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="relative not-prose p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-12">
            {confirmModalState.isOpen && <ConfirmMoveModalMock onConfirm={handleConfirmAction} onCancel={handleCancelAction} />}
            <h4 className="text-xl font-bold text-indigo-800 mb-2">Попробуйте сами: Интерактивная песочница</h4>
            <p className="text-sm text-indigo-700 mb-4">Вы можете взаимодействовать с этими элементами так же, как и в основном интерфейсе:</p>
            <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1 mb-6">
                <li><strong>Кликните на текст поста</strong>, чтобы развернуть или свернуть его.</li>
                <li><strong>Зажмите и перетащите карточку поста</strong> на другую колонку, чтобы переместить или скопировать ее.</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DemoDayColumn title="Понедельник" columnId="mon" onDrop={handleDrop}>
                    {posts.filter(p => p.column === 'mon').map(post => (
                        <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post)} onDragEnd={handleDragEnd}>
                             <MockPostCard
                                type="vk"
                                textLength="long"
                                imagesCount={post.imagesCount}
                                onToggleExpand={() => handleToggleExpand(post.id)}
                                isExpanded={!!expandedPosts[post.id]}
                                longText={post.text}
                            />
                        </div>
                    ))}
                </DemoDayColumn>
                <DemoDayColumn title="Вторник" columnId="tue" onDrop={handleDrop}>
                     {posts.filter(p => p.column === 'tue').map(post => (
                        <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post)} onDragEnd={handleDragEnd}>
                             <MockPostCard
                                type="vk"
                                textLength="long"
                                imagesCount={post.imagesCount}
                                onToggleExpand={() => handleToggleExpand(post.id)}
                                isExpanded={!!expandedPosts[post.id]}
                                longText={post.text}
                            />
                        </div>
                    ))}
                </DemoDayColumn>
                <DemoDayColumn title="Среда" columnId="wed" onDrop={handleDrop}>
                     {posts.filter(p => p.column === 'wed').map(post => (
                        <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post)} onDragEnd={handleDragEnd}>
                             <MockPostCard
                                type="vk"
                                textLength="long"
                                imagesCount={post.imagesCount}
                                onToggleExpand={() => handleToggleExpand(post.id)}
                                isExpanded={!!expandedPosts[post.id]}
                                longText={post.text}
                            />
                        </div>
                    ))}
                </DemoDayColumn>
            </div>
        </div>
    );
};


// =====================================================================
// Основной компонент обучающей страницы
// =====================================================================

export const PostCardDeepDive: React.FC<{ title: string }> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это такое?</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Карточка поста</strong> — это основной визуальный элемент в календаре, который представляет одну единицу контента (пост). Она содержит всю ключевую информацию о посте и инструменты для взаимодействия с ним.
            </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                <figure className="text-center">
                    <MockPostCard textLength="short" />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">Карточка с текстом</figcaption>
                </figure>
                <figure className="text-center">
                    <MockPostCard textLength="short" imagesCount={1} />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">Карточка с фото</figcaption>
                </figure>
                <figure className="text-center">
                    <MockPostCard textLength="short" imagesCount={1} showActions={true} />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">Панель действий (при наведении)</figcaption>
                </figure>
            </div>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Где она находится?</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">Карточки постов располагаются в колонках дней в сетке календаря.</p>

            <hr className="!my-10" />

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как она может выглядеть и почему?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">Внешний вид карточки напрямую зависит от типа и статуса поста. Существует три основных вида:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                <div>
                    <MockPostCard type="published" imagesCount={1} textLength="short" />
                    <p className="mt-3 text-sm font-semibold text-gray-800 text-center">1. Опубликованный пост</p>
                    <blockquote className="!mt-2 !text-xs !p-3 !bg-green-50 !border-l-4 !border-green-400">
                       <p><strong>Почему так выглядит?</strong> Зеленая галочка ✅ и приглушенный фон показывают, что пост уже на стене и является частью истории.</p>
                    </blockquote>
                </div>
                 <div>
                    <MockPostCard type="vk" imagesCount={1} textLength="short" />
                    <p className="mt-3 text-sm font-semibold text-gray-800 text-center">2. Отложенный пост VK</p>
                     <blockquote className="!mt-2 !text-xs !p-3 !bg-gray-50 !border-l-4 !border-gray-400">
                       <p><strong>Почему так выглядит?</strong> Сплошная рамка без иконок — это стандартный вид для поста в отложенной очереди самого ВКонтакте.</p>
                    </blockquote>
                </div>
                 <div>
                    <MockPostCard type="system" statusIcon="🕒" imagesCount={1} textLength="short" />
                    <p className="mt-3 text-sm font-semibold text-gray-800 text-center">3. Системный пост</p>
                     <blockquote className="!mt-2 !text-xs !p-3 !bg-indigo-50 !border-l-4 !border-indigo-400">
                       <p><strong>Почему так выглядит?</strong> Пунктирная рамка и иконка статуса 🕒 говорят о том, что пост хранится в нашей системе и будет опубликован автоматически.</p>
                    </blockquote>
                </div>
            </div>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-12">Вариации в зависимости от контента</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">Карточка также адаптируется под количество медиафайлов и длину текста, чтобы информация всегда была представлена наилучшим образом.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8 not-prose">
                <figure className="text-center">
                    <MockPostCard imagesCount={1} textLength="short" />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">Одно изображение</figcaption>
                    <p className="mt-1 text-xs text-gray-600">Изображение занимает всю ширину и имеет соотношение сторон 16:9.</p>
                </figure>
                <figure className="text-center">
                    <MockPostCard imagesCount={3} textLength="short" />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">2-3 изображения</figcaption>
                    <p className="mt-1 text-xs text-gray-600">Изображения выстраиваются в сетку 2x2, занимая свободные ячейки.</p>
                </figure>
                <figure className="text-center">
                    <MockPostCard imagesCount={5} textLength="short" />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">4+ изображений</figcaption>
                    <p className="mt-1 text-xs text-gray-600">Отображаются первые три, а на последней ячейке — счетчик оставшихся.</p>
                </figure>
                <figure className="text-center">
                    <MockPostCard imagesCount={0} textLength="long" />
                    <figcaption className="mt-3 text-sm font-semibold text-gray-800">Длинный текст</figcaption>
                    <p className="mt-1 text-xs text-gray-600">Текст сворачивается, чтобы не занимать много места. Клик по нему разворачивает полное содержимое.</p>
                </figure>
            </div>

            <hr className="!my-10" />

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Жизненный цикл Системного поста</h2>
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что с ним происходит?</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">Системные посты (с пунктирной рамкой) — самые "умные". Они информируют вас о своем состоянии на каждом этапе.</p>
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Какие у него могут быть состояния?</h3>
            <StatusTable />

            <hr className="!my-10" />

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Панель действий: Ваши инструменты</h2>
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это и где находится?</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">Это набор кнопок, который появляется в правом верхнем углу карточки при наведении на нее курсора.</p>
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что содержит и что можно сделать?</h3>
            <div className="space-y-6 not-prose mt-6">
                 <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} 
                    label="Опубликовать сейчас"
                    description="Немедленно публикует пост на стену, игнорируя запланированное время. Недоступна для уже опубликованных постов и пустых постов (без текста и медиа)."
                />
                 <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                    label="Перенести в отложку VK"
                    description="Превращает 'Системный пост' в 'Отложенный пост VK'. Появится в отложенных в интерфейсе VK, но потеряет все преимущества системного. Доступно только для постов в статусе 'Ожидает' 🕒."
                />
                 <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} 
                    label="Копировать"
                    description="Открывает модальное окно для создания нового поста, предзаполнив его содержимым из текущего. Идеально для создания постов по шаблону."
                />
                 <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>}
                    label="Редактировать"
                    description="Открывает модальное окно для изменения содержимого поста. Заблокировано для системных постов в процессе публикации ⚙️."
                />
                <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} 
                    label="Удалить"
                    description="Запускает процесс удаления поста. Система запросит подтверждение. Заблокировано для системных постов в процессе публикации ⚙️."
                />
                <ActionIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>} 
                    label="Посмотреть на VK"
                    description="Открывает пост в новой вкладке на сайте ВКонтакте. Доступно только для опубликованных и отложенных в VK постов."
                />
            </div>
            
            <hr className="!my-10" />

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как с этим лучше работать?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Ключевые механики и советы</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Сворачивание текста:</strong> Если текст поста длинный, кликните по нему, чтобы плавно развернуть и прочитать полностью. Повторный клик свернет текст обратно.</li>
                <li><strong>Drag-and-Drop:</strong>
                    <ul>
                        <li>Перетаскивание <strong>запланированного</strong> поста (любого типа) на другую дату — это <strong>перемещение</strong>.</li>
                        <li>Перетаскивание <strong>опубликованного</strong> поста (с ✅) на другую дату — это всегда <strong>копирование</strong>.</li>
                    </ul>
                </li>
            </ul>
            
            {/* ИНТЕРАКТИВНОЕ ДЕМО */}
            <InteractiveDemo />

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Ограничения</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Нельзя редактировать публикующийся пост:</strong> Когда системный пост имеет статус "Публикуется" ⚙️, его нельзя редактировать или удалять, чтобы избежать конфликтов.</li>
                <li><strong>Нельзя изменить дату опубликованного поста:</strong> У поста, который уже на стене, можно изменить только контент, но не дату.</li>
                <li><strong>Нельзя опубликовать пустой пост:</strong> Кнопка "Опубликовать сейчас" неактивна, если в посте нет ни текста, ни медиафайлов.</li>
            </ul>

            <NavigationButtons currentPath="2-1-4-6-postcard-deep-dive" />
        </article>
    );
};