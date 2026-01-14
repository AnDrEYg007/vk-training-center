import React, { useState } from 'react';
import { TableOfContents, Topic } from './TableOfContents';
import { TopicContent } from './TopicContent';
import { toc } from '../data/tocData';

export const TrainingPage: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Центр обучения</h1>
                    <p className="text-sm text-gray-500">Руководства и документация по работе с планировщиком контента</p>
                </div>
            </header>
            <main className="flex-grow flex overflow-hidden p-4 sm:p-6 lg:p-8 gap-6">
                <aside className="w-80 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto custom-scrollbar flex-shrink-0 shadow-sm">
                    <TableOfContents 
                        toc={toc} 
                        selectedTopic={selectedTopic} 
                        onSelectTopic={setSelectedTopic} 
                    />
                </aside>
                <section className="flex-1 p-8 lg:p-10 overflow-y-auto custom-scrollbar bg-white border border-gray-200 rounded-lg shadow-sm">
                    <TopicContent selectedTopic={selectedTopic} />
                </section>
            </main>
        </div>
    );
};