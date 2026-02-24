import React from 'react';

/**
 * Mock-компоненты для демонстрации постов в календаре
 * Визуально воспроизводят реальные карточки из календаря
 */

// =====================================================================
// Mock-карточка опубликованного поста
// =====================================================================
export const MockPublishedPost: React.FC = () => (
    <div className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Белый градиент СЛЕВА НАПРАВО (как в реальном коде) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 rounded-lg pointer-events-none" />
        
        {/* Зелёная галочка — КОНТУРНАЯ SVG (как в реальном коде) */}
        <div className="absolute top-2 left-2 z-10">
            <svg 
                className="h-6 w-6 text-green-500 opacity-80" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <div className="relative z-10">
            <div className="text-xs text-gray-500 mb-2">14:30</div>
            <div className="text-sm text-gray-800 mb-2">
                Опубликованный пост с примером текста. Имеет сплошную рамку и зелёную галочку.
            </div>
            <div className="flex gap-1">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Новости</span>
            </div>
        </div>
    </div>
);

// =====================================================================
// Mock-карточка отложенного VK поста
// =====================================================================
export const MockDeferredPost: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="text-xs text-gray-500 mb-2">16:00</div>
        <div className="text-sm text-gray-800 mb-2">
            Отложенный пост VK с примером текста. Имеет сплошную серую рамку без иконок.
        </div>
        <div className="flex gap-1">
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Акции</span>
        </div>
    </div>
);

// =====================================================================
// Mock-карточка системного поста
// =====================================================================
export const MockSystemPost: React.FC = () => (
    <div className="relative bg-white border border-dashed border-gray-400 rounded-lg p-4 shadow-sm">
        {/* Иконка статуса */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-sm">🕒</span>
        </div>

        <div className="text-xs text-gray-500 mb-2 ml-8">18:00</div>
        <div className="text-sm text-gray-800 mb-2">
            Системный пост с примером текста. Имеет пунктирную рамку и иконку статуса.
        </div>
        <div className="flex gap-1">
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Анонсы</span>
        </div>
    </div>
);
