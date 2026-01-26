
import React from 'react';
import { AddSystemAccountsModal } from '../../users/components/modals/AddSystemAccountsModal';
import { AuthorizeAccountModal } from '../../users/components/modals/AuthorizeAccountModal';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { useSystemAccounts } from '../../users/hooks/useSystemAccounts';
import { AccountStatsPanel } from '../../users/components/system-accounts/AccountStatsPanel';
import { SystemAccount } from '../../../shared/types';

export const SystemPagesSettings: React.FC = () => {
    const { state, actions } = useSystemAccounts();

    const {
        accounts, isLoading, isSaving, error, isAddModalOpen,
        expandedAccountId, editingTokenId, accountToDelete, accountToAuthorize,
        editedAccounts, isCheckingTokens, checkingAccountIds
    } = state;

    const maskToken = (token: string | null | undefined) => {
        if (!token) return '';
        if (token.length <= 20) return '****';
        return `${token.substring(0, 10)}****${token.substring(token.length - 8)}`;
    };

    const getStatusBadge = (status?: string, isChecking?: boolean) => {
        if (isChecking) {
            return (
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
                    <div className="loader w-3 h-3 border-2 border-indigo-600 border-t-transparent mr-1.5"></div>
                    Проверка...
                </div>
            );
        }
        
        if (status === 'active') {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Активен</span>;
        } else if (status === 'error') {
             return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ошибка</span>;
        } else {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Неизвестно</span>;
        }
    };

    const hasChanges = Object.keys(editedAccounts).length > 0;

    // Подсчёт активных аккаунтов
    const activeCount = accounts.filter(a => a.status === 'active').length;
    const totalCount = accounts.length;

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок с кнопками управления */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">Системные страницы</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        активных {activeCount} из {totalCount}
                    </span>
                    {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => actions.handleCheckTokens(false, false)}
                        disabled={isCheckingTokens || isLoading || accounts.length === 0}
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50"
                        title="Проверить валидность всех токенов"
                    >
                        {isCheckingTokens ? (
                            <>
                                <div className="loader w-4 h-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                                Проверка...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Проверить
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => actions.setIsAddModalOpen(true)}
                        disabled={isSaving || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Добавить
                    </button>
                    <button
                        onClick={actions.handleSave}
                        disabled={isSaving || !hasChanges}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center min-w-[100px]"
                    >
                        {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                    </button>
                </div>
            </div>

            {/* Контент */}
            <div className="flex-grow overflow-auto custom-scrollbar p-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        Нет добавленных системных страниц. Нажмите "Добавить списком".
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar bg-white rounded-lg shadow border border-gray-200">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th scope="col" className="w-8 px-2"></th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Фото</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">ФИО (из VK)</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID VK</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Ссылка на профиль</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Статус</th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Успешно</th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Ошибки</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Токен</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {accounts.map((acc) => {
                                    const currentData = editedAccounts[acc.id] || acc;
                                    const isEditing = editingTokenId === acc.id;
                                    const isExpanded = expandedAccountId === acc.id;
                                    const isEnv = acc.id === 'env';
                                    const isChecking = checkingAccountIds.has(acc.id);
                                    
                                    return (
                                    <React.Fragment key={acc.id}>
                                        <tr 
                                            onClick={() => actions.toggleRowExpand(acc.id)}
                                            className={`border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''} ${isEnv ? 'bg-slate-50' : ''}`}
                                        >
                                            <td className="px-2 text-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </td>
                                            <td className="px-4 py-2 align-middle">
                                                <div className="flex justify-center">
                                                    {acc.avatar_url ? (
                                                        <img src={acc.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                    ) : isEnv ? (
                                                         <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 align-middle">
                                                <span className={`text-sm font-medium ${isEnv ? 'text-indigo-900' : 'text-gray-800'}`}>{acc.full_name}</span>
                                                {isEnv && <p className="text-[10px] text-gray-500">Из .env файла</p>}
                                            </td>
                                            <td className="px-4 py-2 align-middle">
                                                <span className="text-sm text-gray-600">{acc.vk_user_id !== '0' ? acc.vk_user_id : '-'}</span>
                                            </td>
                                            <td className="px-4 py-2 align-middle">
                                                {isEnv || !acc.profile_url.startsWith('http') ? (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                ) : (
                                                    <a href={acc.profile_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-sm text-indigo-600 hover:text-indigo-800 truncate block max-w-[180px]">
                                                        {acc.profile_url}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 align-middle">
                                                {getStatusBadge(currentData.status, isChecking)}
                                            </td>
                                            <td className="px-4 py-2 align-middle text-center">
                                                <span className={`text-sm font-medium ${acc.stats?.success ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {acc.stats?.success || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 align-middle text-center">
                                                <span className={`text-sm font-medium ${acc.stats?.error ? 'text-red-600' : 'text-gray-400'}`}>
                                                    {acc.stats?.error || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 align-middle" onClick={e => e.stopPropagation()}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={currentData.token || ''}
                                                        onChange={(e) => actions.handleAccountChange(acc.id, 'token', e.target.value)}
                                                        onBlur={() => actions.setEditingTokenId(null)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') actions.setEditingTokenId(null); }}
                                                        autoFocus
                                                        placeholder="Вставьте токен или ссылку..."
                                                        className="w-full p-1.5 border border-indigo-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
                                                    />
                                                ) : (
                                                    <div 
                                                        className={`w-full p-1.5 border border-gray-200 rounded-md bg-gray-50 text-gray-500 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap ${isEnv ? 'cursor-default opacity-70' : 'cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'} transition-colors`}
                                                        title={isEnv ? "Токен из переменных окружения нельзя изменить здесь" : "Нажмите, чтобы редактировать вручную"}
                                                        onClick={() => !isEnv && actions.setEditingTokenId(acc.id)}
                                                    >
                                                        {currentData.token ? maskToken(currentData.token) : <span className="text-gray-400 italic">Нет токена</span>}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-right align-middle" onClick={e => e.stopPropagation()}>
                                                {!isEnv && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => actions.setAccountToAuthorize(acc)}
                                                            className="text-gray-400 hover:text-indigo-600"
                                                            title="Авторизовать (обновить токен)"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => actions.setAccountToDelete(acc)}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Удалить аккаунт"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50/30">
                                                <td colSpan={10} className="p-0">
                                                    <AccountStatsPanel accountId={acc.id} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Модальные окна */}
            {isAddModalOpen && (
                <AddSystemAccountsModal 
                    onClose={() => actions.setIsAddModalOpen(false)}
                    onSuccess={actions.handleAddFromUrls}
                />
            )}

            {accountToAuthorize && (
                <AuthorizeAccountModal 
                    account={accountToAuthorize}
                    onClose={() => actions.setAccountToAuthorize(null)}
                    onSuccess={actions.handleAuthorizationSuccess}
                />
            )}

            {accountToDelete && (
                <ConfirmationModal
                    title="Удалить системную страницу?"
                    message={`Вы уверены, что хотите удалить системную страницу "${accountToDelete.full_name}"? \n\nЭто действие необратимо.`}
                    onConfirm={actions.handleConfirmDelete}
                    onCancel={() => actions.setAccountToDelete(null)}
                    confirmText="Удалить"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    isConfirming={isSaving}
                />
            )}
        </div>
    );
};
