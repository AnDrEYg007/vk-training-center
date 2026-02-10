import React, { lazy, Suspense } from 'react';
import { Topic } from './TableOfContents';
import { PlaceholderPage } from './content/PlaceholderPage';
import { PostCardDeepDive } from './content/PostCardDeepDive';
import { SidebarNavDeepDive } from './content/SidebarNavDeepDive';
// Раздел 0: О Центре обучения
import { WhatIsTrainingCenter } from './content/section0/WhatIsTrainingCenter';
import { HowToUse } from './content/section0/HowToUse';
import { WhatYouWillLearn } from './content/section0/WhatYouWillLearn';
import { Purpose } from './content/section0/Purpose';
import { TargetAudience } from './content/section0/TargetAudience';
import { DocumentationStructure } from './content/section0/DocumentationStructure';
import { Navigation } from './content/section0/Navigation';
import { Sandboxes } from './content/section0/Sandboxes';
import { RealExamples } from './content/section0/RealExamples';
import { ContentManagement } from './content/section0/ContentManagement';
import { Products } from './content/section0/Products';
import { Automations } from './content/section0/Automations';
import { Administration } from './content/section0/Administration';
// Раздел 1: Введение в приложение
import { Overview } from './content/section1/Overview';
import { Tasks } from './content/section1/Tasks';
import { UseCases } from './content/section1/UseCases';
import { InterfaceOverview } from './content/section1/InterfaceOverview';
import { PrimarySidebarIntro } from './content/section1/PrimarySidebarIntro';
import { ProjectsSidebarIntro } from './content/section1/ProjectsSidebarIntro';
import { WorkspaceIntro } from './content/section1/WorkspaceIntro';

import { WelcomeScreenComponent } from './content/section1/WelcomeScreen';
import { ProjectsFirstStep } from './content/section1/ProjectsFirstStep';
// Раздел 2: Контент-менеджмент
import { ContentManagementOverview } from './content/section2/ContentManagementOverview';
import { SidebarProjectsContent } from './content/section2/SidebarProjectsContent';
import { StatusIndicators } from './content/section2/StatusIndicators';
import { ProjectListItems } from './content/section2/ProjectListItems';
import { PostCounters } from './content/section2/PostCounters';
import { FiltersAndSearch } from './content/section2/FiltersAndSearch';
import { SidebarNavOverview } from './content/section2/SidebarNavOverview';
import { ScheduleTabOverview } from './content/section2/ScheduleTabOverview';
import { DateNavigation } from './content/section2/DateNavigation';
import { ViewModes } from './content/section2/ViewModes';
import { VisibilityControls } from './content/section2/VisibilityControls';
import { RefreshButton } from './content/section2/RefreshButton';
import { BulkActions } from './content/section2/BulkActions';
import { CreateNoteButton } from './content/section2/CreateNoteButton';
import { CalendarHeaderOverview } from './content/section2/CalendarHeaderOverview';

// Lazy-загрузка для больших компонентов раздела календаря
const CalendarGrid = lazy(() => import('./content/section2/CalendarGrid').then(m => ({ default: m.CalendarGrid })));
const DayColumns = lazy(() => import('./content/section2/DayColumns').then(m => ({ default: m.DayColumns })));
const GridInteraction = lazy(() => import('./content/section2/GridInteraction').then(m => ({ default: m.GridInteraction })));
const DragAndDrop = lazy(() => import('./content/section2/DragAndDrop').then(m => ({ default: m.DragAndDrop })));
const QuickNote = lazy(() => import('./content/section2/QuickNote').then(m => ({ default: m.QuickNote })));

interface TopicContentProps {
    selectedTopic: Topic | null;
}

// Карта, сопоставляющая путь топика с его компонентом
const componentMap: Record<string, React.FC<{ title: string }>> = {
    // Раздел 0: О Центре обучения
    '0-about-training-center': WhatIsTrainingCenter, // Корневой раздел -> первая страница
    '0-1-what-is-training-center': WhatIsTrainingCenter,
    '0-1-1-purpose': Purpose,
    '0-1-2-target-audience': TargetAudience,
    '0-1-3-documentation-structure': DocumentationStructure,
    '0-2-how-to-use': HowToUse,
    '0-2-1-navigation': Navigation,
    '0-2-2-sandboxes': Sandboxes,
    '0-2-3-real-examples': RealExamples,
    '0-3-what-you-will-learn': WhatYouWillLearn,
    '0-3-1-content-management': ContentManagement,
    '0-3-2-products': Products,
    '0-3-3-automations': Automations,
    '0-3-4-administration': Administration,
    // Раздел 1: Введение в приложение
    '1-intro': Overview,
    '1-1-what-is': Overview,
    '1-1-1-overview': Overview,
    '1-1-2-tasks': Tasks,
    '1-1-3-use-cases': UseCases,
    '1-2-interface-overview': InterfaceOverview,
    '1-2-1-primary-sidebar-intro': PrimarySidebarIntro,
    '1-2-2-projects-sidebar-intro': ProjectsSidebarIntro,
    '1-2-3-workspace-intro': WorkspaceIntro,
    '1-4-welcome-screen': WelcomeScreenComponent,
    '1-5-projects-first-step': ProjectsFirstStep,
    // Раздел 2: Контент-менеджмент
    '2-content-management': ContentManagementOverview,
    '2-1-schedule': ScheduleTabOverview,
    '2-1-1-sidebar-nav': SidebarNavOverview,
    '2-1-1-1-project-list-items': ProjectListItems,
    '2-1-1-2-status-indicators': StatusIndicators,
    '2-1-1-3-post-counters': PostCounters,
    '2-1-1-4-filters-search': FiltersAndSearch,
    '2-1-2-calendar-header': CalendarHeaderOverview,
    '2-1-2-1-date-navigation': DateNavigation,
    '2-1-2-2-view-modes': ViewModes,
    '2-1-2-3-visibility-controls': VisibilityControls,
    '2-1-2-4-refresh-button': RefreshButton,
    '2-1-2-5-bulk-actions': BulkActions,
    '2-1-2-6-create-note-button': CreateNoteButton,
    '2-1-3-calendar-grid': CalendarGrid,
    '2-1-3-1-day-columns': DayColumns,
    '2-1-3-2-grid-interaction': GridInteraction,
    '2-1-3-3-drag-and-drop': DragAndDrop,
    '2-1-3-4-quick-note': QuickNote,
    '2-4-3-postcard-deep-dive': PostCardDeepDive,
    '2-1-sidebar-nav': SidebarNavDeepDive,
};


export const TopicContent: React.FC<TopicContentProps> = ({ selectedTopic }) => {
    if (!selectedTopic) {
        return (
            <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="mt-2 text-lg font-medium text-gray-900">Добро пожаловать в Центр обучения!</h2>
                <p className="mt-1 text-sm text-gray-500">Выберите тему из оглавления слева, чтобы начать.</p>
            </div>
        );
    }
    
    // Ищем соответствующий компонент в карте
    const ContentComponent = componentMap[selectedTopic.path];
    
    if (ContentComponent) {
        return (
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse text-gray-500">Загрузка...</div>
                </div>
            }>
                <ContentComponent title={selectedTopic.title} />
            </Suspense>
        );
    }

    // Если компонент не найден, показываем заглушку
    return <PlaceholderPage title={selectedTopic.title} />;
};
