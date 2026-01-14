import React from 'react';

export const PostCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full animate-pulse">
            {/* Image ribbon placeholder */}
            <div className="flex space-x-2 pb-2 mb-2 border-b border-gray-200">
                <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 md:hidden lg:block"></div>
            </div>
            {/* Header placeholder */}
            <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            {/* Text placeholder */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            {/* Footer placeholder */}
            <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-9 bg-gray-300 rounded-md w-32"></div>
            </div>
        </div>
    );
};
