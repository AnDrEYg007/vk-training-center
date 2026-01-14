import React from 'react';

interface DatabaseSettingsButtonProps {
    onClick: () => void;
    isActive: boolean;
}

export const DatabaseSettingsButton: React.FC<DatabaseSettingsButtonProps> = ({ onClick, isActive }) => {
    return (
        <button
            onClick={onClick}
            title="Управление базой проектов"
            className={`p-2 rounded-full transition-colors ${
                isActive 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" />
            </svg>
        </button>
    );
};
