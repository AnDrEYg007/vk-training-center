
import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../../shared/components/ToastProvider';
import { Project } from '../../../shared/types';
import { GeneralContest } from './types';
import { SettingsTab } from './components/SettingsTab';
import * as api from '../../../services/api/automations_general.api';
import { useProjects } from '../../../contexts/ProjectsContext';
import { GeneralContestPreview } from './components/GeneralContestPreview';
import { GeneralPromocodesTab } from './components/GeneralPromocodesTab';
import { GeneralParticipantsTab } from './components/GeneralParticipantsTab';
import { GeneralWinnersTab } from './components/GeneralWinnersTab';
import { GeneralSendingListTab } from './components/GeneralSendingListTab';
import { GeneralBlacklistTab } from './components/GeneralBlacklistTab';

interface GeneralContestEditorPageProps {
    projectId: string;
    contestId?: string; // Если редактирование
    onClose: () => void;
}

type Tab = 'settings' | 'promocodes' | 'participants' | 'winners' | 'sending_list' | 'blacklist';

const DEFAULT_CONTEST: GeneralContest = {
    id: '', // Будет создан на бэке или тут
    project_id: '',
    title: 'Новый конкурс',
    description: '',
    is_active: true,
    post_text: '',
    start_post_images: [],
    start_date: new Date().toISOString().split('T')[0],
    start_time: '12:00',
    conditions_schema: [
        { id: '1', conditions: [{ id: '1', type: 'like' }] }
    ],
    finish_type: 'duration',
    finish_duration_days: 0,
    finish_duration_hours: 24,
    finish_duration_time: '12:00',
    winners_count: 1,
    unique_winner: true,
    is_cyclic: false,
    template_result_post: 'Поздравляем победителей!\n\n{winners_list}',
    result_post_images: [],
    template_dm: 'Вы выиграли! Ваш промокод: {promo_code}',
    template_comment_fallback: 'Напишите нам в ЛС за призом!',
};

const getFormattedDateTime = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return { date, time };
};

export const GeneralContestEditorPage: React.FC<GeneralContestEditorPageProps> = ({ projectId, contestId, onClose }) => {
    const { projects, handleSystemPostUpdate } = useProjects();
    const project = projects.find(p => p.id === projectId);
    const toast = useToast();

    const [contest, setContest] = useState<GeneralContest>({ ...DEFAULT_CONTEST, project_id: projectId });
    const [isLoading, setIsLoading] = useState(!!contestId);
    const [isSaving, setIsSaving] = useState(false);
    const [initialContest, setInitialContest] = useState<GeneralContest | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('settings');

    useEffect(() => {
        if (contestId) {
            // Load contest data
            api.getGeneralContestById(contestId)
                .then((data) => {
                    const normalized = {
                        ...data,
                        result_post_images: data.result_post_images || [],
                    };
                    setContest(normalized);
                    setInitialContest(normalized);
                })
                .finally(() => setIsLoading(false));
        } else {
            // Новое создание — фиксируем стартовое состояние как baseline для isDirty
            const now = new Date();
            
            // Start time = Now + 5 minutes
            const start = new Date(now.getTime() + 5 * 60 * 1000);

            // Finish time = Start time + 1 day
            const finish = new Date(start);
            finish.setDate(finish.getDate() + 1);

            const { date: startDate, time: startTime } = getFormattedDateTime(start);
            const { date: finishDate, time: finishTime } = getFormattedDateTime(finish);

            const draft: GeneralContest = { 
                ...DEFAULT_CONTEST, 
                project_id: projectId,
                // Инициализация "Сейчас + 5 минут" по запросу
                start_date: startDate,
                start_time: startTime,
                finish_type: 'date', // Было выбрано в точную дату
                finish_date: finishDate,
                finish_time: finishTime,
            };
            setContest(draft);
            setInitialContest(draft);
            setIsLoading(false);
        }
    }, [contestId, projectId]);

    const isDirty = useMemo(() => {
        if (!initialContest) return false;
        return JSON.stringify(contest) !== JSON.stringify(initialContest);
    }, [contest, initialContest]);

    const getStatusBadge = () => {
        if (contest.is_active) {
            return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 animate-pulse">Активен</span>;
        }
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">Выключен</span>;
    };

    const handleSave = async () => {
        setIsSaving(true);
        console.log("Saving contest:", { contestId, contest });
        try {
            if (contestId) {
                const updated = await api.updateGeneralContest(contestId, contest);
                setInitialContest(updated || contest);
            } else {
                const created = await api.createGeneralContest(contest);
                setInitialContest(created || contest);
            }
            
            // Обновляем системные посты в расписании
            await handleSystemPostUpdate([projectId]);
            
            onClose();
        } catch (e: any) {
            console.error("Save error:", e);
            toast.error(`Ошибка сохранения: ${e.message || 'Неизвестная ошибка'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!initialContest) return;
        if (isDirty && !confirm('Отменить несохраненные изменения?')) return;
        setContest(initialContest);
    };

    if (!project) return null;
    if (isLoading) return <div className="p-10 text-center">Загрузка...</div>;

    const tabs: { id: Tab; label: string }[] = [
        { id: 'settings', label: 'Настройки' },
        { id: 'promocodes', label: 'Промокоды' },
        { id: 'participants', label: 'Участники' },
        { id: 'winners', label: 'Победители' },
        { id: 'sending_list', label: 'Отправка' },
        { id: 'blacklist', label: 'Чёрный список' },
    ];

    const effectiveContestId = contestId || contest.id;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Универсальный конкурс: <span className="text-indigo-600">{project.name}</span></h1>
                        <p className="text-sm text-gray-500">Настройки и запуск механики конкурса</p>
                    </div>
                    {getStatusBadge()}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={!isDirty || isSaving}
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !isDirty}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center min-w-[120px] justify-center"
                    >
                        {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        Закрыть
                    </button>
                </div>
            </header>
            
            {/* Tabs */}
            <div className="px-6 pt-4 flex-shrink-0 flex justify-between items-start gap-4">
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg overflow-x-auto custom-scrollbar max-w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content (Split) */}
            <main className="flex-grow overflow-hidden flex flex-col mt-4">
                {activeTab === 'settings' && (
                    <div className="flex flex-col lg:flex-row flex-grow overflow-hidden h-full">
                        <div className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar p-6 bg-white border-r border-gray-200">
                            <div className="space-y-8">
                                <SettingsTab 
                                    contest={contest} 
                                    onChange={(field, val) => setContest(prev => ({ ...prev, [field]: val }))}
                                    project={project}
                                />
                            </div>
                        </div>
                        <GeneralContestPreview contest={contest} project={project} />
                    </div>
                )}

                {activeTab === 'promocodes' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <GeneralPromocodesTab 
                            project={project} 
                            contestId={effectiveContestId} 
                            winnersCount={contest.winners_count || 0}
                        />
                    </div>
                )}

                {activeTab === 'participants' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <GeneralParticipantsTab contestId={effectiveContestId} />
                    </div>
                )}

                {activeTab === 'winners' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <GeneralWinnersTab contestId={effectiveContestId} />
                    </div>
                )}

                {activeTab === 'sending_list' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <GeneralSendingListTab contestId={effectiveContestId} />
                    </div>
                )}

                {activeTab === 'blacklist' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <GeneralBlacklistTab contestId={effectiveContestId} />
                    </div>
                )}
            </main>
        </div>
    );
};
