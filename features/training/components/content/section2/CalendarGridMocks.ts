// =====================================================================
// Mock-данные для компонентов Calendar Grid
// =====================================================================

export interface DemoNote {
    time: string;
    color: string;
    title: string;
}

export interface DemoPost {
    time: string;
    type: 'scheduled' | 'published' | 'system';
    text: string;
    isGhost?: boolean;
}

export interface DayContent {
    stories: number;
    posts: DemoPost[];
    notes: DemoNote[];
}

// Цветовые классы для заметок (вместо HEX-цветов)
export const NOTE_COLOR_CLASSES = {
    RED: 'bg-red-100 border-red-300',
    GREEN: 'bg-green-100 border-green-300',
    YELLOW: 'bg-yellow-100 border-yellow-300',
    BLUE: 'bg-blue-100 border-blue-300',
    PURPLE: 'bg-purple-100 border-purple-300',
    PINK: 'bg-pink-100 border-pink-300',
    GRAY: 'bg-gray-100 border-gray-300',
} as const;

// Демо-данные для сетки календаря (неделя)
export const DEMO_WEEK_CONTENT: Record<number, DayContent> = {
    0: { // Понедельник
        stories: 2,
        posts: [
            { time: '10:00', type: 'scheduled', text: 'Утренний пост о новой коллекции' },
            { time: '16:00', type: 'published', text: 'Вечерний пост уже опубликован' }
        ],
        notes: [
            { time: '14:00', color: NOTE_COLOR_CLASSES.RED, title: 'Созвон с командой' }
        ]
    },
    1: { // Вторник
        stories: 0,
        posts: [
            { time: '12:00', type: 'scheduled', text: 'Пост про акцию' }
        ],
        notes: []
    },
    2: { // Среда (сегодня)
        stories: 3,
        posts: [
            { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: false },
            { time: '15:00', type: 'scheduled', text: 'Пост про конкурс' }
        ],
        notes: [
            { time: '11:00', color: NOTE_COLOR_CLASSES.GREEN, title: 'Подготовить фото' }
        ]
    },
    3: { // Четверг
        stories: 0,
        posts: [
            { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: true },
            { time: '18:00', type: 'scheduled', text: 'Вечерний пост' }
        ],
        notes: []
    },
    4: { // Пятница
        stories: 1,
        posts: [
            { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: true },
        ],
        notes: [
            { time: '10:00', color: NOTE_COLOR_CLASSES.YELLOW, title: 'Запланировать посты на выходные' }
        ]
    },
    5: { // Суббота
        stories: 0,
        posts: [],
        notes: []
    },
    6: { // Воскресенье
        stories: 0,
        posts: [
            { time: '12:00', type: 'scheduled', text: 'Воскресный пост' }
        ],
        notes: []
    }
};

// Демо-данные для компонента DayColumns
export const DAY_COLUMNS_DEMO = {
    date: '15 января, понедельник',
    stories: 2,
    content: [
        { time: '10:00', type: 'post', text: 'Утренний пост о новой коллекции' },
        { time: '14:00', type: 'note', text: 'Созвон с командой', color: NOTE_COLOR_CLASSES.RED },
        { time: '16:00', type: 'post', text: 'Вечерний пост уже опубликован' }
    ]
};
