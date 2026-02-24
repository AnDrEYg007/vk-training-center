import React, { useState } from 'react';

// =====================================================================
// Mock-компоненты для раздела «Истории (Stories)»
// =====================================================================

// Типы для историй
interface MockStory {
    id: number;
    type: 'photo' | 'video';
    preview: string;
    date: string;
}

// =====================================================================
// MockStoriesRow — горизонтальная строка круглых аватарок историй
// =====================================================================
interface MockStoriesRowProps {
    stories: MockStory[];
    onStoryClick?: (index: number) => void;
}

export const MockStoriesRow: React.FC<MockStoriesRowProps> = ({ stories, onStoryClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (stories.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2 mb-4">
            {stories.map((story, index) => (
                <div
                    key={story.id}
                    className={`relative flex-shrink-0 transition-all duration-200 ${
                        hoveredIndex === index ? 'scale-110 z-10' : 'z-0'
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onStoryClick?.(index)}
                >
                    {/* Круглая аватарка истории */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer bg-gray-100">
                        {story.preview ? (
                            <img
                                src={story.preview}
                                alt={`История ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                                Story
                            </div>
                        )}
                    </div>

                    {/* Индикатор типа: синий для фото, красный ▶ для видео */}
                    <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow ${
                            story.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                    >
                        {story.type === 'video' ? '▶' : ''}
                    </div>
                </div>
            ))}
        </div>
    );
};

// =====================================================================
// MockStoriesViewer — полноэкранный просмотрщик историй
// =====================================================================
interface MockStoriesViewerProps {
    stories: MockStory[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export const MockStoriesViewer: React.FC<MockStoriesViewerProps> = ({
    stories,
    initialIndex,
    isOpen,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!isOpen || stories.length === 0) return null;

    const currentStory = stories[currentIndex];

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center">
            {/* Кнопка закрытия */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition z-10"
                aria-label="Закрыть"
            >
                ×
            </button>

            {/* Стрелка назад */}
            {currentIndex > 0 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-4 text-white text-4xl hover:text-gray-300 transition z-10"
                    aria-label="Предыдущая история"
                >
                    ←
                </button>
            )}

            {/* Основной контейнер истории */}
            <div className="relative max-w-md w-full mx-4">
                {/* Дата и время */}
                <div className="text-white text-sm mb-4 text-center">
                    {currentStory.date}
                </div>

                {/* Превью истории */}
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    {currentStory.preview ? (
                        <img
                            src={currentStory.preview}
                            alt={`История ${currentIndex + 1}`}
                            className="w-full h-[600px] object-contain"
                        />
                    ) : (
                        <div className="w-full h-[600px] flex flex-col items-center justify-center text-gray-400">
                            <svg
                                className="w-20 h-20 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <p>Нет изображения</p>
                        </div>
                    )}
                </div>

                {/* Кнопка "Открыть в VK" */}
                <div className="mt-4 text-center">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                        Открыть в VK
                    </button>
                </div>
            </div>

            {/* Стрелка вперёд */}
            {currentIndex < stories.length - 1 ? (
                <button
                    onClick={handleNext}
                    className="absolute right-4 text-white text-4xl hover:text-gray-300 transition z-10"
                    aria-label="Следующая история"
                >
                    →
                </button>
            ) : (
                <button
                    onClick={onClose}
                    className="absolute right-4 text-white text-sm hover:text-gray-300 transition z-10"
                    aria-label="Закрыть"
                >
                    Закрыть
                </button>
            )}
        </div>
    );
};

// =====================================================================
// StoriesRowDemo — интерактивная демонстрация строки историй
// =====================================================================
export const StoriesRowDemo: React.FC = () => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const demoStories: MockStory[] = [
        {
            id: 1,
            type: 'photo',
            preview: 'https://picsum.photos/seed/story1/200/300',
            date: '12 февраля 2026, 14:30',
        },
        {
            id: 2,
            type: 'video',
            preview: 'https://picsum.photos/seed/story2/200/300',
            date: '12 февраля 2026, 16:15',
        },
        {
            id: 3,
            type: 'photo',
            preview: 'https://picsum.photos/seed/story3/200/300',
            date: '12 февраля 2026, 18:00',
        },
        {
            id: 4,
            type: 'photo',
            preview: 'https://picsum.photos/seed/story4/200/300',
            date: '12 февраля 2026, 20:45',
        },
    ];

    const handleStoryClick = (index: number) => {
        setSelectedIndex(index);
        setViewerOpen(true);
    };

    return (
        <div>
            <MockStoriesRow stories={demoStories} onStoryClick={handleStoryClick} />

            <MockStoriesViewer
                stories={demoStories}
                initialIndex={selectedIndex}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
};

// =====================================================================
// EmptyStoriesDemo — демонстрация пустого состояния
// =====================================================================
export const EmptyStoriesDemo: React.FC = () => {
    return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500 text-sm">
            Нет активных историй
        </div>
    );
};

// =====================================================================
// TypeIndicatorsDemo — демонстрация индикаторов типа
// =====================================================================
export const TypeIndicatorsDemo: React.FC = () => {
    return (
        <div className="flex gap-8 items-center justify-center">
            {/* Фото */}
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-blue-100 to-blue-200" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center bg-blue-500 shadow" />
                </div>
                <p className="text-xs text-gray-600 mt-2">Фото (синий)</p>
            </div>

            {/* Видео */}
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-red-100 to-red-200" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold bg-red-500 shadow">
                        ▶
                    </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Видео (красный ▶)</p>
            </div>
        </div>
    );
};

// =====================================================================
// ViewerNavigationDemo — демонстрация навигации в просмотрщике
// =====================================================================
export const ViewerNavigationDemo: React.FC = () => {
    return (
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white overflow-hidden">
            {/* Имитация просмотрщика */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
                <button className="text-4xl hover:text-gray-300 transition" disabled>
                    ←
                </button>
                <div className="text-center">
                    <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center text-sm">
                        Превью истории
                    </div>
                </div>
                <button className="text-4xl hover:text-gray-300 transition">→</button>
            </div>

            {/* Кнопка закрытия */}
            <button className="absolute top-2 right-2 text-2xl hover:text-gray-300 transition">
                ×
            </button>

            {/* Описание клавиш */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 space-y-1">
                <p>← Назад • → Вперёд • Пробел • Escape — закрыть</p>
            </div>
        </div>
    );
};
