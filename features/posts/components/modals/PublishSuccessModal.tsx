import React from 'react';
import { Project } from '../../../../shared/types';

export const PublishSuccessModal: React.FC<{ project: Project, onClose: () => void }> = ({ project, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4 animate-fade-in-up text-center">
                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                 <h2 className="text-lg font-semibold text-gray-800">Успешно!</h2>
                 <p className="text-sm text-gray-600">Пост опубликован в сообществе "{project.vkGroupName}".</p>
                 <div className="flex justify-center gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Закрыть</button>
                    <a href={project.vkLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Перейти в сообщество</a>
                </div>
            </div>
        </div>
    );
};