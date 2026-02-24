import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    MockSuggestedPostCard, 
    MockAiEditor, 
    MockEmptyState,
    MockAlertBox
} from './SuggestedPostsMocks';

// =====================================================================
// Основной компонент: Обзор вкладки "Предложенные"
// =====================================================================
export const SuggestedPostsOverview: React.FC<ContentProps> = ({ title }) => {
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [aiText, setAiText] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [showPermissionError, setShowPermissionError] = useState(false);

    // Тестовые данные предложенных постов
    const mockPosts = [
        {
            id: 1,
            author: 'Иван Петров',
            date: '15 фев 2025',
            text: 'Привет! Хочу поделится фотографиями с вашего мероприятия. Было очень круто, спасибо организаторам!',
            link: 'https://vk.com/wall-12345_678',
            images: [
                'https://picsum.photos/seed/suggested1a/200/200',
                'https://picsum.photos/seed/suggested1b/200/200',
                'https://picsum.photos/seed/suggested1c/200/200'
            ]
        },
        {
            id: 2,
            author: 'Мария Сидорова',
            date: '14 фев 2025',
            text: 'Ваш магазин лучший! заказываю уже 3 раз все приходит быстро качество супер!!!',
            link: 'https://vk.com/wall-12345_679',
            images: [
                'https://picsum.photos/seed/suggested2a/200/200'
            ]
        },
        {
            id: 3,
            author: 'Алексей Смирнов',
            date: '13 фев 2025',
            text: 'Когда будет новая акция? Хочу купить ваш продукт со скидкой',
            link: 'https://vk.com/wall-12345_680',
            images: []
        }
    ];

    const handleSelectPost = (postId: number) => {
        setSelectedPostId(postId);
        setIsAiLoading(true);
        
        // Имитация работы AI
        setTimeout(() => {
            const post = mockPosts.find(p => p.id === postId);
            if (post) {
                // Симуляция исправленного текста
                const correctedText = post.text
                    .replace(/привет/i, 'Привет')
                    .replace(/поделится/i, 'поделиться')
                    .replace(/заказываю/i, 'Заказываю')
                    .replace(/приходит/i, 'приходит,')
                    .replace(/супер!!!/i, 'супер! 🎉')
                    + '\n\n#ВашХештег';
                setAiText(correctedText);
            }
            setIsAiLoading(false);
        }, 1500);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка <strong>"Предложенные"</strong> — это место, где собираются посты, которые предложили 
                участники сообщества (предложка). Здесь модератор может просмотреть каждый пост, исправить 
                текст с помощью AI-редактора и решить, публиковать его или отклонить.
            </p>

            <div className="not-prose bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-purple-900">
                    <strong>Зачем это нужно:</strong> Раньше приходилось заходить в каждое сообщество VK отдельно, 
                    вручную исправлять ошибки в каждом предложенном посте (опечатки, капс, отсутствие хештегов). 
                    Теперь все предложенные посты из всех проектов в одном месте + AI автоматически исправляет текст — 
                    экономия времени в 5-10 раз.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Раздел 1: Как выглядит вкладка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит вкладка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс вкладки состоит из следующих элементов:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 !list-disc !pl-6 !space-y-2">
                <li><strong>Шапка</strong> с заголовком "Предложенные посты", именем проекта и кнопкой обновления</li>
                <li><strong>Список карточек</strong> предложенных постов (отображаются в виде сетки)</li>
                <li><strong>AI-редактор</strong> (появляется справа при выборе поста для двухколоночного режима)</li>
            </ul>

            <Sandbox
                title="Шапка вкладки с кнопкой обновления"
                description="В верхней части вкладки отображается название 'Предложенные посты', имя текущего проекта и кнопка обновления списка."
                instructions={[
                    'Обратите внимание на кнопку с иконкой обновления — она перезагружает список постов из VK'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Предложенные посты</h2>
                            <p className="text-sm text-gray-500">Тестовое сообщество</p>
                        </div>
                        <button className="inline-flex items-center border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                            </svg>
                            Обновить
                        </button>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 2: Карточка предложенного поста */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Карточка предложенного поста</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый предложенный пост отображается в виде карточки. Карточка содержит:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 !list-disc !pl-6 !space-y-2">
                <li><strong>Ленту изображений</strong> (если пост содержит фотографии) — горизонтальная полоса с превью 96×96 пикселей</li>
                <li><strong>Название сообщества</strong> (кликабельная ссылка на страницу сообщества)</li>
                <li><strong>Дату публикации</strong> предложки</li>
                <li><strong>Текст поста</strong> как он был отправлен автором</li>
                <li><strong>Ссылку "Посмотреть на VK"</strong> с иконкой внешней ссылки</li>
                <li><strong>Кнопку "Редактор AI"</strong> с иконкой лампочки</li>
            </ul>

            <Sandbox
                title="Пример карточки предложенного поста"
                description="Карточка показывает превью изображений, информацию об авторе, текст и кнопку для запуска AI-редактора."
                instructions={[
                    'Нажмите на карточку или кнопку <strong>"Редактор AI"</strong> — появится двухколоночный режим с редактором справа',
                    'Обратите внимание: выбранная карточка получает синюю обводку и тень'
                ]}
            >
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="max-w-md">
                        <MockSuggestedPostCard
                            post={mockPosts[0]}
                            isSelected={selectedPostId === mockPosts[0].id}
                            onSelect={() => handleSelectPost(mockPosts[0].id)}
                        />
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 3: AI-редактор */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">AI-редактор предложки</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда выбираешь пост (кликаешь на карточку или кнопку "Редактор AI"), справа появляется панель 
                AI-редактора. Система автоматически отправляет текст поста в AI, который:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 !list-disc !pl-6 !space-y-2">
                <li>Исправляет грамматические и пунктуационные ошибки</li>
                <li>Убирает капс (БОЛЬШИЕ БУКВЫ)</li>
                <li>Добавляет хештеги проекта</li>
                <li>Добавляет благодарность автору (если нужно)</li>
                <li>Форматирует текст для публикации</li>
            </ul>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>Экономия времени:</strong> Раньше на исправление одного предложенного поста 
                    уходило 2-3 минуты вручную. AI делает это за 3-5 секунд. При 20 предложках в день — 
                    экономия ~40 минут.
                </p>
            </div>

            <Sandbox
                title="Двухколоночный режим: карточка + AI-редактор"
                description="Когда пост выбран, интерфейс разделяется на две колонки: слева карточка поста, справа панель AI-редактора."
                instructions={[
                    'Нажмите на любую карточку слева — появится AI-редактор справа',
                    'Обратите внимание на индикатор загрузки во время работы AI',
                    'После генерации текст можно редактировать вручную в поле ввода',
                    'Кнопка <strong>"Копировать"</strong> становится зелёной, а после копирования — бирюзовой с текстом "Скопировано!"'
                ]}
            >
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex gap-4">
                        {/* Левая колонка: список карточек */}
                        <div className="flex-1 space-y-4">
                            {mockPosts.map((post) => (
                                <div key={post.id} className={selectedPostId === post.id ? '' : 'max-w-[calc(50%-0.5rem)]'}>
                                    <MockSuggestedPostCard
                                        post={post}
                                        isSelected={selectedPostId === post.id}
                                        onSelect={() => handleSelectPost(post.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Правая колонка: AI-редактор */}
                        {selectedPostId && (
                            <div className="flex-1">
                                <MockAiEditor
                                    text={aiText}
                                    isLoading={isAiLoading}
                                    onTextChange={setAiText}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 4: Различные состояния интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Различные состояния интерфейса</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Предложенные" может находиться в разных состояниях в зависимости от ситуации:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Нет предложенных постов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Если в сообществе пока нет новых предложенных постов, отображается информационное сообщение 
                с синим фоном и иконкой информации.
            </p>

            <Sandbox
                title="Состояние: пусто"
                description="Когда в сообществе нет предложенных постов для модерации."
                instructions={[
                    'Нажмите на кнопку ниже, чтобы увидеть как выглядит пустое состояние'
                ]}
            >
                <div className="bg-gray-50 p-4 rounded-lg">
                    <button
                        onClick={() => setShowEmptyState(!showEmptyState)}
                        className="mb-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        {showEmptyState ? 'Скрыть' : 'Показать пустое состояние'}
                    </button>
                    
                    {showEmptyState ? (
                        <MockAlertBox
                            type="info"
                            title="Пока нет предложенных постов"
                            message="Когда участники сообщества отправят предложенные посты, они появятся здесь. Нажмите 'Обновить' для проверки."
                        />
                    ) : (
                        <p className="text-sm text-gray-500 italic">Нажмите кнопку выше</p>
                    )}
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Ошибка прав доступа</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Если у токена проекта нет прав на просмотр предложенных постов, отображается предупреждающее 
                сообщение с жёлто-оранжевым фоном и иконкой предупреждения.
            </p>

            <Sandbox
                title="Состояние: ошибка прав"
                description="Когда токен VK не имеет прав на получение предложенных постов."
                instructions={[
                    'Нажмите на кнопку ниже, чтобы увидеть как выглядит ошибка прав доступа'
                ]}
            >
                <div className="bg-gray-50 p-4 rounded-lg">
                    <button
                        onClick={() => setShowPermissionError(!showPermissionError)}
                        className="mb-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        {showPermissionError ? 'Скрыть' : 'Показать ошибку прав'}
                    </button>
                    
                    {showPermissionError ? (
                        <MockAlertBox
                            type="warning"
                            title="Ошибка получения предложенных постов"
                            message="Недостаточно прав для получения предложенных постов. Проверьте настройки токена в разделе Настройки → Токены."
                        />
                    ) : (
                        <p className="text-sm text-gray-500 italic">Нажмите кнопку выше</p>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 5: Типичный рабочий процесс */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типичный рабочий процесс</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот как обычно работает SMM-специалист с предложенными постами:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Заходит во вкладку "Предложенные"</h4>
                        <p className="text-sm text-gray-600">Выбирает проект в сайдбаре, переключается на вкладку "Предложенные"</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Просматривает карточки постов</h4>
                        <p className="text-sm text-gray-600">Быстро сканирует текст, фотографии, смотрит кто автор</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Нажимает "Редактор AI"</h4>
                        <p className="text-sm text-gray-600">AI автоматически исправляет текст (3-5 секунд)</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Проверяет и редактирует при необходимости</h4>
                        <p className="text-sm text-gray-600">Может вручную подправить текст в редакторе</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Копирует исправленный текст</h4>
                        <p className="text-sm text-gray-600">Нажимает "Копировать" и идёт в VK публиковать</p>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-amber-900">
                    <strong>В будущих версиях:</strong> Планируется добавить кнопки "Принять" и "Отклонить" 
                    прямо в карточке, чтобы можно было модерировать посты не выходя из планировщика. 
                    Также добавится возможность сразу планировать предложенный пост в календарь отложенных.
                </p>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-2-suggested" />
        </article>
    );
};
