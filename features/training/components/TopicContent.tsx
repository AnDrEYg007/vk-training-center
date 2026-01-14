import React from 'react';
import { Topic } from './TableOfContents';
import { PlaceholderPage } from './content/PlaceholderPage';
import { PostCardDeepDive } from './content/PostCardDeepDive'; // Импортируем новый компонент
import { SidebarNavDeepDive } from './content/SidebarNavDeepDive';

interface TopicContentProps {
    selectedTopic: Topic | null;
}

// Карта, сопоставляющая путь топика с его компонентом
const componentMap: Record<string, React.FC<{ title: string }>> = {
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
        return <ContentComponent title={selectedTopic.title} />;
    }

    // Если компонент не найден, показываем заглушку
    return <PlaceholderPage title={selectedTopic.title} />;
};
