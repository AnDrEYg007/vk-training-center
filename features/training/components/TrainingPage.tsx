import React, { useState } from 'react';
import { TableOfContents, Topic } from './TableOfContents';
import { TopicContent } from './TopicContent';
import { toc } from '../data/tocData';
import { TrainingNavigationProvider } from '../contexts/TrainingNavigationContext';

export const TrainingPage: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    return (
        <TrainingNavigationProvider onSelectTopic={setSelectedTopic}>
            <div className="flex flex-col h-full bg-white">
                <header className="flex-shrink-0 border-b border-gray-200">
                    <div className="px-4 py-3">
                        <h1 className="text-xl font-bold text-gray-800">Центр обучения</h1>
                        <p className="text-sm text-gray-500">Руководства и документация по работе с планировщиком контента</p>
                    </div>
                </header>
                <main className="flex-grow flex overflow-hidden">
                    <aside className="w-72 border-r border-gray-200 p-3 overflow-y-auto custom-scrollbar flex-shrink-0">
                        <TableOfContents 
                            toc={toc} 
                            selectedTopic={selectedTopic} 
                            onSelectTopic={setSelectedTopic} 
                        />
                    </aside>
                    <section className="flex-1 px-8 py-6 overflow-y-auto custom-scrollbar">
                        <TopicContent selectedTopic={selectedTopic} />
                    </section>
                </main>
            </div>
        </TrainingNavigationProvider>
    );
};