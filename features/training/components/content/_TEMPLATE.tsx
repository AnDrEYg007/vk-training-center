import React, { useState } from 'react';
// Если нужны кастомные mock-компоненты, создай файл ИмяРазделаMocks.tsx
// и импортируй их сюда:
// import { MockКомпонент } from './ИмяРазделаMocks';

interface ContentProps {
    title: string;
}

// =====================================================================
// Компонент Sandbox — используй для всех интерактивных демо
// =====================================================================
const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
}> = ({ title, description, children, instructions }) => (
    <div className="relative not-prose p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-12">
        <h4 className="text-xl font-bold text-indigo-800 mb-2">{title}</h4>
        <p className="text-sm text-indigo-700 mb-4">{description}</p>
        {instructions && instructions.length > 0 && (
            <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1 mb-6">
                {instructions.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        )}
        {children}
    </div>
);

// =====================================================================
// Вспомогательный компонент для описания состояний/элементов
// =====================================================================
const FeatureCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string;
}> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-white border rounded-lg">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
            {icon}
        </div>
        <div>
            <p className="font-bold text-gray-800">{title}</p>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
    </div>
);

// =====================================================================
// ОСНОВНОЙ КОМПОНЕНТ РАЗДЕЛА
// =====================================================================
// 
// ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ:
// 1. Переименуй этот файл в соответствии с названием раздела (PascalCase)
//    Например: WelcomeScreen.tsx, PostTypes.tsx, VariablesGuide.tsx
// 
// 2. Переименуй экспортируемый компонент ниже
//    Например: export const WelcomeScreen: React.FC<ContentProps> = ...
// 
// 3. Зарегистрируй компонент в TopicContent.tsx:
//    import { WelcomeScreen } from './content/WelcomeScreen';
//    const componentMap = {
//        ...
//        '1-3-welcome-screen': WelcomeScreen, // path из tocData.ts
//    };
// 
// 4. Заполни контент ниже
// =====================================================================

export const TemplateContent: React.FC<ContentProps> = ({ title }) => {
    // Состояния для интерактивных демо (добавь по необходимости)
    const [demoState, setDemoState] = useState<string>('default');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* ============================================================= */}
            {/* ЗАГОЛОВОК СТРАНИЦЫ */}
            {/* ============================================================= */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================================= */}
            {/* ВВОДНЫЙ БЛОК: Что это такое? */}
            {/* ============================================================= */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это такое?</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Название функционала</strong> — краткое и понятное описание того, 
                что делает этот элемент интерфейса и зачем он нужен пользователю.
            </p>

            {/* ============================================================= */}
            {/* СЕКЦИЯ 1 */}
            {/* ============================================================= */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1. Название первой секции
            </h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Подробное описание этой части функционала. Используй простой язык, 
                избегай технических терминов. Если термин необходим — объясни его.
            </p>

            {/* Список особенностей */}
            <ul className="!text-base !leading-relaxed !text-gray-700 !mt-4 !space-y-2">
                <li>
                    <strong>Первая особенность:</strong> Описание того, как это работает.
                </li>
                <li>
                    <strong>Вторая особенность:</strong> Ещё одно важное поведение.
                </li>
                <li>
                    <strong>Неочевидное поведение:</strong> То, что пользователь может не ожидать.
                </li>
            </ul>

            {/* Интерактивная песочница */}
            <Sandbox 
                title="Попробуйте сами: Название демо" 
                description="Краткое описание того, что можно делать в этой песочнице."
                instructions={[
                    '<strong>Кликните</strong> на элемент, чтобы увидеть реакцию.',
                    '<strong>Наведите</strong> курсор для появления подсказки.',
                    '<strong>Перетащите</strong> элемент в другую область.',
                ]}
            >
                {/* Здесь размещается интерактивный mock-компонент */}
                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-500 text-center">
                        [Здесь будет интерактивный компонент]
                    </p>
                    {/* Пример простого интерактивного элемента: */}
                    <div className="flex gap-4 mt-4 justify-center">
                        <button 
                            onClick={() => setDemoState('option1')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                demoState === 'option1' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Опция 1
                        </button>
                        <button 
                            onClick={() => setDemoState('option2')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                demoState === 'option2' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Опция 2
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Выбрано: <strong>{demoState}</strong>
                    </p>
                </div>
            </Sandbox>

            {/* ============================================================= */}
            {/* СЕКЦИЯ 2 */}
            {/* ============================================================= */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2. Название второй секции
            </h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Описание следующей части функционала...
            </p>

            {/* Карточки с описанием состояний/элементов */}
            <div className="not-prose my-6 space-y-4">
                <FeatureCard 
                    icon={<span className="text-lg">🔵</span>}
                    title="Состояние 1: Название" 
                    description="Описание этого состояния и что оно означает для пользователя." 
                />
                <FeatureCard 
                    icon={<span className="text-lg">🟡</span>}
                    title="Состояние 2: Название" 
                    description="Описание второго состояния." 
                />
                <FeatureCard 
                    icon={<span className="text-lg">🔴</span>}
                    title="Состояние 3: Название" 
                    description="Описание третьего состояния." 
                />
            </div>

            {/* ============================================================= */}
            {/* СЕКЦИЯ 3: Важные замечания (опционально) */}
            {/* ============================================================= */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3. Важно знать
            </h2>
            
            {/* Блок с важной информацией */}
            <div className="not-prose my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl">⚠️</span>
                    <div>
                        <p className="font-semibold text-amber-800">Обратите внимание</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Здесь можно разместить важное предупреждение или информацию, 
                            которую пользователь может упустить.
                        </p>
                    </div>
                </div>
            </div>

            {/* Блок с подсказкой */}
            <div className="not-prose my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">💡</span>
                    <div>
                        <p className="font-semibold text-blue-800">Полезный совет</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Здесь можно разместить лайфхак или совет по эффективному использованию.
                        </p>
                    </div>
                </div>
            </div>

        </article>
    );
};
