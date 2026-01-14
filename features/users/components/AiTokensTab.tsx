
import React from 'react';
import { useAiTokens } from '../hooks/useAiTokens';
import { AiTokensHeader } from './ai-tokens/AiTokensHeader';
import { AiTokensTable } from './ai-tokens/AiTokensTable';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { AiTokenLogsModal } from './ai-tokens/AiTokenLogsModal';
import { AiTokenStatsPanel } from './ai-tokens/AiTokenStatsPanel';

export const AiTokensTab: React.FC = () => {
    const { state, actions } = useAiTokens();
    const { tokens, isLoading, isSaving, error, deleteConfirmation, tokenToShowLogs, envStats, expandedTokenId } = state;
    
    // Состояние для ENV статистики (разворачивание)
    const [isEnvExpanded, setIsEnvExpanded] = React.useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <AiTokensHeader 
                onAdd={actions.handleAddToken} 
                onSave={actions.handleSaveChanges} 
                isSaving={isSaving} 
            />
            
            <main className="flex-grow p-4 overflow-hidden flex flex-col custom-scrollbar overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : (
                    <>
                        <div className={`mb-4 bg-white rounded-lg shadow-sm border border-indigo-100 transition-all ${isEnvExpanded ? 'pb-0' : ''}`}>
                             <div 
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsEnvExpanded(!isEnvExpanded)}
                             >
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-400">
                                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isEnvExpanded ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">ENV TOKEN (Основной)</h3>
                                        <p className="text-xs text-gray-500">Токен из .env файла. Используется по умолчанию.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="text-sm">
                                        <span className="text-green-600 font-medium mr-3">Успешно: {envStats.success}</span>
                                        <span className="text-red-600 font-medium">Ошибки: {envStats.error}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); actions.setTokenToShowLogs('env'); }}
                                        className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                    >
                                        Посмотреть логи
                                    </button>
                                </div>
                            </div>
                            
                            {isEnvExpanded && (
                                <div className="border-t border-indigo-50">
                                     <AiTokenStatsPanel tokenId="env" />
                                </div>
                            )}
                        </div>
                        
                        {error && <div className="mb-4 text-center text-red-600 bg-red-50 p-2 rounded">{error}</div>}
                        
                        <AiTokensTable 
                            tokens={tokens} 
                            onTokenChange={actions.handleTokenChange} 
                            onRemoveToken={actions.handleRemoveToken}
                            onShowLogs={actions.setTokenToShowLogs}
                            expandedTokenId={expandedTokenId}
                            onToggleRowExpand={actions.toggleRowExpand}
                        />
                    </>
                )}
            </main>

            {deleteConfirmation && (
                <ConfirmationModal
                    title="Удалить токен?"
                    message={`Вы уверены, что хотите удалить токен "${deleteConfirmation.token.description || 'Без названия'}"? Это действие необратимо и будет применено при сохранении.`}
                    onConfirm={() => {
                        deleteConfirmation.onConfirm();
                        actions.setDeleteConfirmation(null);
                    }}
                    onCancel={() => actions.setDeleteConfirmation(null)}
                    confirmText="Да, удалить и сохранить"
                    cancelText="Отмена"
                    isConfirming={isSaving}
                    confirmButtonVariant="danger"
                />
            )}

            {tokenToShowLogs && (
                <AiTokenLogsModal 
                    token={tokenToShowLogs} 
                    onClose={() => actions.setTokenToShowLogs(null)} 
                />
            )}
        </div>
    );
};
