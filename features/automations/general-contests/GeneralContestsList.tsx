
import React, { useState, useEffect } from 'react';
import { GeneralContest } from './types';
import * as api from '../../../services/api/automations_general.api';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { useToast } from '../../../shared/components/ToastProvider';
import { GeneralContestCard } from './components/GeneralContestCard';
import { useProjects } from '../../../contexts/ProjectsContext';

interface GeneralContestsListProps {
    projectId: string;
    onCreate: () => void;
    onEdit: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const GeneralContestsList: React.FC<GeneralContestsListProps> = ({ projectId, onCreate, onEdit, onDelete }) => {
    const { handleSystemPostUpdate } = useProjects();
    const [contests, setContests] = useState<GeneralContest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const reload = () => {
        setIsLoading(true);
        api.getGeneralContests(projectId)
            .then(setContests)
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { reload(); }, [projectId]);

    if (isLoading) return <div className="p-10 flex justify-center"><div className="loader"></div></div>;

    if (contests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                <div className="mb-4 text-gray-300">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Нет конкурсов</h3>
                <p className="mt-1 text-sm text-gray-500">Создайте свой первый универсальный конкурс или розыгрыш.</p>
                <button onClick={onCreate} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Создать конкурс</button>
            </div>
        );
    }

    const toast = useToast();

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await api.deleteGeneralContest(deleteTarget);
            setContests(prev => prev.filter(c => c.id !== deleteTarget));
            
            // Обновляем системные посты в расписании, чтобы убрать удаленные
            await handleSystemPostUpdate([projectId]);
            
            if (onDelete) onDelete(deleteTarget);
            setDeleteTarget(null);
        } catch (e) {
            toast.error('Не удалось удалить конкурс.');
            console.error(e);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Ваши конкурсы</h2>
                <button onClick={onCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                    + Создать
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map(contest => (
                    <GeneralContestCard 
                        key={contest.id} 
                        contest={contest} 
                        onEdit={onEdit} 
                        onDelete={setDeleteTarget} 
                    />
                ))}
            </div>

            {deleteTarget && (
                <ConfirmationModal
                    title="Удалить конкурс?"
                    message="Вы уверены, что хотите удалить этот конкурс и все связанные данные?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    confirmText="Да, удалить"
                    confirmButtonVariant="danger"
                    isConfirming={isDeleting}
                />
            )}
        </div>
    );
};
