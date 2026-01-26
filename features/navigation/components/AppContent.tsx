
import React, { useState } from 'react';
import { AppView, AppModule } from '../../../App';
import { Project, AuthUser } from '../../../shared/types';
import { ListGroup } from '../../lists/types';
import { useProjects } from '../../../contexts/ProjectsContext';

// Components
import { ScheduleTab } from '../../schedule/components/ScheduleTab';
import { SuggestedPostsTab } from '../../suggested-posts/components/SuggestedPostsTab';
import { ProductsTab } from '../../products/components/ProductsTab';
import { SystemListsTab } from '../../lists/components/SystemListsTab';
import { DatabaseManagementPage } from '../../database-management/components/DatabaseManagementPage';
import { UserManagementPage } from '../../users/components/UserManagementPage';
import { TrainingPage } from '../../training/components/TrainingPage';
import { ReviewsContestPage } from '../../automations/reviews-contest/ReviewsContestPage';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage';
import { WelcomeScreen } from '../../../shared/components/WelcomeScreen';
import { AiPostsPage } from '../../automations/ai-posts/AiPostsPage';
// NEW IMPORTS
import { GeneralContestsPage } from '../../automations/general-contests/GeneralContestsPage';
import { StoriesAutomationPage } from '../../automations/stories-automation/StoriesAutomationPage';
import { VkTestPage } from '../../test-auth/VkTestPage';
import { SettingsPage } from '../../settings/components/SettingsPage';

interface AppContentProps {
    activeModule: AppModule | null;
    activeView: AppView;
    activeProject: Project | null;
    activeViewParams?: Record<string, any>;
    onClearParams?: () => void;
    user: AuthUser;
    isInitialLoading: boolean;
    activeListGroup: ListGroup;
    onActiveListGroupChange: (group: ListGroup) => void;
    onForceRefreshProjects: () => Promise<void>;
    onNavigateToContest?: () => void;
    onNavigateToGeneralContest?: (contestId?: string) => void;
    onNavigateToAiPosts?: (postId?: string) => void;
    setNavigationBlocker?: React.Dispatch<React.SetStateAction<(() => boolean) | null>>;
    /** Колбэк для перехода в центр обучения */
    onGoToTraining?: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({
    activeModule,
    activeView,
    activeProject,
    activeViewParams,
    onClearParams,
    user,
    isInitialLoading,
    activeListGroup,
    onActiveListGroupChange,
    onForceRefreshProjects,
    onNavigateToContest,
    onNavigateToGeneralContest,
    onNavigateToAiPosts,
    setNavigationBlocker,
    onGoToTraining
}) => {
    const {
        projects,
        allPosts,
        allScheduledPosts,
        allSystemPosts,
        allSuggestedPosts,
        allNotes,
        allGlobalVarDefs,
        allGlobalVarValues,
        projectPermissionErrors,
        projectEmptyScheduleNotices,
        projectEmptySuggestedNotices,
        handleUpdateProjectSettings,
        handleNotesUpdate,
        setAllSuggestedPosts,
    } = useProjects();
    
    // State for General Contests Navigation (List <-> Editor) - MOVED TO GeneralContestsPage


    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="loader mx-auto" style={{ width: '40px', height: '40px', borderTopColor: '#4f46e5' }}></div>
                    <p className="mt-4 text-gray-600">Загружаем данные из базы...</p>
                </div>
            </div>
        );
    }

    if (activeView === 'db-management') {
        return <DatabaseManagementPage onProjectsUpdate={onForceRefreshProjects} user={user} />;
    }
    if (activeView === 'user-management' && user?.role === 'admin') {
        return <UserManagementPage />;
    }
    if (activeView === 'settings') {
        return <SettingsPage />;
    }
    if (activeView === 'training') {
        return <TrainingPage />;
    }
    if (activeView === 'vk-auth-test') {
        return <VkTestPage />;
    }
    
    if (activeView === 'automations') {
        return <PlaceholderPage title="Автоматизации" message="Выберите подраздел для настройки автоматизаций." />;
    }
    
    if (activeView === 'automations-stories') {
        return <StoriesAutomationPage projectId={activeProject?.id} />;
    }

    if (activeView === 'automations-reviews-contest') {
        if (!activeProject) return <WelcomeScreen onGoToTraining={onGoToTraining} />;
        return <ReviewsContestPage project={activeProject} />;
    }

    // --- GENERAL CONTESTS ROUTING ---
    if (activeView === 'automations-contests') {
        if (!activeProject) return <WelcomeScreen onGoToTraining={onGoToTraining} />;
        
        return (
            <GeneralContestsPage 
                projectId={activeProject.id} 
                setNavigationBlocker={setNavigationBlocker}
                initialContestId={activeViewParams?.contestId}
                onClearParams={onClearParams}
            />
        );
    }
    
    if (activeView === 'automations-ai-posts') {
        if (!activeProject) return <WelcomeScreen onGoToTraining={onGoToTraining} />;
        return (
            <AiPostsPage 
                projectId={activeProject.id} 
                setNavigationBlocker={setNavigationBlocker}
                initialPostId={activeViewParams?.postId}
                onClearParams={onClearParams}
            />
        );
    }
    
    // ... rest of the component (schedule, products, lists)
    if (activeModule === 'km') {
        if (!activeProject) return <WelcomeScreen onGoToTraining={onGoToTraining} />;
        if (activeView === 'schedule') {
             return (
                <ScheduleTab
                    key={activeProject.id}
                    project={activeProject}
                    projects={projects}
                    publishedPosts={allPosts[activeProject.id] || []}
                    scheduledPosts={allScheduledPosts[activeProject.id] || []}
                    systemPosts={allSystemPosts[activeProject.id] || []}
                    notes={allNotes[activeProject.id] || []}
                    allGlobalVarDefs={allGlobalVarDefs}
                    allGlobalVarValues={allGlobalVarValues}
                    onUpdateProject={handleUpdateProjectSettings}
                    onNotesUpdate={handleNotesUpdate}
                    permissionErrorMessage={projectPermissionErrors[activeProject.id]}
                    emptyScheduleMessage={projectEmptyScheduleNotices[activeProject.id]}
                    onNavigateToContest={onNavigateToContest}
                    onNavigateToGeneralContest={onNavigateToGeneralContest}
                    onNavigateToAiPosts={onNavigateToAiPosts}
                />
            );
        }
        if (activeView === 'suggested') {
            return (
                <SuggestedPostsTab
                    key={activeProject.id}
                    project={activeProject}
                    cachedPosts={allSuggestedPosts[activeProject.id]}
                    onPostsLoaded={(posts) => {
                         setAllSuggestedPosts(prev => ({...prev, [activeProject.id]: posts}));
                    }}
                    permissionErrorMessage={projectPermissionErrors[activeProject.id]}
                    emptySuggestedMessage={projectEmptySuggestedNotices[activeProject.id]}
                />
            );
        }
        if (activeView === 'products') {
            return (
                <ProductsTab 
                    key={activeProject.id} 
                    project={activeProject}
                    permissionErrorMessage={projectPermissionErrors[activeProject.id]}
                />
            );
        }
    }
    
    if (activeModule === 'lists') {
        if (!activeProject) return <WelcomeScreen onGoToTraining={onGoToTraining} />;
        if (activeView === 'lists-system' || activeView === 'lists-automations') {
            return <SystemListsTab 
                project={activeProject} 
                activeListGroup={activeListGroup}
                onActiveListGroupChange={onActiveListGroupChange}
                activeView={activeView}
            />;
        }
         return <PlaceholderPage title="Раздел в разработке" message="Этот раздел скоро появится." />;
    }

    return <WelcomeScreen onGoToTraining={onGoToTraining} />;
};
