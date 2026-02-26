import React from 'react';
import { useTrainingNavigation } from '../../contexts/TrainingNavigationContext';

// =====================================================================
// Компонент Sandbox (из существующего дизайна)
// =====================================================================
export const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
    height?: string;
}> = ({ title, description, children, instructions, height }) => (
    <div 
        className="relative not-prose p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-8"
        style={height ? { height } : undefined}
    >
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
// Компонент NavigationLink - ссылка на другой раздел обучения
// =====================================================================
interface NavigationLinkProps {
    to: string;           // path раздела (например '1-2-2-projects-sidebar-intro')
    title: string;        // Заголовок ссылки
    description?: string; // Описание
    variant?: 'next' | 'prev' | 'related'; // Стиль оформления
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({ 
    to, 
    title, 
    description,
    variant = 'next'
}) => {
    const { navigateTo } = useTrainingNavigation();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigateTo(to);
    };

    const variantStyles = {
        next: 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200',
        prev: 'from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200',
        related: 'from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200'
    };

    const titleColors = {
        next: 'text-green-900',
        prev: 'text-gray-700',
        related: 'text-purple-900'
    };

    const arrowDirection = variant === 'prev' ? '←' : '→';

    return (
        <button 
            onClick={handleClick}
            className={`block w-full text-left bg-gradient-to-r ${variantStyles[variant]} border rounded-lg p-4 transition-all hover:shadow-sm cursor-pointer`}
        >
            <p className={`font-bold ${titleColors[variant]}`}>
                {arrowDirection} {title}
            </p>
            {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
        </button>
    );
};

// =====================================================================
// Компонент NavigationButtons - горизонтальная навигация между разделами
// Автоматически вычисляет предыдущий и следующий раздел по текущему пути
// =====================================================================
interface NavigationButtonsProps {
    currentPath: string; // Путь текущего раздела
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentPath }) => {
    const { navigateTo, getPrevNext } = useTrainingNavigation();
    const { prev, next } = getPrevNext(currentPath);

    if (!prev && !next) return null;

    return (
        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
            <div className="flex gap-4">
                {/* Кнопка "Назад" */}
                {prev ? (
                    <button 
                        onClick={() => navigateTo(prev.path)}
                        className="flex-1 text-left bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border border-gray-200 rounded-lg p-4 transition-all hover:shadow-sm cursor-pointer group"
                    >
                        <p className="text-xs text-gray-500 mb-1">← Назад</p>
                        <p className="font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{prev.title}</p>
                    </button>
                ) : (
                    <div className="flex-1" /> 
                )}

                {/* Кнопка "Вперёд" */}
                {next ? (
                    <button 
                        onClick={() => navigateTo(next.path)}
                        className="flex-1 text-right bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-lg p-4 transition-all hover:shadow-sm cursor-pointer group"
                    >
                        <p className="text-xs text-green-600 mb-1">Далее →</p>
                        <p className="font-bold text-green-900 group-hover:text-green-800 line-clamp-1">{next.title}</p>
                    </button>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </div>
    );
};

// =====================================================================
// Стандартные props для контентных компонентов
// =====================================================================
export interface ContentProps {
    title: string;
}
