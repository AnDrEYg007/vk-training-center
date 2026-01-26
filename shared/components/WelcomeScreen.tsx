import React from 'react';

interface WelcomeScreenProps {
    /** Колбэк для перехода в центр обучения */
    onGoToTraining?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGoToTraining }) => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700">Добро пожаловать!</h2>
            <p className="mt-2 text-gray-500 max-w-md">Выберите проект из списка слева, чтобы просмотреть его расписание, или воспользуйтесь фильтрами для поиска.</p>
            
            {/* Блок для новых пользователей с ссылкой на центр обучения */}
            {onGoToTraining && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 max-w-md">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎓</span>
                        <div className="text-left">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Впервые здесь?</span> Загляните в наш Центр обучения — там есть всё, чтобы быстро разобраться в системе.
                            </p>
                            <button
                                onClick={onGoToTraining}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Перейти в Центр обучения
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
