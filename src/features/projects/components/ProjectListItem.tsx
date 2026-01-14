
import React, { useState } from 'react';
import { Project } from '../../../shared/types';

interface ProjectListItemProps {
    project: Project;
    isActive: boolean;
    postCount: number | undefined;
    isLoadingCount: boolean;
    isCheckingForUpdates: boolean;
    isSequentiallyUpdating: boolean;
    errorDetails: string | null;
    hasUpdate: boolean;
    onSelectProject: (id: string) => void;
    onRefreshProject: (id: string) => void;
    onOpenSettings: (project: Project) => void;
    animationIndex: number;
    contestStatus?: boolean; // Новый проп
}

const getPostCountColorClasses = (count: number, isActive: boolean, isDisabled: boolean): string => {
    if (isActive) {
        if (isDisabled) return 'bg-gray-300 text-gray-800';
        if (count === 0) return 'bg-red-200 text-red-800';
        if (count > 0 && count < 5) return 'bg-orange-200 text-orange-800';
        if (count > 10) return 'bg-green-200 text-green-800';
        return 'bg-indigo-200 text-indigo-800';
    }
    
    if (count === 0) return 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium';
    if (count > 0 && count < 5) return 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium';
    if (count > 10) return 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium';
    return 'bg-gray-300 text-gray-700';
};

export const ProjectListItem: React.FC<ProjectListItemProps> = ({
    project,
    isActive,
    postCount,
    isLoadingCount,
    isCheckingForUpdates,
    isSequentiallyUpdating,
    errorDetails,
    hasUpdate,
    onSelectProject,
    onRefreshProject,
    onOpenSettings,
    animationIndex,
    contestStatus
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const isDisabled = !!project.disabled;
    const count = postCount ?? 0;
    const hasError = !!errorDetails;
    const isRefreshing = isCheckingForUpdates || isSequentiallyUpdating;

    return (
        <div
            className={`relative overflow-hidden opacity-0 animate-fade-in-up ${isDisabled ? 'opacity-70' : ''}`}
            style={{ animationDelay: `${animationIndex * 30}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Контейнер для кнопок, который выдвигается */}
            <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* ИЗМЕНЕНИЕ: Новая, более стабильная логика центрирования кнопок через transform */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                    <button
                        onClick={() => onRefreshProject(project.id)}
                        title={`Обновить данные`}
                        disabled={isRefreshing}
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800 disabled:cursor-wait disabled:opacity-50"
                    >
                        {isRefreshing ? (
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        )}
                    </button>
                    <button onClick={() => onOpenSettings(project)} title="Настройки" className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066 2.573c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>
            <button
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out ${isHovered ? 'pl-24' : 'pl-4'} ${
                    isActive
                        ? (isDisabled ? 'bg-gray-200 text-gray-800 font-semibold' : 'bg-indigo-50 text-indigo-700 font-semibold')
                        : (isDisabled ? 'text-gray-600 hover:bg-gray-100' : 'hover:bg-gray-100')
                }`}
            >
                 <div className="flex items-center min-w-0">
                    <span className="truncate pr-1">{project.name}</span>
                    {hasError && (
                        <div title={errorDetails || "Проблема с доступом. Проверьте права токена."} className="text-amber-500 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-8 h-4 flex items-center justify-center">
                    {isLoadingCount ? 
                        (<div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>) :
                    hasUpdate && !isRefreshing ?
                        (<div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" title="Доступны обновления"></div>) :
                    isRefreshing ?
                        (<div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>) :
                    contestStatus !== undefined ? (
                         // Отображение статуса конкурса
                         contestStatus ? (
                            <div title="Конкурс активен" className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                         ) : (
                             <div title="Конкурс отключен" className="w-2 h-2 bg-gray-300 rounded-full"></div>
                         )
                    ) :
                    postCount !== undefined ?
                        (<span className={`text-xs px-2 py-0.5 rounded-full ${getPostCountColorClasses(count, isActive, isDisabled)}`}>{count}</span>) :
                        null
                    }
                </div>
            </button>
        </div>
    );
};
