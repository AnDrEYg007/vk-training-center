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
import { PostsInCalendar } from './content/section2/PostsInCalendar';
import { PostTypes } from './content/section2/PostTypes';
import { PublishedPost } from './content/section2/PublishedPost';
import { DeferredPost } from './content/section2/DeferredPost';
import { SystemPost } from './content/section2/SystemPost';
import { SystemPostLifecycle } from './content/section2/SystemPostLifecycle';
import { Notes } from './content/section2/Notes';
import { CreateNote } from './content/section2/CreateNote';
import { EditNote } from './content/section2/EditNote';
import { ColorPalette } from './content/section2/ColorPalette';
import { ViewActions } from './content/section2/ViewActions';
import { Stories } from './content/section2/Stories';
import { StoriesDisplay } from './content/section2/StoriesDisplay';
import { StoriesViewer } from './content/section2/StoriesViewer';
import { PostModal } from './content/section2/PostModal';
import { GeneralMechanics } from './content/section2/GeneralMechanics';
import { PublicationMethod } from './content/section2/PublicationMethod';
import { BulkDates } from './content/section2/BulkDates';
import { MultiProject } from './content/section2/MultiProject';
import { TextEditing } from './content/section2/TextEditing';
import { AIAssistant } from './content/section2/AIAssistant';
import { Variables } from './content/section2/Variables';
import { EmojiPicker } from './content/section2/EmojiPicker';
import { MediaEditing } from './content/section2/MediaEditing';
import { ImageGalleryPage } from './content/section2/ImageGalleryPage';
import { CreateAlbumPage } from './content/section2/CreateAlbumPage';
import { FooterSaveButtonPage } from './content/section2/FooterSaveButtonPage';
// Раздел 2.1.8: Операции с постами
import { PostOperationsPage } from './content/section2/PostOperationsPage';
import { CreatePostPage } from './content/section2/CreatePostPage';
import { EditPostPage } from './content/section2/EditPostPage';
import { CopyPostPage } from './content/section2/CopyPostPage';
import { DeletePostPage } from './content/section2/DeletePostPage';
import { MovePostPage } from './content/section2/MovePostPage';
import { BulkSelectionPage } from './content/section2/BulkSelectionPage';
import { PublishNowPage } from './content/section2/PublishNowPage';
// Раздел 2.2: Вкладка "Предложенные"
import { SuggestedPostsOverview } from './content/section2/SuggestedPostsOverview';
import { SuggestedPostsInterfaceOverview } from './content/section2/SuggestedPostsInterfaceOverview';
import { ImageRibbonPage } from './content/section2/ImageRibbonPage';
import { SuggestedPostCardPage } from './content/section2/SuggestedPostCardPage';
import { AiEditorPage } from './content/section2/AiEditorPage';
import { AcceptRejectPage } from './content/section2/AcceptRejectPage';
import { ScheduleSuggestedPostPage } from './content/section2/ScheduleSuggestedPostPage';
// Раздел 2.3: Вкладка "Товары"
import { ProductsIntroPage } from './content/section2/ProductsIntroPage';
import { ProductsOverviewPage } from './content/section2/ProductsOverviewPage';
import { ProductsTableIntroPage } from './content/section2/ProductsTableIntroPage';
import { 
    ProductsTableColumnsPage,
    ProductsColumnVisibilityPage,
    ProductsSearchPage,
    ProductsAlbumFiltersPage,
    ProductsCategoryFiltersPage,
    ProductsCreateIntroPage,
    ProductsCreateSinglePage,
    ProductsCreateMultiplePage,
    ProductsPasteClipboardPage,
    ProductsImportExportIntroPage,
    ProductsImportFilePage,
    ProductsColumnMappingPage,
    ProductsUpdateFromFilePage,
    ProductsExportCsvPage,
    ProductsExportXlsxPage,
    ProductsBulkEditIntroPage,
    ProductsBulkPricePage,
    ProductsBulkOldPricePage,
    ProductsBulkTitlePage,
    ProductsBulkDescriptionPage,
    ProductsBulkAlbumPage,
    ProductsBulkCategoryPage,
    ProductsImportExportPage,
    ProductsBulkEditPage,
    ProductsAICategoriesPage,
    ProductsDescriptionEditorPage,
    ProductsDiffViewerPage,
    ProductsSaveResultsPage
} from './content/section2/ProductsSubpages';
// Раздел 2.4: Автоматизации
import { ProductsAutomationsPage } from './content/section2/ProductsAutomationsPage';
import { ProductsStoriesAutomationPage } from './content/section2/ProductsStoriesAutomationPage';
import { ProductsStoriesOverviewPage } from './content/section2/ProductsStoriesOverviewPage';
import { ProductsStoriesSettingsPage } from './content/section2/ProductsStoriesSettingsPage';
import { ProductsStoriesStatsPage } from './content/section2/ProductsStoriesStatsPage';
import { ProductsStoriesDashboardPage } from './content/section2/ProductsStoriesDashboardPage';
import { ProductsReviewsContestPage } from './content/section2/ProductsReviewsContestPage';
import { ProductsReviewsContestOverviewPage } from './content/section2/ProductsReviewsContestOverviewPage';
import { ProductsReviewsContestSettingsPage } from './content/section2/ProductsReviewsContestSettingsPage';
import { ProductsReviewsContestParticipantsPage } from './content/section2/ProductsReviewsContestParticipantsPage';
import { ProductsReviewsContestWinnersPage } from './content/section2/ProductsReviewsContestWinnersPage';
import { ProductsReviewsContestPromocodesPage } from './content/section2/ProductsReviewsContestPromocodesPage';
import { ProductsReviewsContestSendingListPage } from './content/section2/ProductsReviewsContestSendingListPage';
import { ProductsReviewsContestBlacklistPage } from './content/section2/ProductsReviewsContestBlacklistPage';
import { ProductsReviewsContestPostsPage } from './content/section2/ProductsReviewsContestPostsPage';
import { ProductsReviewsContestLogsPage } from './content/section2/ProductsReviewsContestLogsPage';
import { PromoDropPage } from './content/section2/PromoDropPage';
import { PromoDropOverviewPage } from './content/section2/PromoDropOverviewPage';
import { PromoDropSettingsPage } from './content/section2/PromoDropSettingsPage';
// Раздел 2.4.4: Универсальные конкурсы
import { GeneralContestsIndexPage } from './content/section2/GeneralContestsIndexPage';
import { GeneralContestsOverview } from './content/section2/GeneralContestsOverview';
import { GeneralContestsListPage } from './content/section2/GeneralContestsListPage';
import { GeneralContestsCreate } from './content/section2/GeneralContestsCreate';
import { GeneralContestsEditor } from './content/section2/GeneralContestsEditor';
import { GeneralContestsConditions } from './content/section2/GeneralContestsConditions';
import GeneralContestsSettingsPage from './content/section2/GeneralContestsSettingsPage';
import GeneralContestsParticipantsPage from './content/section2/GeneralContestsParticipantsPage';
import { GeneralContestsWinnersPage } from './content/section2/GeneralContestsWinnersPage';
import { GeneralContestsPromocodesPage } from './content/section2/GeneralContestsPromocodesPage';
import { GeneralContestsSendingListPage } from './content/section2/GeneralContestsSendingListPage';
import { GeneralContestsBlacklistPage } from './content/section2/GeneralContestsBlacklistPage';
import { GeneralContestsPreviewPage } from './content/section2/GeneralContestsPreviewPage';
import { 
  GeneralContestsWinners,
  GeneralContestsPromocodes,
  GeneralContestsSendingList,
  GeneralContestsBlacklist,
  GeneralContestsPreview
} from './content/section2/GeneralContestsOtherTabs';
// Обновлено: Добавлена главная страница раздела "Универсальные конкурсы"
// Раздел 2.4.5: AI посты
import { AiPostsIndexPage } from './content/section2/AiPostsIndexPage';
import { AiPostsOverviewPage } from './content/section2/AiPostsOverviewPage';
import { AiPostsListPage } from './content/section2/AiPostsListPage';
import { AiPostsCreatePage } from './content/section2/AiPostsCreatePage';
import { AiPostsEditorPage } from './content/section2/AiPostsEditorPage';
// Раздел 2.4.6: Поздравления с ДР
import { BirthdayIndexPage } from './content/section2/BirthdayIndexPage';
import { BirthdayOverviewPage } from './content/section2/BirthdayOverviewPage';
import { BirthdaySettingsPage } from './content/section2/BirthdaySettingsPage';
// Раздел 2.4.7: Конкурс "Актив"
import { ActivityContestIndexPage } from './content/section2/ActivityContestIndexPage';
import { ActivityContestOverviewPage } from './content/section2/ActivityContestOverviewPage';
import { ActivityContestSettingsPage } from './content/section2/ActivityContestSettingsPage';

// Lazy-загрузка для больших компонентов раздела календаря
const CalendarGrid = lazy(async () => {
  const module = await import('./content/section2/CalendarGrid');
  return { default: module.CalendarGrid };
});
const DayColumns = lazy(async () => {
  const module = await import('./content/section2/DayColumns');
  return { default: module.DayColumns };
});
const GridInteraction = lazy(async () => {
  const module = await import('./content/section2/GridInteraction');
  return { default: module.GridInteraction };
});
const DragAndDrop = lazy(async () => {
  const module = await import('./content/section2/DragAndDrop');
  return { default: module.DragAndDrop };
});
const QuickNote = lazy(async () => {
  const module = await import('./content/section2/QuickNote');
  return { default: module.QuickNote };
});

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
    '2-1-4-posts-in-calendar': PostsInCalendar,
    '2-1-4-1-post-types': PostTypes,
    '2-1-4-2-published-post': PublishedPost,
    '2-1-4-3-deferred-post': DeferredPost,
    '2-1-4-4-system-post': SystemPost,
    '2-1-4-5-system-post-lifecycle': SystemPostLifecycle,
    '2-1-4-6-postcard-deep-dive': PostCardDeepDive,
    '2-4-3-postcard-deep-dive': PostCardDeepDive, // Старый путь (для обратной совместимости)
    '2-1-5-notes': Notes,
    '2-1-5-1-create-note': CreateNote,
    '2-1-5-2-edit-note': EditNote,
    '2-1-5-3-color-palette': ColorPalette,
    '2-1-5-4-view-actions': ViewActions,
    '2-1-6-stories': Stories,
    '2-1-6-1-stories-display': StoriesDisplay,
    '2-1-6-2-stories-viewer': StoriesViewer,
    '2-1-7-post-modal': PostModal,
    '2-1-7-1-general-mechanics': GeneralMechanics,
    '2-1-7-2-publication-method': PublicationMethod,
    '2-1-7-3-bulk-dates': BulkDates,
    '2-1-7-4-multi-project': MultiProject,
    '2-1-7-5-text-editing': TextEditing,
    '2-1-7-6-ai-assistant': AIAssistant,
    '2-1-7-7-variables': Variables,
    '2-1-7-8-emoji-picker': EmojiPicker,
    '2-1-7-9-media-editing': MediaEditing,
    '2-1-7-10-image-gallery': ImageGalleryPage,
    '2-1-7-11-create-album': CreateAlbumPage,
    '2-1-7-12-footer-save-button': FooterSaveButtonPage,
    '2-1-8-post-operations': PostOperationsPage,
    '2-1-8-1-create': CreatePostPage,
    '2-1-8-2-edit': EditPostPage,
    '2-1-8-3-copy': CopyPostPage,
    '2-1-8-4-delete': DeletePostPage,
    '2-1-8-5-move': MovePostPage,
    '2-1-8-6-bulk-selection': BulkSelectionPage,
    '2-1-8-7-publish-now': PublishNowPage,
    '2-1-sidebar-nav': SidebarNavDeepDive,
    // Раздел 2.2: Вкладка "Предложенные"
    '2-2-suggested': SuggestedPostsOverview,
    '2-2-1-overview': SuggestedPostsInterfaceOverview,
    '2-2-2-image-ribbon': ImageRibbonPage,
    '2-2-3-suggested-post-card': SuggestedPostCardPage,
    '2-2-4-ai-editor': AiEditorPage,
    '2-2-5-accept-reject': AcceptRejectPage,
    '2-2-6-schedule-suggested': ScheduleSuggestedPostPage,
    // Раздел 2.3: Вкладка "Товары"
    '2-3-products': ProductsIntroPage,
    '2-3-1-overview': ProductsOverviewPage,
    '2-3-2-products-table': ProductsTableIntroPage,
    '2-3-2-1-columns': ProductsTableColumnsPage,
    '2-3-2-2-column-visibility': ProductsColumnVisibilityPage,
    '2-3-2-3-sort-search': ProductsSearchPage,
    '2-3-3-album-filters': ProductsAlbumFiltersPage,
    '2-3-4-category-filters': ProductsCategoryFiltersPage,
    '2-3-5-create-products': ProductsCreateIntroPage,
    '2-3-5-1-create-single': ProductsCreateSinglePage,
    '2-3-5-2-create-multiple': ProductsCreateMultiplePage,
    '2-3-5-3-paste-clipboard': ProductsPasteClipboardPage,
    '2-3-6-import-export': ProductsImportExportIntroPage,
    '2-3-6-1-import-file': ProductsImportFilePage,
    '2-3-6-2-column-mapping': ProductsColumnMappingPage,
    '2-3-6-3-update-from-file': ProductsUpdateFromFilePage,
    '2-3-6-4-export-csv': ProductsExportCsvPage,
    '2-3-6-5-export-xlsx': ProductsExportXlsxPage,
    '2-3-7-bulk-edit': ProductsBulkEditIntroPage,
    '2-3-7-1-bulk-price': ProductsBulkPricePage,
    '2-3-7-2-bulk-old-price': ProductsBulkOldPricePage,
    '2-3-7-3-bulk-title': ProductsBulkTitlePage,
    '2-3-7-4-bulk-description': ProductsBulkDescriptionPage,
    '2-3-7-5-bulk-album': ProductsBulkAlbumPage,
    '2-3-7-6-bulk-category': ProductsBulkCategoryPage,
    '2-3-8-ai-category': ProductsAICategoriesPage,
    '2-3-9-description-editor': ProductsDescriptionEditorPage,
    '2-3-10-diff-viewer': ProductsDiffViewerPage,
    '2-3-11-save-results': ProductsSaveResultsPage,
    // Раздел 2.4: Автоматизации
    '2-4-automations': ProductsAutomationsPage,
    '2-4-1-stories-automation': ProductsStoriesAutomationPage,
    '2-4-1-1-overview': ProductsStoriesOverviewPage,
    '2-4-1-2-settings': ProductsStoriesSettingsPage,
    '2-4-1-3-stats': ProductsStoriesStatsPage,
    '2-4-1-4-dashboard': ProductsStoriesDashboardPage,
    '2-4-2-reviews-contest': ProductsReviewsContestPage,
    '2-4-2-1-overview': ProductsReviewsContestOverviewPage,
    '2-4-2-2-settings': ProductsReviewsContestSettingsPage,
    '2-4-2-3-participants': ProductsReviewsContestParticipantsPage,
    '2-4-2-4-winners': ProductsReviewsContestWinnersPage,
    '2-4-2-5-promocodes': ProductsReviewsContestPromocodesPage,
    '2-4-2-6-sending-list': ProductsReviewsContestSendingListPage,
    '2-4-2-7-blacklist': ProductsReviewsContestBlacklistPage,
    '2-4-2-8-posts': ProductsReviewsContestPostsPage,
    '2-4-2-9-logs': ProductsReviewsContestLogsPage,
    '2-4-3-promo-drop': PromoDropPage,
    '2-4-3-1-overview': PromoDropOverviewPage,
    '2-4-3-2-settings': PromoDropSettingsPage,
    // Раздел 2.4.4: Универсальные конкурсы
    '2-4-4-general-contests': GeneralContestsIndexPage,
    '2-4-4-1-overview': GeneralContestsOverview,
    '2-4-4-2-contests-list': GeneralContestsListPage,
    '2-4-4-3-create': GeneralContestsCreate,
    '2-4-4-4-editor': GeneralContestsEditor,
    '2-4-4-5-conditions': GeneralContestsConditions,
    '2-4-4-6-settings': GeneralContestsSettingsPage,
    '2-4-4-7-participants': GeneralContestsParticipantsPage,
    '2-4-4-8-winners': GeneralContestsWinnersPage,
    '2-4-4-9-promocodes': GeneralContestsPromocodesPage,
    '2-4-4-10-sending-list': GeneralContestsSendingListPage,
    '2-4-4-11-blacklist': GeneralContestsBlacklistPage,
    '2-4-4-12-preview': GeneralContestsPreviewPage,
    // Раздел 2.4.5: AI посты
    '2-4-5-ai-posts': AiPostsIndexPage,
    '2-4-5-1-overview': AiPostsOverviewPage,
    '2-4-5-2-list': AiPostsListPage,
    '2-4-5-3-create': AiPostsCreatePage,
    '2-4-5-4-editor': AiPostsEditorPage,
    // Раздел 2.4.6: Поздравления с ДР
    '2-4-6-birthday': BirthdayIndexPage,
    '2-4-6-1-overview': BirthdayOverviewPage,
    '2-4-6-2-settings': BirthdaySettingsPage,
    // Раздел 2.4.7: Конкурс "Актив"
    '2-4-7-activity-contest': ActivityContestIndexPage,
    '2-4-7-1-overview': ActivityContestOverviewPage,
    '2-4-7-2-settings': ActivityContestSettingsPage,
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
