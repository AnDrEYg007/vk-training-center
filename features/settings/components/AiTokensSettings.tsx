
import React from 'react';
import { useAiTokens } from '../../users/hooks/useAiTokens';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { AiTokenLogsModal } from '../../users/components/ai-tokens/AiTokenLogsModal';
import { AiTokenStatsPanel } from '../../users/components/ai-tokens/AiTokenStatsPanel';
import { AiToken } from '../../../shared/types';

/**
 * Компонент настроек AI токенов.
 * Управление токенами для интеграции с AI сервисами (OpenAI, Gemini и др.).
 */
export const AiTokensSettings: React.FC = () => {
    const { state, actions } = useAiTokens();
    const { tokens, isLoading, isSaving, isVerifying, error, deleteConfirmation, tokenToShowLogs, envStats, expandedTokenId, verifyResults } = state;

    const inputClasses = "w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white";

    // Получение статуса токена (из verifyResults при проверке, иначе из БД)
    const getTokenStatus = (token: AiToken): { status: 'active' | 'error' | 'unknown', error?: string | null } => {
        // Сначала проверяем, есть ли свежий результат проверки
        const verifyResult = verifyResults.get(token.id);
        if (verifyResult) {
            return {
                status: verifyResult.is_valid ? 'active' : 'error',
                error: verifyResult.error
            };
        }
        // Иначе берём из данных токена (из БД)
        return {
            status: token.status || 'unknown',
            error: token.status_error
        };
    };

    // Подсчёт активных токенов
    const activeCount = tokens.filter(t => {
        const { status } = getTokenStatus(t);
        return status === 'active';
    }).length;

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок секции */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">AI Токены</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        активных {activeCount} из {tokens.length}
                    </span>
                </div>
                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={actions.handleVerifyTokens}
                        disabled={isVerifying || tokens.length === 0}
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50"
                        title="Проверить валидность всех токенов через Google API"
                    >
                        {isVerifying ? (
                            <>
                                <div className="loader border-blue-600 border-t-transparent h-4 w-4 mr-2"></div>
                                Проверка...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Проверить
                            </>
                        )}
                    </button>
                    <button 
                        type="button"
                        onClick={actions.handleAddToken}
                        className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50"
                        title="Добавить новый токен"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Добавить
                    </button>
                    <button 
                        type="button"
                        onClick={actions.handleSaveChanges}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center min-w-[100px]"
                        title="Сохранить изменения"
                    >
                        {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                    </button>
                </div>
            </div>
            
            {/* Контент */}
            <div className="flex-grow overflow-auto custom-scrollbar bg-white p-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : (
                    <>
                        {error && <div className="mb-4 text-center text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</div>}
                        
                        {/* Таблица токенов */}
                        <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-lg">
                            <table className="min-w-[1000px] w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0">
                                    <tr>
                                        <th className="w-8 px-2 py-3"></th>
                                        <th className="px-4 py-3">Описание</th>
                                        <th className="px-4 py-3">Токен</th>
                                        <th className="px-4 py-3 text-center w-24">Статус</th>
                                        <th className="px-4 py-3 text-center w-20">Успешно</th>
                                        <th className="px-4 py-3 text-center w-20">Ошибки</th>
                                        <th className="px-4 py-3 text-center w-16">Логи</th>
                                        <th className="px-4 py-3 text-right w-16">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {/* ENV TOKEN - первая строка */}
                                    <React.Fragment>
                                        <tr 
                                            className={`hover:bg-gray-50 cursor-pointer bg-slate-50 ${expandedTokenId === 'env' ? 'bg-indigo-50/30' : ''}`}
                                            onClick={() => actions.toggleRowExpand('env')}
                                        >
                                            <td className="px-2 py-2 text-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedTokenId === 'env' ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div>
                                                    <span className="font-medium text-indigo-900">ENV TOKEN (Основной)</span>
                                                    <p className="text-[10px] text-gray-500">Из .env файла</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-gray-400 text-xs font-mono">••••••••••••</span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                                    ENV
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`text-sm font-medium ${envStats.success ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {envStats.success}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`text-sm font-medium ${envStats.error ? 'text-red-600' : 'text-gray-400'}`}>
                                                    {envStats.error}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => actions.setTokenToShowLogs('env')}
                                                    className="text-gray-400 hover:text-indigo-600"
                                                    title="Посмотреть логи"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {/* ENV нельзя удалить */}
                                            </td>
                                        </tr>
                                        {expandedTokenId === 'env' && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan={8} className="p-0">
                                                    <AiTokenStatsPanel tokenId="env" />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>

                                    {/* Обычные токены */}
                                    {tokens.map((token) => {
                                        const isExpanded = expandedTokenId === token.id;
                                        const tokenStatus = getTokenStatus(token);
                                        return (
                                            <React.Fragment key={token.id}>
                                                <tr 
                                                    className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-indigo-50/30' : ''}`} 
                                                        onClick={() => actions.toggleRowExpand(token.id)}
                                                    >
                                                        <td className="px-2 py-2 text-center text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </td>
                                                        <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="text"
                                                                value={token.description || ''}
                                                                onChange={(e) => actions.handleTokenChange(token.id, 'description', e.target.value)}
                                                                className={inputClasses}
                                                                placeholder="Например: Gemini Pro (Основной)"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="text"
                                                                value={token.token}
                                                                onChange={(e) => actions.handleTokenChange(token.id, 'token', e.target.value)}
                                                                className={`${inputClasses} font-mono text-xs`}
                                                                placeholder="AIza..."
                                                            />
                                                        </td>
                                                        {/* Статус проверки токена */}
                                                        <td className="px-4 py-2 text-center">
                                                            {tokenStatus.status === 'unknown' ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                                    —
                                                                </span>
                                                            ) : tokenStatus.status === 'active' ? (
                                                                <span 
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                                                    title="Токен активен"
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                                    OK
                                                                </span>
                                                            ) : (
                                                                <span 
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 cursor-help"
                                                                    title={tokenStatus.error || 'Ошибка'}
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                                    ERR
                                                                </span>
                                                            )}
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
                                                                onClick={() => actions.setTokenToShowLogs(token)}
                                                                className="text-gray-400 hover:text-indigo-600"
                                                                title="Посмотреть логи"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-2 text-right" onClick={e => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => actions.handleRemoveToken(token.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="Удалить токен"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && (
                                                        <tr className="bg-gray-50/50">
                                                            <td colSpan={8} className="p-0">
                                                                <AiTokenStatsPanel tokenId={token.id} />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                    </>
                )}
            </div>

            {/* Модалка подтверждения удаления */}
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

            {/* Модалка логов токена */}
            {tokenToShowLogs && (
                <AiTokenLogsModal 
                    token={tokenToShowLogs} 
                    onClose={() => actions.setTokenToShowLogs(null)} 
                />
            )}
        </div>
    );
};
