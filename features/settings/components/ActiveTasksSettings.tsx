
import React from 'react';
import { useActiveTasks } from '../hooks/useActiveTasks';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

/**
 * Компонент настроек для управления фоновыми задачами.
 * Отображает список всех активных и недавних задач с возможностью их удаления.
 */
export const ActiveTasksSettings: React.FC = () => {
    const { state, actions, helpers } = useActiveTasks();
    const { 
        tasks, isLoading, selectedIds, taskToDeleteId, deletingTaskId, 
        showDeleteAllConfirm, showDeleteSelectedConfirm, isDeletingAll, isDeletingSelected 
    } = state;

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок секции */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                     <h2 className="text-lg font-semibold text-gray-800">Менеджер фоновых задач</h2>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Автообновление</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => actions.setShowDeleteAllConfirm(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50" 
                        title="Удалить все задачи из списка"
                        disabled={tasks.length === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Сбросить все
                    </button>
                    <button 
                        type="button"
                        onClick={() => { actions.setIsLoading(true); actions.fetchTasks(); }} 
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" 
                        title="Обновить принудительно"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        Обновить
                    </button>
                </div>
            </div>
            
            {/* Панель выбранных записей */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <span className="text-sm text-gray-600">
                    Выбрано: <span className="font-medium">{selectedIds.size}</span> из {tasks.length}
                </span>
                <button
                    type="button"
                    onClick={() => actions.setShowDeleteSelectedConfirm(true)}
                    disabled={selectedIds.size === 0 || isDeletingSelected}
                    className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Сбросить выбранные
                </button>
            </div>

            {/* Таблица задач */}
            <div className="flex-grow overflow-auto custom-scrollbar bg-white p-4">

                 {isLoading && tasks.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
                        Нет активных или недавних задач.
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-lg">
                        <table className="min-w-[1000px] w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={tasks.length > 0 && selectedIds.size === tasks.length}
                                            onChange={actions.toggleSelectAll}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-3">Проект</th>
                                    <th className="px-4 py-3">Тип</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Прогресс</th>
                                    <th className="px-4 py-3">Сообщение</th>
                                    <th className="px-4 py-3">Обновлено</th>
                                    <th className="px-4 py-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {tasks.map((task) => (
                                    <tr key={task.taskId} className="hover:bg-gray-50">
                                        <td className="w-12 px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(task.taskId)}
                                                onChange={() => actions.toggleSelect(task.taskId)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-2 max-w-xs truncate" title={task.meta?.project_id}>
                                            <span className="font-medium text-gray-800">
                                                {helpers.getProjectName(task.meta?.project_id)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600">{task.meta?.list_type || '-'}</td>
                                        <td className="px-4 py-2">{helpers.getStatusBadge(task.status)}</td>
                                        <td className="px-4 py-2">
                                            {task.status === 'fetching' || task.total ? (
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                                                        <span>{task.loaded}</span>
                                                        <span>{task.total || '?'}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                                                            style={{ width: `${Math.min(100, ((task.loaded || 0) / (task.total || 1)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : task.status === 'processing' && task.loaded ? (
                                                 <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                                                        <span>{task.loaded}</span>
                                                        <span>{task.total}</span>
                                                    </div>
                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                                                            style={{ width: `${Math.min(100, ((task.loaded || 0) / (task.total || 1)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                 </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2 max-w-xs truncate text-gray-600" title={task.error || task.message}>
                                            {task.error ? <span className="text-red-600">{task.error}</span> : task.message}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{helpers.formatTime(task.updated_at)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                type="button"
                                                onClick={(e) => actions.handleDeleteTaskClick(e, task.taskId)}
                                                disabled={deletingTaskId === task.taskId}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                title="Сбросить задачу"
                                            >
                                                {deletingTaskId === task.taskId ? (
                                                    <div className="h-5 w-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Модалка подтверждения удаления одной задачи */}
            {taskToDeleteId && (
                <ConfirmationModal
                    title="Сбросить задачу?"
                    message="Вы уверены, что хотите принудительно удалить эту задачу из памяти сервера? Это действие не остановит уже запущенные процессы в базе данных, но очистит запись о задаче."
                    onConfirm={actions.handleConfirmDelete}
                    onCancel={() => actions.setTaskToDeleteId(null)}
                    confirmText="Да, сбросить"
                    confirmButtonVariant="danger"
                    isConfirming={!!deletingTaskId}
                />
            )}

            {/* Модалка подтверждения удаления выбранных задач */}
            {showDeleteSelectedConfirm && (
                <ConfirmationModal
                    title="Сбросить выбранные задачи?"
                    message={`Вы собираетесь удалить ${selectedIds.size} выбранных задач из памяти сервера. Это действие не остановит уже запущенные процессы. Продолжить?`}
                    onConfirm={actions.handleDeleteSelected}
                    onCancel={() => actions.setShowDeleteSelectedConfirm(false)}
                    confirmText="Да, сбросить"
                    confirmButtonVariant="danger"
                    isConfirming={isDeletingSelected}
                />
            )}

            {/* Модалка подтверждения удаления всех задач */}
            {showDeleteAllConfirm && (
                <ConfirmationModal
                    title="Сбросить ВСЕ задачи?"
                    message="ВНИМАНИЕ: Вы собираетесь очистить список ВСЕХ фоновых задач. Это действие не остановит запущенные процессы, но очистит историю и статус всех задач в базе данных. Вы уверены?"
                    onConfirm={actions.handleDeleteAll}
                    onCancel={() => actions.setShowDeleteAllConfirm(false)}
                    confirmText="Да, сбросить все"
                    confirmButtonVariant="danger"
                    isConfirming={isDeletingAll}
                />
            )}
        </div>
    );
};
