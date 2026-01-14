
import React from 'react';
import { AiToken } from '../../../../shared/types';
import { AiTokenStatsPanel } from './AiTokenStatsPanel';

interface AiTokensTableProps {
    tokens: AiToken[];
    onTokenChange: (id: string, field: keyof AiToken, value: string) => void;
    onRemoveToken: (id: string) => void;
    onShowLogs: (token: AiToken) => void;
    expandedTokenId: string | null;
    onToggleRowExpand: (id: string) => void;
}

export const AiTokensTable: React.FC<AiTokensTableProps> = ({ 
    tokens, onTokenChange, onRemoveToken, onShowLogs, 
    expandedTokenId, onToggleRowExpand 
}) => {
    const inputClasses = "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white";

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th scope="col" className="w-8 px-2"></th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Описание</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Токен</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Успешно</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Ошибки</th>
                        <th scope="col" className="w-24 px-4 py-3 text-center">Логи</th>
                        <th scope="col" className="w-10 px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {tokens.map((token, index) => {
                        const isExpanded = expandedTokenId === token.id;
                        return (
                            <React.Fragment key={token.id}>
                                <tr className={`border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''}`} onClick={() => onToggleRowExpand(token.id)}>
                                    <td className="px-2 text-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </td>
                                    <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={token.description || ''}
                                            onChange={(e) => onTokenChange(token.id, 'description', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Например: Gemini Pro (Основной)"
                                        />
                                    </td>
                                    <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={token.token}
                                            onChange={(e) => onTokenChange(token.id, 'token', e.target.value)}
                                            className={`${inputClasses} font-mono text-xs`}
                                            placeholder="AIza..."
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`text-sm font-medium ${token.stats?.success ? 'text-green-600' : 'text-gray-400'}`}>
                                            {token.stats?.success || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`text-sm font-medium ${token.stats?.error ? 'text-red-600' : 'text-gray-400'}`}>
                                            {token.stats?.error || 0}
                                        </span>
                                    </td>
                                     <td className="px-4 py-2 text-center" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => onShowLogs(token)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                            title="Посмотреть логи"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-right" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => onRemoveToken(token.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                                            title="Удалить токен"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50/30">
                                        <td colSpan={7} className="p-0">
                                            <AiTokenStatsPanel tokenId={token.id} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {tokens.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                                Нет добавленных токенов.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
