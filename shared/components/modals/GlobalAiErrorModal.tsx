
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const AI_ERROR_EVENT = 'vk-planner:critical-ai-error';

export const GlobalAiErrorModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleEvent = () => {
            setIsOpen(true);
        };

        window.addEventListener(AI_ERROR_EVENT, handleEvent);
        return () => window.removeEventListener(AI_ERROR_EVENT, handleEvent);
    }, []);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Сервисы AI перегружены</h2>
                    <p className="text-sm text-gray-600">
                        Мы исчерпали лимиты всех доступных моделей (Gemini/Gemma). 
                        Сейчас генерация текста недоступна.
                    </p>
                </div>
                <div className="p-6 bg-white space-y-4">
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="font-semibold mb-1">Что делать?</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Подождите 1-2 минуты и попробуйте снова.</li>
                            <li>Попробуйте сменить IP (VPN), если вы работаете локально.</li>
                            <li>Если проблема сохраняется долго — свяжитесь с администратором.</li>
                        </ul>
                    </div>
                    
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Понятно, попробую позже
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
