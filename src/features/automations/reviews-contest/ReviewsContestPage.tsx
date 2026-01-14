
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project } from '../../../shared/types';
import { ContestSettings, PromoCode } from './types';
import { SettingsTab } from './components/SettingsTab';
import { PostsTab } from './components/PostsTab';
import { WinnersTab } from './components/WinnersTab';
import { BlacklistTab } from './components/BlacklistTab';
import { SendingListTab } from './components/SendingListTab'; 
import { PromocodesTab } from './components/PromocodesTab';
import { LogsTab } from './components/LogsTab';
import * as api from '../../../services/api';
import { useProjects } from '../../../contexts/ProjectsContext';

type Tab = 'settings' | 'posts' | 'winners' | 'blacklist' | 'promocodes' | 'sending_list' | 'logs';

interface ReviewsContestPageProps {
    project: Project;
}

// Дефолтные настройки
const DEFAULT_SETTINGS: ContestSettings = {
    isActive: false,
    keywords: '#отзыв',
    startDate: new Date().toISOString().split('T')[0],
    finishCondition: 'date',
    targetCount: 10,
    finishDate: '',
    finishDayOfWeek: 1,
    finishTime: '10:00',
    templateComment: 'Спасибо за отзыв! Ваш номер участника: {number}. Желаем удачи!',
    templateWinnerPost: 'Поздравляем победителей!\n\n{winners_list}\n\nСпасибо всем за участие!',
    winnerPostImages: [], 
    templateDm: 'Поздравляем! Вы выиграли в конкурсе отзывов.\nВаш приз: {description}\nВаш промокод: {promo_code}',
    templateErrorComment: '{user_name}, поздравляем с победой!\n\nНе смогли прислать вам промокод в сообщениях сообщества, возможно вы еще нам не писали или запретили присылать сообщения от лица сообщества.\n\nНапишите нам в сообщения сообщества или разрешите получать сообщения, чтобы забрать приз!'
};

export const ReviewsContestPage: React.FC<ReviewsContestPageProps> = ({ project }) => {
    const [activeTab, setActiveTab] = useState<Tab>('settings');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Получаем глобальные переменные из контекста
    const { handleSystemPostUpdate, allGlobalVarDefs, allGlobalVarValues, setReviewsContestStatuses } = useProjects();

    const [settings, setSettings] = useState<ContestSettings>(DEFAULT_SETTINGS);
    const [initialSettings, setInitialSettings] = useState<ContestSettings>(DEFAULT_SETTINGS);
    
    const [previewPromo, setPreviewPromo] = useState<PromoCode | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [settingsData, promocodesData] = await Promise.all([
                    api.getReviewsContestSettings(project.id),
                    api.getContestPromocodes(project.id)
                ]);
                
                let keywords = settingsData.keywords;
                if (keywords === '#отзыв' && !settingsData.isActive) {
                    keywords = `#отзыв@${project.vkGroupShortName}`;
                }

                const loadedSettings: ContestSettings = {
                    isActive: settingsData.isActive,
                    keywords: keywords,
                    startDate: settingsData.startDate || new Date().toISOString().split('T')[0],
                    finishCondition: settingsData.finishCondition as any,
                    targetCount: settingsData.targetCount ?? 10,
                    finishDate: settingsData.finishDate || '',
                    finishDayOfWeek: settingsData.finishDayOfWeek ?? 1,
                    finishTime: settingsData.finishTime || '10:00',
                    templateComment: settingsData.templateComment,
                    templateWinnerPost: settingsData.templateWinnerPost,
                    winnerPostImages: settingsData.winnerPostImages || [],
                    templateDm: settingsData.templateDm,
                    templateErrorComment: settingsData.templateErrorComment
                };

                setSettings(loadedSettings);
                setInitialSettings(loadedSettings);
                
                const availableCodes = promocodesData.filter(p => !p.is_issued);
                if (availableCodes.length > 0) {
                    const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];
                    setPreviewPromo(randomCode);
                } else if (promocodesData.length > 0) {
                     setPreviewPromo(promocodesData[0]);
                } else {
                    setPreviewPromo(null);
                }

            } catch (error) {
                console.error("Failed to load review contest data:", error);
                window.showAppToast?.("Не удалось загрузить данные конкурса.", 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [project.id, project.vkGroupShortName]);

    const isDirty = useMemo(() => {
        return JSON.stringify(settings) !== JSON.stringify(initialSettings);
    }, [settings, initialSettings]);

    const getStatusBadge = () => {
        if (settings.isActive) {
             return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 animate-pulse">Активен (Сбор)</span>;
        }
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">Остановлен</span>;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dto = {
                projectId: project.id,
                ...settings
            };
            
            await api.saveReviewsContestSettings(dto);
            setInitialSettings(settings);
            
            // Обновляем статус конкурса в глобальном контексте
            setReviewsContestStatuses(prev => ({
                ...prev,
                [project.id]: settings.isActive
            }));
            
            await handleSystemPostUpdate([project.id]);

            window.showAppToast?.("Настройки успешно сохранены!", 'success');
        } catch (error) {
            console.error("Failed to save settings:", error);
            window.showAppToast?.("Ошибка при сохранении настроек.", 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        if (confirm("Отменить все несохраненные изменения?")) {
            setSettings(initialSettings);
        }
    };

    const handleSettingsChange = useCallback((field: keyof ContestSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const tabButtonClass = (tab: Tab) => `px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
        activeTab === tab 
        ? 'bg-white text-indigo-600 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-300'
    }`;
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="loader border-t-indigo-600 w-10 h-10 border-4"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-800">Конкурс отзывов: <span className="text-indigo-600">{project.name}</span></h1>
                    {getStatusBadge()}
                </div>
            </header>

            <div className="px-6 pt-4 flex-shrink-0 flex justify-between items-start gap-4">
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg overflow-x-auto custom-scrollbar max-w-full">
                    <button onClick={() => setActiveTab('settings')} className={tabButtonClass('settings')}>
                        Настройки
                    </button>
                    <button onClick={() => setActiveTab('posts')} className={tabButtonClass('posts')}>
                        Посты
                    </button>
                    <button onClick={() => setActiveTab('winners')} className={tabButtonClass('winners')}>
                        Победители
                    </button>
                    <button onClick={() => setActiveTab('promocodes')} className={tabButtonClass('promocodes')}>
                        Промокоды
                    </button>
                    <button onClick={() => setActiveTab('sending_list')} className={tabButtonClass('sending_list')}>
                        Лист отправок
                    </button>
                    <button onClick={() => setActiveTab('blacklist')} className={tabButtonClass('blacklist')}>
                        Блэклист
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={tabButtonClass('logs')}>
                        Логи
                    </button>
                </div>

                {activeTab === 'settings' && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={isSaving || !isDirty}
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
                    </div>
                )}
            </div>

            <main className="flex-grow overflow-hidden flex flex-col mt-4">
                {activeTab === 'settings' && (
                    <SettingsTab 
                        settings={settings} 
                        onChange={handleSettingsChange}
                        project={project}
                        previewPromo={previewPromo}
                        // Передаем глобальные переменные для превью
                        globalVarDefs={allGlobalVarDefs}
                        projectGlobalVarValues={allGlobalVarValues[project.id] || []}
                    />
                )}
                {activeTab === 'posts' && (
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <PostsTab projectId={project.id} />
                    </div>
                )}
                {activeTab === 'winners' && (
                     <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <WinnersTab />
                    </div>
                )}
                {activeTab === 'promocodes' && (
                     <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <PromocodesTab project={project} />
                    </div>
                )}
                {activeTab === 'sending_list' && (
                     <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <SendingListTab projectId={project.id} />
                    </div>
                )}
                {activeTab === 'blacklist' && (
                     <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <BlacklistTab />
                    </div>
                )}
                {activeTab === 'logs' && (
                     <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        <LogsTab />
                    </div>
                )}
            </main>
        </div>
    );
};
