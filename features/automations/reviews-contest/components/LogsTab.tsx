
import React from 'react';

export const LogsTab: React.FC = () => {
    return (
        <div className="opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="bg-black/90 rounded-lg shadow border border-gray-700 overflow-hidden flex-grow flex flex-col text-gray-300 font-mono text-xs">
                <div className="p-2 border-b border-gray-700 bg-black flex justify-between items-center">
                    <h3 className="font-semibold text-gray-400">System Logs</h3>
                    <button className="text-gray-500 hover:text-white">Clear</button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar space-y-1">
                    <div className="flex gap-2">
                        <span className="text-gray-500">[14:30:05]</span>
                        <span className="text-blue-400">INFO:</span>
                        <span>Scanner started. Keyword: "#отзыв"</span>
                    </div>
                     <div className="flex gap-2">
                        <span className="text-gray-500">[14:30:12]</span>
                        <span className="text-green-400">SUCCESS:</span>
                        <span>Found new post id:12345 from User id:998877</span>
                    </div>
                     <div className="flex gap-2">
                        <span className="text-gray-500">[14:30:13]</span>
                        <span className="text-blue-400">INFO:</span>
                        <span>Comment posted. Number: 1</span>
                    </div>
                     <div className="flex gap-2">
                        <span className="text-gray-500">[14:35:00]</span>
                        <span className="text-green-400">SUCCESS:</span>
                        <span>Found new post id:12346 from User id:554433</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
