
import React from 'react';
import { AiPost } from '../types';
import { AiPostCard } from './AiPostCard';

interface AiPostListProps {
    posts: AiPost[];
    isLoading: boolean;
    errorMessage?: string;
    onCreateClick: () => void;
    onEditClick: (post: AiPost) => void;
    onDeleteClick: (id: string) => void;
}

export const AiPostList: React.FC<AiPostListProps> = ({ 
    posts, isLoading, errorMessage, onCreateClick, onEditClick, onDeleteClick 
}) => {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Автоматические AI-посты</h1>
                    <p className="text-sm text-gray-500">Регулярные публикации с уникальным контентом, генерируемым нейросетью.</p>
                </div>
                <button onClick={onCreateClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Создать AI пост
                </button>
            </header>

            <main className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                        {errorMessage}
                    </div>
                )}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loader border-t-indigo-600 w-10 h-10 border-4"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Нет активных автоматизаций</h3>
                        <p className="text-sm mt-1 max-w-sm text-center">Создайте свой первый AI пост, чтобы запустить регулярную генерацию контента.</p>
                        <button onClick={onCreateClick} className="mt-6 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md font-medium transition-colors">
                            Создать
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {posts.map(post => (
                            <AiPostCard 
                                key={post.id} 
                                post={post} 
                                onDelete={onDeleteClick}
                                onEdit={onEditClick}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
