import React from 'react';
import { SystemPost } from '../../../../shared/types';
import { useAppState } from '../../../../hooks/useAppState';

interface AiFeedPreviewModalProps {
    post: SystemPost;
    onClose: () => void;
    onNavigateToSettings: () => void;
}

export const AiFeedPreviewModal: React.FC<AiFeedPreviewModalProps> = ({ 
    post, 
    onClose, 
    onNavigateToSettings 
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0 bg-indigo-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">AI Авто-публикация</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            Это <strong>системный циклический AI-пост</strong>. Его контент генерируется автоматически перед каждой публикацией.
                            <br/><br/>
                            Текущий текст в базе является заглушкой или результатом предыдущей генерации. Новый текст будет создан в момент публикации.
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4 bg-white relative">
                            <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-gray-300">Превью (Пример)</span>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.text}</p>
                        </div>

                        <div className="text-xs text-gray-400">
                            Запланировано на: {new Date(post.publication_date).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}
                        </div>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Закрыть
                    </button>
                    <button 
                        onClick={onNavigateToSettings} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Настроить автоматизацию
                    </button>
                </footer>
            </div>
        </div>
    );
};