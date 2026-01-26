import React, { useState, useEffect } from 'react';
import { AppView, AppModule } from '../../../App';
import { useAuth } from '../../auth/contexts/AuthContext';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    isActive?: boolean;
    children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ label, isActive, children, ...props }) => (
    <button
        title={label}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 ${
            isActive 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
        }`}
        {...props}
    >
        {children}
    </button>
);

interface PrimarySidebarProps {
    userRole: 'admin' | 'user';
    activeModule: AppModule | null;
    activeView: AppView;
    onSelectModule: (module: AppModule) => void;
    onSelectView: (view: AppView) => void;
    onSelectListsView: (view: AppView) => void;
    onSelectGlobalView: (view: AppView) => void;
}

export const PrimarySidebar: React.FC<PrimarySidebarProps> = ({
    userRole,
    activeModule,
    activeView,
    onSelectModule,
    onSelectView,
    onSelectListsView,
    onSelectGlobalView,
}) => {
    const { logout } = useAuth();
    const isKmActive = activeModule === 'km';
    const isListsActive = activeModule === 'lists';
    
    const isAutomationsGroupActive = activeView.startsWith('automations');
    // ИЗМЕНЕНИЕ: Секция развернута по умолчанию (true), даже если активна другая вкладка
    const [isAutomationsOpen, setIsAutomationsOpen] = useState(true);

    useEffect(() => {
        // Автоматически открываем аккордеон, если выбрана одна из его вкладок (на всякий случай)
        if (activeView.startsWith('automations')) {
            setIsAutomationsOpen(true);
        }
    }, [activeView]);

    const handleAutomationsClick = () => {
        // Если выбрана дочерняя вкладка, клик на родителя переводит на основную вкладку автоматизаций
        if (activeView.startsWith('automations-')) {
            onSelectView('automations');
        } 
        // Если мы не в разделе автоматизаций, переходим туда
        else if (activeView !== 'automations') {
            onSelectView('automations');
        } 
        // Если мы уже на основной вкладке автоматизаций, просто сворачиваем/разворачиваем
        else {
            setIsAutomationsOpen(prev => !prev);
        }
    };


    return (
        // Главный контейнер теперь - flex-контейнер, его ширина определяется содержимым.
        <div className="flex-shrink-0 bg-white border-r border-gray-200 flex z-30 shadow-sm">

            {/* Колонка 1: Основные иконки. Фиксированная ширина, чтобы иконки не "прыгали". */}
            <div className="w-16 flex-shrink-0 flex flex-col items-center justify-between py-4">
                {/* Верхняя группа: Модули */}
                <div className="space-y-4">
                    <IconButton label="Контент-менеджмент" isActive={isKmActive} onClick={() => onSelectModule('km')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </IconButton>
                    <IconButton label="Списки" isActive={isListsActive} onClick={() => onSelectModule('lists')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </IconButton>
                    <IconButton label="Работа с сообщениями (в разработке)" isActive={activeModule === 'am'} onClick={() => onSelectModule('am')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </IconButton>
                    <IconButton label="Статистика (в разработке)" isActive={activeModule === 'stats'} onClick={() => onSelectModule('stats')}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </IconButton>
                </div>

                {/* Нижняя группа: Глобальные действия */}
                <div className="space-y-4">
                     <IconButton label="VK Auth Integration Test" isActive={activeView === 'vk-auth-test'} onClick={() => onSelectGlobalView('vk-auth-test')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                     </IconButton>

                     <IconButton label="Управление базой проектов" isActive={activeView === 'db-management'} onClick={() => onSelectGlobalView('db-management')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" /></svg>
                     </IconButton>

                     {userRole === 'admin' && (
                        <IconButton label="Управление пользователями" isActive={activeView === 'user-management'} onClick={() => onSelectGlobalView('user-management')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </IconButton>
                     )}

                     <IconButton label="Центр обучения" isActive={activeView === 'training'} onClick={() => onSelectGlobalView('training')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
                     </IconButton>

                    <IconButton label="Настройки" isActive={activeView === 'settings'} onClick={() => onSelectGlobalView('settings')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </IconButton>

                     <IconButton label="Выйти" onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     </IconButton>
                </div>
            </div>

            {/* Колонка 2: Под-меню. Анимируется через max-width для адаптивной ширины. */}
            <div className={`flex-shrink-0 border-l border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${(isKmActive || isListsActive) ? 'max-w-xs' : 'max-w-0'}`}>
                {/* Внутренний контейнер. Его ширина теперь зафиксирована для предотвращения смещения макета. */}
                 <div className="py-4 px-2 flex flex-col h-full w-40">
                    
                    {/* Под-меню для Контент-менеджмента */}
                    {isKmActive && (
                        <>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">Контент</p>
                            <div className="space-y-2 w-full">
                                <button onClick={() => onSelectView('schedule')} title="Отложенные" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'schedule' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Отложенные
                                </button>
                                <button onClick={() => onSelectView('suggested')} title="Предложенные" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'suggested' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Предложенные
                                </button>
                                <button onClick={() => onSelectView('products')} title="Товары" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'products' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Товары
                                </button>
                                
                                {/* Аккордеон "Автоматизации" */}
                                <div>
                                    <button 
                                        onClick={handleAutomationsClick} 
                                        title="Автоматизации" 
                                        className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap flex justify-between items-center ${
                                            isAutomationsGroupActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>Автоматизации</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isAutomationsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAutomationsOpen ? 'max-h-72' : 'max-h-0'}`}>
                                        <div className="pl-4 pt-1 space-y-1">
                                            <button onClick={() => onSelectView('automations-stories')} title="Посты в истории" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-stories' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                Посты в истории
                                            </button>
                                            <button onClick={() => onSelectView('automations-reviews-contest')} title="Конкурс отзывов" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-reviews-contest' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                Конкурс отзывов
                                            </button>
                                            <button onClick={() => onSelectView('automations-promo-drop')} title="Дроп промокодов" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-promo-drop' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                Дроп промокодов
                                            </button>
                                             {/* Новые пункты */}
                                            <button onClick={() => onSelectView('automations-contests')} title="Конкурсы" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-contests' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                Конкурсы
                                            </button>
                                            <button onClick={() => onSelectView('automations-ai-posts')} title="AI посты" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-ai-posts' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                AI посты
                                            </button>
                                            <button onClick={() => onSelectView('automations-birthday')} title="С др" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-birthday' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                С др
                                            </button>
                                            <button onClick={() => onSelectView('automations-activity-contest')} title="Конкурс Актив" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'automations-activity-contest' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                Конкурс Актив
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Под-меню для Списков */}
                    {isListsActive && (
                        <>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">Списки</p>
                            <div className="space-y-2 w-full">
                                <button onClick={() => onSelectListsView('lists-system')} title="Системные" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'lists-system' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Системные
                                </button>
                                <button onClick={() => onSelectListsView('lists-user')} title="Пользовательские" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'lists-user' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Пользовательские
                                </button>
                                <button onClick={() => onSelectListsView('lists-automations')} title="Автоматизации" className={`w-full text-left p-2 rounded-md text-sm transition-colors whitespace-nowrap ${activeView === 'lists-automations' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    Автоматизации
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};