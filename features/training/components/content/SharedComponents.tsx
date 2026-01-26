import React from 'react';

// =====================================================================
// Компонент Sandbox — универсальный контейнер для интерактивных демо
// =====================================================================
// 
// Используй этот компонент для создания "песочниц" в центре обучения.
// Он обеспечивает единообразный внешний вид и структуру для всех демо.
// 
// Пример использования:
// ```tsx
// import { Sandbox } from './SharedComponents';
// 
// <Sandbox 
//     title="Попробуйте сами: Название" 
//     description="Описание демо"
//     instructions={['<strong>Кликните</strong> на кнопку']}
// >
//     <MyDemoComponent />
// </Sandbox>
// ```
// =====================================================================

interface SandboxProps {
    /** Заголовок песочницы */
    title: string;
    /** Описание того, что демонстрирует песочница */
    description: string;
    /** Содержимое песочницы (интерактивные компоненты) */
    children: React.ReactNode;
    /** Список инструкций (поддерживает HTML для выделения) */
    instructions?: string[];
}

export const Sandbox: React.FC<SandboxProps> = ({ 
    title, 
    description, 
    children, 
    instructions 
}) => (
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
// Компонент FeatureCard — для описания отдельных элементов/состояний
// =====================================================================

interface FeatureCardProps {
    /** Иконка (emoji или React-компонент) */
    icon: React.ReactNode;
    /** Заголовок карточки */
    title: string;
    /** Описание */
    description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
    icon, 
    title, 
    description 
}) => (
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
// Компонент InfoBlock — для важных замечаний и подсказок
// =====================================================================

interface InfoBlockProps {
    /** Тип блока: warning (предупреждение), tip (совет), info (информация) */
    type: 'warning' | 'tip' | 'info';
    /** Заголовок блока */
    title: string;
    /** Текст блока */
    children: React.ReactNode;
}

const infoBlockStyles = {
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: '⚠️',
        iconColor: 'text-amber-500',
        titleColor: 'text-amber-800',
        textColor: 'text-amber-700',
    },
    tip: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: '💡',
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        textColor: 'text-blue-700',
    },
    info: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'ℹ️',
        iconColor: 'text-gray-500',
        titleColor: 'text-gray-800',
        textColor: 'text-gray-700',
    },
};

export const InfoBlock: React.FC<InfoBlockProps> = ({ type, title, children }) => {
    const styles = infoBlockStyles[type];
    
    return (
        <div className={`not-prose my-6 p-4 ${styles.bg} border ${styles.border} rounded-lg`}>
            <div className="flex items-start gap-3">
                <span className={`${styles.iconColor} text-xl`}>{styles.icon}</span>
                <div>
                    <p className={`font-semibold ${styles.titleColor}`}>{title}</p>
                    <div className={`text-sm ${styles.textColor} mt-1`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


// =====================================================================
// Компонент CounterExample — для демонстрации счётчиков с цветами
// =====================================================================

interface CounterExampleProps {
    /** Значение счётчика */
    count: number;
    /** Tailwind-классы для стилизации счётчика */
    colorClasses: string;
    /** Заголовок примера */
    title: string;
    /** Описание */
    description: string;
}

export const CounterExample: React.FC<CounterExampleProps> = ({ 
    count, 
    colorClasses, 
    title, 
    description 
}) => (
    <div className="flex items-center gap-4 p-3 bg-white border rounded-lg">
        <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses}`}>
            {count}
        </span>
        <div>
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);


// =====================================================================
// Компонент StepByStep — для пошаговых инструкций
// =====================================================================

interface Step {
    title: string;
    description: string;
}

interface StepByStepProps {
    steps: Step[];
}

export const StepByStep: React.FC<StepByStepProps> = ({ steps }) => (
    <div className="not-prose my-6 space-y-4">
        {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                    {idx + 1}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">{step.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
            </div>
        ))}
    </div>
);
