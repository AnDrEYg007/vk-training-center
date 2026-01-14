import React from 'react';

interface PlaceholderPageProps {
    title: string;
    message: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
            <p className="mt-2 text-gray-500 max-w-md">{message}</p>
        </div>
    );
};