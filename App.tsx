
import React, { useMemo, useState } from 'react';
import { Sidebar } from './features/projects/components/Sidebar';
import { ProjectSettingsModal } from './features/projects/components/modals/ProjectSettingsModal';
import { useProjects } from './contexts/ProjectsContext';
import { useAuth } from './features/auth/contexts/AuthContext';
import { LoginPage } from './features/auth/components/LoginPage';
import { PrimarySidebar } from './features/navigation/components/PrimarySidebar';
import { GlobalAiErrorModal } from './shared/components/modals/GlobalAiErrorModal';
import { ConfirmationModal } from './shared/components/modals/ConfirmationModal';

// Импорт новых хуков и компонентов
import { useAppState } from './hooks/useAppState';
import { useSmartRefresh } from './hooks/useSmartRefresh';
import { AppContent } from './features/navigation/components/AppContent';

export type AppView = 'schedule' | 'suggested' | 'products' | 'automations' | 'db-management' | 'user-management' | 'settings' | 'training' | 'automations-stories' | 'automations-reviews-contest' | 'automations-promo-drop' | 'automations-contests' | 'automations-ai-posts' | 'automations-birthday' | 'automations-activity-contest' | 'lists-system' | 'lists-user' | 'lists-automations' | 'vk-auth-test';
export type AppModule = 'km' | 'am' | 'stats' | 'lists';

const App: React.FC = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    
    // Состояние приложения (Навигация и UI)
    const {
        activeModule,
        activeProjectId,
        setActiveProjectId,
        activeView,
        activeViewParams,
        setActiveViewParams,
        editingProject,
        setEditingProject,
        activeListGroup,
        setActiveListGroup,
        handleSelectModule,
        handleSelectGlobalView,
        handleSelectKmView,
        handleSelectListsView
    } = useAppState();

    // Данные из контекста
    const {
        projects,
        scheduledPostCounts,
        suggestedPostCounts,
        projectPermissionErrors,
        isInitialLoading,
        isCheckingForUpdates,
        updatedProjectIds,
        handleUpdateProjectSettings,
        handleForceRefreshProjects: refreshProjectsFromContext,
        handleRefreshForSidebar,
    } = useProjects();

    // Логика "умного обновления" (Smart Refresh) вынесена в отдельный хук
    useSmartRefresh(activeProjectId, activeView, activeModule);

    // --- Логика защиты от потери данных при переключении проекта ---
    const [navigationBlocker, setNavigationBlocker] = useState<(() => boolean) | null>(null);
    const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
    const [showNavConfirm, setShowNavConfirm] = useState(false);

    const handleProjectSwitch = (projectId: string | null) => {
        // Если проект тот же самый, ничего не делаем
        if (projectId === activeProjectId) return;

        // Если есть блокировщик и он возвращает true (данные не сохранены)
        if (navigationBlocker && navigationBlocker()) {
            setPendingProjectId(projectId);
            setShowNavConfirm(true);
        } else {
            setActiveProjectId(projectId);
            setActiveViewParams({}); // Сбрасываем параметры при смене проекта
        }
    };

    const confirmProjectSwitch = () => {
        // Сбрасываем блокировщик перед переключением, чтобы не сработал повторно
        setNavigationBlocker(null); 
        setActiveProjectId(pendingProjectId);
        setActiveViewParams({}); // Сбрасываем параметры
        setShowNavConfirm(false);
        setPendingProjectId(null);
    };

    const cancelProjectSwitch = () => {
        setShowNavConfirm(false);
        setPendingProjectId(null);
    };
    // ----------------------------------------------------------------

    // Вычисляемые значения
    const activeProject = projects.find(p => p.id === activeProjectId) || null;
    
    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        projects.forEach(p => {
            if (p.team) {
                teams.add(p.team);
            }
        });
        return Array.from(teams).sort();
    }, [projects]);

    const handleForceRefreshProjects = async () => {
        await refreshProjectsFromContext();
        setActiveProjectId(null);
    };

    // Функция навигации к конкурсу
    const handleNavigateToContest = () => {
        handleSelectKmView('automations-reviews-contest');
    };

    // Функция навигации к универсальным конкурсам
    const handleNavigateToGeneralContest = (contestId?: string) => {
        if (contestId) {
            setActiveViewParams({ contestId });
        } else {
            setActiveViewParams({});
        }
        handleSelectKmView('automations-contests');
    };

    // Функция навигации к AI постам
    const handleNavigateToAiPosts = (postId?: string) => {
        if (postId) {
            setActiveViewParams({ postId });
        } else {
            setActiveViewParams({});
        }
        handleSelectKmView('automations-ai-posts');
    };

    if (isAuthLoading) {
         return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="loader" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }
    
    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="h-screen w-screen flex antialiased text-gray-800 bg-gray-100">
            {/* Глобальное модальное окно для критических ошибок AI */}
            <GlobalAiErrorModal />
            
            <PrimarySidebar
                userRole={user.role}
                activeModule={activeModule}
                activeView={activeView}
                onSelectModule={handleSelectModule}
                onSelectView={handleSelectKmView}
                onSelectListsView={handleSelectListsView}
                onSelectGlobalView={handleSelectGlobalView}
            />
            
            {/* Сайдбар проектов отображается в модулях контент-менеджмента и списков */}
            {(activeModule === 'km' || activeModule === 'lists') && (
                 <Sidebar
                    projects={projects}
                    activeProjectId={activeProjectId}
                    activeView={activeView}
                    scheduledPostCounts={scheduledPostCounts}
                    suggestedPostCounts={suggestedPostCounts}
                    isLoadingCounts={isInitialLoading}
                    isCheckingForUpdatesProjectId={isCheckingForUpdates}
                    projectPermissionErrors={projectPermissionErrors}
                    updatedProjectIds={updatedProjectIds}
                    onSelectProject={handleProjectSwitch} // Используем обертку с защитой
                    onOpenSettings={setEditingProject}
                    onRefreshProject={handleRefreshForSidebar}
                    onForceRefresh={handleForceRefreshProjects}
                />
            )}

            <main className="flex-1 flex flex-col overflow-hidden">
                <AppContent 
                    activeModule={activeModule}
                    activeView={activeView}
                    activeProject={activeProject}
                    activeViewParams={activeViewParams} // Передаем параметры
                    onClearParams={() => setActiveViewParams({})} // Функция очистки
                    user={user}
                    isInitialLoading={isInitialLoading}
                    activeListGroup={activeListGroup}
                    onActiveListGroupChange={setActiveListGroup}
                    onForceRefreshProjects={handleForceRefreshProjects}
                    onNavigateToContest={handleNavigateToContest}
                    onNavigateToGeneralContest={handleNavigateToGeneralContest}
                    onNavigateToAiPosts={handleNavigateToAiPosts}
                    setNavigationBlocker={setNavigationBlocker} // Передаем сеттер блокировщика
                    onGoToTraining={() => handleSelectGlobalView('training')} // Переход в центр обучения
                />
            </main>
            
            {editingProject && (
                <ProjectSettingsModal
                    project={editingProject}
                    uniqueTeams={uniqueTeams}
                    onClose={() => setEditingProject(null)}
                    onSave={handleUpdateProjectSettings}
                />
            )}

            {showNavConfirm && (
                <ConfirmationModal
                    title="Переключиться в другой проект?"
                    message="У вас есть несохраненные изменения в текущей форме создания/редактирования. Если вы переключитесь, все заполненные данные будут утеряны."
                    onConfirm={confirmProjectSwitch}
                    onCancel={cancelProjectSwitch}
                    confirmText="Да, переключиться"
                    cancelText="Остаться"
                    confirmButtonVariant="danger"
                    zIndex="z-[60]"
                />
            )}
        </div>
    );
};

export default App;
