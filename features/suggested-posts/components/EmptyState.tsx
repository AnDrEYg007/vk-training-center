import React from 'react';

interface EmptyStateProps {
    icon: 'empty' | 'error';
    title: string;
    message: string;
}

const icons = {
    empty: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
    ),
    error: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-10 bg-white rounded-lg border border-gray-200 mt-4">
            {icons[icon]}
            <h3 className={`mt-4 font-semibold ${icon === 'error' ? 'text-red-600' : 'text-gray-700'}`}>{title}</h3>
            <p className="text-sm mt-1 max-w-sm">{message}</p>
        </div>
    );
};
