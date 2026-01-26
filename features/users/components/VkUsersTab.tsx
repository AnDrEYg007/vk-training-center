import React, { useState, useEffect, useCallback } from 'react';

// Интерфейс VK пользователя
interface VkUser {
    vk_user_id: string;
    first_name: string | null;
    last_name: string | null;
    photo_url: string | null;
    email: string | null;
    scope: string | null;
    app_id: string | null;
    is_active: boolean;
    last_login: string | null;
    created_at: string | null;
    token_expires_at: string | null;
}

/**
 * Компонент для отображения VK пользователей в разделе управления.
 * Показывает всех пользователей, авторизованных через VK OAuth.
 */
export const VkUsersTab: React.FC = () => {
    const [vkUsers, setVkUsers] = useState<VkUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVkUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/vk-test/users');
            if (!res.ok) {
                throw new Error('Не удалось загрузить VK пользователей');
            }
            const data = await res.json();
            setVkUsers(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Ошибка загрузки';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVkUsers();
    }, [fetchVkUsers]);

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Удалить VK пользователя "${userName}"?`)) return;
        
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/vk-test/users/${userId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchVkUsers();
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    // Форматирование даты (учитываем что сервер отдаёт UTC)
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        // Если строка не содержит Z или timezone, добавляем Z (UTC)
        const isoStr = dateStr.includes('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
        return new Date(isoStr).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Проверка истёк ли токен (учитываем UTC)
    const isTokenExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        const isoStr = expiresAt.includes('Z') || expiresAt.includes('+') ? expiresAt : expiresAt + 'Z';
        return new Date(isoStr) < new Date();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="loader border-t-indigo-500 w-8 h-8"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">
                {error}
                <button 
                    onClick={fetchVkUsers}
                    className="ml-4 text-indigo-600 hover:underline"
                >
                    Повторить
                </button>
            </div>
        );
    }

    if (vkUsers.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium">Нет VK пользователей</p>
                <p className="text-sm mt-1">Авторизуйтесь через VK на странице "VK Auth Test"</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VK ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Последний вход</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Токен истекает</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {vkUsers.map((user, index) => {
                        const expired = isTokenExpired(user.token_expires_at);
                        const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Без имени';
                        
                        return (
                            <tr 
                                key={user.vk_user_id} 
                                className="hover:bg-gray-50 opacity-0 animate-fade-in-up" 
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {user.photo_url ? (
                                            <img 
                                                src={user.photo_url} 
                                                alt="" 
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.6-.189 1.37 1.263 2.188 1.822.617.422 1.087.33 1.087.33l2.185-.03s1.142-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.264-1.183-1.06.462-3.246.999-1.33 1.398-2.142 1.273-2.488-.12-.332-.858-.244-.858-.244l-2.464.015s-.183-.025-.318.056c-.133.079-.218.263-.218.263s-.39 1.038-.91 1.92c-1.098 1.867-1.537 1.965-1.717 1.848-.419-.271-.314-1.091-.314-1.673 0-1.818.275-2.576-.537-2.773-.27-.066-.468-.109-1.157-.116-.883-.009-1.63.003-2.052.21-.281.138-.497.444-.365.462.163.022.533.1.729.365.253.342.244 1.108.244 1.108s.145 2.14-.339 2.405c-.332.182-.788-.189-1.764-1.887-.5-.869-.878-1.83-.878-1.83s-.072-.178-.202-.273c-.158-.116-.378-.153-.378-.153l-2.342.015s-.351.01-.48.163c-.115.136-.009.417-.009.417s1.838 4.301 3.92 6.467c1.91 1.987 4.078 1.857 4.078 1.857h.983z"/>
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-900">{userName}</div>
                                            {user.email && (
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <a 
                                        href={`https://vk.com/id${user.vk_user_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-sm text-blue-600 hover:underline"
                                    >
                                        {user.vk_user_id}
                                    </a>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {user.app_id || '—'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {formatDate(user.last_login)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {formatDate(user.token_expires_at)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {expired ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Истёк
                                        </span>
                                    ) : user.is_active ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Активен
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            Неактивен
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user.vk_user_id, userName)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                                        title="Удалить пользователя"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
