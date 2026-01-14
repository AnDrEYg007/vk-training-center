import React from 'react';
import { Project, SuggestedPost } from '../../../shared/types';
import { useSuggestedPostsManager } from '../hooks/useSuggestedPostsManager';
import { PostCardSkeleton } from './PostCardSkeleton';
import { EmptyState } from './EmptyState';
import { SuggestedPostsLayout } from './SuggestedPostsLayout';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

interface SuggestedPostsTabProps {
    project: Project;
    cachedPosts: SuggestedPost[] | undefined;
    onPostsLoaded: (posts: SuggestedPost[]) => void;
    permissionErrorMessage?: string | null;
    emptySuggestedMessage?: string | null;
}

export const SuggestedPostsTab: React.FC<SuggestedPostsTabProps> = ({
    project,
    cachedPosts,
    onPostsLoaded,
    permissionErrorMessage,
    emptySuggestedMessage
}) => {
    const { state, actions } = useSuggestedPostsManager({
        project,
        cachedPosts,
        onPostsLoaded,
    });

    const {
        posts,
        isLoading,
        error,
        selectedPost,
        correctedText,
        isCorrecting,
        confirmation,
    } = state;

    const {
        handleRefresh,
        handleSelectPost,
        handleCopyToClipboard,
        handleCancelConfirmation,
    } = actions;

    const renderContent = () => {
        if (isLoading && posts.length === 0 && !permissionErrorMessage && !emptySuggestedMessage) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            );
        }

        if (error && !permissionErrorMessage) {
            return (
                <EmptyState
                    icon="error"
                    title="Ошибка загрузки"
                    message={error}
                />
            );
        }

        if (posts.length === 0 && !isLoading && !permissionErrorMessage && !emptySuggestedMessage) {
            return (
                <EmptyState
                    icon="empty"
                    title="Нет предложенных постов"
                    message="В этом проекте нет постов для модерации. Попробуйте обновить данные или проверьте настройки."
                />
            );
        }
        
        return (
            <SuggestedPostsLayout
                posts={posts}
                project={project}
                selectedPostId={selectedPost?.id || null}
                correctedText={correctedText}
                isCorrecting={isCorrecting}
                onSelectPost={handleSelectPost}
                onCopyToClipboard={handleCopyToClipboard}
            />
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                 <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Предложенные посты</h1>
                    <p className="text-sm text-gray-500">Посты, предложенные пользователями в сообществе "{project.name}"</p>
                </div>
                 <div className="p-4 border-b border-gray-200">
                     <div className="flex items-center gap-x-4">
                         <button
                            onClick={() => handleRefresh()}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm"
                        >
                            {isLoading ? <div className="loader h-4 w-4 mr-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                            <span>Обновить</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                {permissionErrorMessage && (
                    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-4 rounded-r-lg shadow" role="alert">
                        <div className="flex">
                            <div className="py-1">
                                <svg className="h-6 w-6 text-amber-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold">Ошибка доступа</p>
                                <p className="text-sm">Не удалось загрузить данные. Убедитесь, что сервисный токен имеет права администратора в этом сообществе, после чего обновите данные вручную.</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {emptySuggestedMessage && (
                     <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mb-4 rounded-r-lg shadow" role="status">
                        <div className="flex">
                            <div className="py-1">
                                 <svg className="h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold">Информация</p>
                                <p className="text-sm">{emptySuggestedMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {renderContent()}
                </div>
            </main>
             {confirmation && (
                <ConfirmationModal
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirm={confirmation.onConfirm}
                    onCancel={handleCancelConfirmation}
                    isConfirming={isCorrecting}
                />
            )}
        </div>
    );
};