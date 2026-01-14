

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../shared/types';
import * as api from '../../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { SystemAccountsTab } from './SystemAccountsTab';
import { TokenLogsDashboard } from './TokenLogsDashboard';
import { ActiveTasksTab } from './ActiveTasksTab';
import { AiTokensTab } from './AiTokensTab'; // Новый импорт

const UserTable: React.FC<{
    users: User[];
    onUserChange: (userId: string, field: keyof User, value: any) => void;
    onRemoveUser: (userId: string) => void;
}> = ({ users, onUserChange, onRemoveUser }) => {
    
    const inputClasses = "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white";
    
    return (
         <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">ФИО</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Логин</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Пароль</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {users.map((user, index) => (
                        <tr key={user.id} className="border-b border-gray-50 last:border-b-0 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 20}ms` }}>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    value={user.full_name}
                                    onChange={(e) => onUserChange(user.id, 'full_name', e.target.value)}
                                    className={inputClasses}
                                    placeholder="Иванов Иван"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    value={user.username}
                                    onChange={(e) => onUserChange(user.id, 'username', e.target.value)}
                                    className={inputClasses}
                                    placeholder="ivanov"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={user.password || ''}
                                    onChange={(e) => onUserChange(user.id, 'password', e.target.value)}
                                    className={inputClasses}
                                    placeholder="Введите пароль..."
                                />
                            </td>
                             <td className="px-4 py-2 text-right">
                                <button
                                    onClick={() => onRemoveUser(user.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                                    title="Удалить пользователя"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const UserManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'system' | 'logs' | 'tasks' | 'ai-tokens'>('users');
    
    const [initialUsers, setInitialUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ deletedUsers: User[]; onConfirm: () => void; } | null>(null);
    
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const allUsers = await api.getAllUsers();
            setInitialUsers(allUsers);
            setUsers(allUsers);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Не удалось загрузить пользователей";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [fetchUsers, activeTab]);

    const handleUserChange = (userId: string, field: keyof User, value: any) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, [field]: value } : u));
    };

    const handleRemoveUser = (userId: string) => {
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
    };

    const handleAddUser = () => {
        const newUser: User = {
            id: `new-${uuidv4()}`,
            full_name: '',
            username: '',
            password: '',
            role: 'user', // Default role
        };
        setUsers(currentUsers => [...currentUsers, newUser]);
    };
    
    const executeSave = async () => {
        setDeleteConfirmation(null);
        setIsSaving(true);
        try {
            // Базовая валидация
            for (const user of users) {
                if (!user.full_name.trim() || !user.username.trim() || (!user.password && user.id.startsWith('new-'))) {
                     throw new Error('Все поля (ФИО, Логин, Пароль) должны быть заполнены для всех пользователей.');
                }
            }

            await api.updateUsers(users);
            window.showAppToast?.("Пользователи успешно сохранены!", 'success');
            await fetchUsers(); // Обновляем для получения реальных ID
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Произошла ошибка';
            window.showAppToast?.(`Не удалось сохранить: ${msg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveChanges = async () => {
        // 1. Определяем удаленных пользователей
        const initialIds = new Set(initialUsers.map(u => u.id));
        const currentIds = new Set(users.map(u => u.id));
        const deletedIds = [...initialIds].filter(id => !currentIds.has(id));
        const deletedUsers = initialUsers.filter(u => deletedIds.includes(u.id));

        // 2. Если есть удаленные, показываем подтверждение
        if (deletedUsers.length > 0) {
            setDeleteConfirmation({
                deletedUsers,
                onConfirm: executeSave,
            });
        } else {
            // 3. Иначе - просто сохраняем
            await executeSave();
        }
    };
    
    const tabClass = (tabName: string) => `py-2 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tabName ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Управление пользователями</h1>
                        <p className="text-sm text-gray-500">Создание пользователей, настройка системных аккаунтов и аудит.</p>
                    </div>
                </div>
                <div className="px-4 pt-2 border-b border-gray-200 overflow-x-auto">
                    <div className="flex gap-4 min-w-max">
                        <button onClick={() => setActiveTab('users')} className={tabClass('users')}>Пользователи</button>
                        <button onClick={() => setActiveTab('system')} className={tabClass('system')}>Системные страницы</button>
                        <button onClick={() => setActiveTab('logs')} className={tabClass('logs')}>Логи токенов</button>
                        <button onClick={() => setActiveTab('tasks')} className={tabClass('tasks')}>Активные задачи</button>
                        <button onClick={() => setActiveTab('ai-tokens')} className={tabClass('ai-tokens')}>AI Tokens</button>
                    </div>
                </div>
                {activeTab === 'users' && (
                    <div className="p-4 border-b border-gray-200 flex justify-end items-center gap-4 bg-white">
                        <button
                            onClick={handleAddUser}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 disabled:opacity-50 whitespace-nowrap"
                        >
                            + Добавить пользователя
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            title="Сохранить все изменения"
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center whitespace-nowrap"
                        >
                            {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                        </button>
                    </div>
                )}
            </header>
            <main className="flex-grow p-0 overflow-hidden flex flex-col">
                {activeTab === 'users' && (
                    <div className="p-4 overflow-auto custom-scrollbar h-full">
                        {error ? (
                            <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>
                        ) : (
                            <UserTable users={users} onUserChange={handleUserChange} onRemoveUser={handleRemoveUser} />
                        )}
                    </div>
                )}
                {activeTab === 'system' && <SystemAccountsTab />}
                {activeTab === 'logs' && <TokenLogsDashboard />}
                {activeTab === 'tasks' && <ActiveTasksTab />}
                {activeTab === 'ai-tokens' && <AiTokensTab />}
            </main>
            {deleteConfirmation && (
                <ConfirmationModal
                    title="Подтвердите удаление"
                    message={`Вы собираетесь удалить пользователя(ей): '${deleteConfirmation.deletedUsers.map(u => u.full_name).join(', ')}'.\n\nЭто действие необратимо. Вы уверены?`}
                    onConfirm={deleteConfirmation.onConfirm}
                    onCancel={() => setDeleteConfirmation(null)}
                    confirmText="Да, удалить"
                    cancelText="Отмена"
                    isConfirming={isSaving}
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};