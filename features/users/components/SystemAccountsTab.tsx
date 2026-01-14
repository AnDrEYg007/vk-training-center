
import React from 'react';
import { AddSystemAccountsModal } from './modals/AddSystemAccountsModal';
import { AuthorizeAccountModal } from './modals/AuthorizeAccountModal';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { useSystemAccounts } from '../hooks/useSystemAccounts';
import { AccountsHeader } from './system-accounts/AccountsHeader';
import { AccountsTable } from './system-accounts/AccountsTable';

export const SystemAccountsTab: React.FC = () => {
    const { state, actions } = useSystemAccounts();

    const {
        accounts, isLoading, isSaving, error, isAddModalOpen,
        expandedAccountId, editingTokenId, accountToDelete, accountToAuthorize,
        editedAccounts, isCheckingTokens, checkingAccountIds
    } = state;

    return (
        <div className="flex flex-col h-full">
            <AccountsHeader
                isCheckingTokens={isCheckingTokens}
                isLoading={isLoading}
                isSaving={isSaving}
                error={error}
                hasChanges={Object.keys(editedAccounts).length > 0}
                onCheckTokens={() => actions.handleCheckTokens(false, false)}
                onAdd={() => actions.setIsAddModalOpen(true)}
                onSave={actions.handleSave}
            />

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
                    <AccountsTable
                        accounts={accounts}
                        editedAccounts={editedAccounts}
                        expandedAccountId={expandedAccountId}
                        editingTokenId={editingTokenId}
                        checkingAccountIds={checkingAccountIds} // Передаем сет
                        onToggleRowExpand={actions.toggleRowExpand}
                        onAccountChange={actions.handleAccountChange}
                        onSetEditingTokenId={actions.setEditingTokenId}
                        onAuthorize={actions.setAccountToAuthorize}
                        onDelete={actions.setAccountToDelete}
                    />
                )}
            </div>
            
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
