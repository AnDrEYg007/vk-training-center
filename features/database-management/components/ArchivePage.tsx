import React, { useState, useEffect, useCallback } from 'react';
import { Project, AuthUser } from '../../../shared/types';
import * as api from '../../../services/api';
import { ProjectTableSkeleton } from './ProjectTableSkeleton';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { ColumnDefinition } from './ProjectTable';

// FIX: Explicitly typed the array with `ColumnDefinition[]` to fix type inference issues.
const ARCHIVE_COLUMNS: ColumnDefinition[] = [
    { key: 'name', label: 'Название проекта' },
    { key: 'team', label: 'Команда' },
    { key: 'vkGroupName', label: 'Название VK' },
    { key: 'vkLink', label: 'Ссылка VK' },
];

export const ArchivePage: React.FC<{
    user: AuthUser | null;
    onGoBack: () => void;
    onDataUpdated: () => void;
}> = ({ user, onGoBack, onDataUpdated }) => {
    const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionState, setActionState] = useState<{ type: 'restore' | 'delete'; project: Project } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const isAdmin = user?.role === 'admin';

    const fetchArchivedProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const projects = await api.getArchivedProjects();
            setArchivedProjects(projects);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Не удалось загрузить архив.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArchivedProjects();
    }, [fetchArchivedProjects]);

    const handleRestore = async () => {
        if (actionState?.type !== 'restore') return;
        setIsProcessing(true);
        try {
            const projectToRestore = { ...actionState.project, archived: false };
            await api.updateProjects([projectToRestore]);
            window.showAppToast?.(`Проект "${projectToRestore.name}" успешно восстановлен.`, 'success');
            setActionState(null);
            fetchArchivedProjects();
            onDataUpdated(); // Сообщаем родительскому компоненту обновить основной список
        } catch (err) {
            window.showAppToast?.(`Не удалось восстановить проект: ${err instanceof Error ? err.message : 'Ошибка'}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleDelete = async () => {
        if (actionState?.type !== 'delete') return;
        setIsProcessing(true);
        try {
            await api.permanentlyDeleteProject(actionState.project.id);
            window.showAppToast?.(`Проект "${actionState.project.name}" и все связанные с ним данные были безвозвратно удалены.`, 'success');
            setActionState(null);
            fetchArchivedProjects();
            onDataUpdated();
        } catch (err) {
            window.showAppToast?.(`Не удалось удалить проект: ${err instanceof Error ? err.message : 'Ошибка'}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
             <header className="flex-shrink-0 bg-white shadow-sm z-10">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Архив проектов</h1>
                    <p className="text-sm text-gray-500">Здесь находятся проекты, перемещенные в архив. Их можно восстановить или безвозвратно удалить (только администратор).</p>
                </div>
                <div className="p-4 border-b border-gray-200 flex justify-start">
                    <button
                        onClick={onGoBack}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Назад к управлению
                    </button>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-auto custom-scrollbar">
                {isLoading ? (
                    <ProjectTableSkeleton columns={ARCHIVE_COLUMNS} visibleColumns={{}} />
                ) : error ? (
                    <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    {ARCHIVE_COLUMNS.map(col => (
                                        <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                                    ))}
                                    {isAdmin && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {archivedProjects.map(project => (
                                    <tr key={project.id}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{project.team || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate">{project.vkGroupName}</td>
                                        <td className="px-4 py-3 text-sm">
                                             <a href={project.vkLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap">
                                                Перейти
                                            </a>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3 text-sm font-medium flex items-center gap-2">
                                                <button onClick={() => setActionState({ type: 'restore', project })} className="text-blue-600 hover:text-blue-900 whitespace-nowrap">Восстановить</button>
                                                <button onClick={() => setActionState({ type: 'delete', project })} className="text-red-600 hover:text-red-900 whitespace-nowrap">Удалить</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {archivedProjects.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 5 : 4} className="text-center text-gray-500 py-8">Архив пуст.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            {actionState?.type === 'restore' && (
                <ConfirmationModal
                    title="Восстановить проект?"
                    message={`Вы уверены, что хотите восстановить проект "${actionState.project.name}" из архива?`}
                    onConfirm={handleRestore}
                    onCancel={() => setActionState(null)}
                    confirmText="Да, восстановить"
                    isConfirming={isProcessing}
                />
            )}
            {actionState?.type === 'delete' && (
                <ConfirmationModal
                    title="Удалить проект навсегда?"
                    message={`ВНИМАНИЕ! Вы собираетесь безвозвратно удалить проект "${actionState.project.name}" и ВСЕ связанные с ним данные (посты, заметки, теги).\n\nЭто действие НЕЛЬЗЯ отменить.`}
                    onConfirm={handleDelete}
                    onCancel={() => setActionState(null)}
                    confirmText="Да, удалить"
                    confirmButtonVariant="danger"
                    isConfirming={isProcessing}
                />
            )}
        </div>
    );
};