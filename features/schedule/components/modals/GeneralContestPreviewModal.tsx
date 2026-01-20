import React from 'react';
import { SystemPost } from '../../../../shared/types';
import { ImageGrid } from '../../../posts/components/postcard/ImageGrid';

interface GeneralContestPreviewModalProps {
    post: SystemPost;
    onClose: () => void;
    onNavigateToSettings: () => void;
}

export const GeneralContestPreviewModal: React.FC<GeneralContestPreviewModalProps> = ({ 
    post, 
    onClose, 
    onNavigateToSettings 
}) => {
    const isStart = post.post_type === 'GENERAL_CONTEST_START' || post.post_type === 'general_contest_start';
    const contestName = post.title || 'називание не указано';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className={`p-4 border-b flex justify-between items-center flex-shrink-0 rounded-t-lg ${isStart ? 'bg-sky-50' : 'bg-orange-50'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${isStart ? 'bg-sky-100 text-sky-600' : 'bg-orange-100 text-orange-600'}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Универсальный конкурс</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500">
                            Этот пост {isStart ? 'стартует' : 'подведет итоги'} механику <strong>"{contestName}"</strong>.
                            <br />
                            Его нельзя редактировать напрямую в расписании, так как он часть автоматизации.
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-blue-800">
                                Изменения текста, картинок и времени публикации нужно делать в настройках самого конкурса.
                            </span>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap mb-4 font-medium italic text-center">
                                {post.text ? post.text : <span className="text-gray-400">Текст поста будет сформирован автоматически</span>}
                            </p>
                            
                            {/* Картинки, если есть */}
                            {post.images && (
                                <ImageGrid images={typeof post.images === 'string' ? JSON.parse(post.images) : post.images} />
                            )}
                        </div>

                        <div className="text-xs text-gray-400">
                            Запланировано на: {new Date(post.publication_date).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}
                        </div>
                    </div>
                </main>

                <footer className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-white transition-colors">
                        Закрыть
                    </button>
                    <button 
                        onClick={onNavigateToSettings}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <span>Настройки конкурса</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                </footer>
            </div>
        </div>
    );
};
