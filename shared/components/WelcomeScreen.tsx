import React from 'react';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700">Добро пожаловать!</h2>
            <p className="mt-2 text-gray-500 max-w-md">Выберите проект из списка слева, чтобы просмотреть его расписание, или воспользуйтесь фильтрами для поиска.</p>
        </div>
    );
};
