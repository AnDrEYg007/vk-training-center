import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Администрирование
// =====================================================================
export const Administration: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел «Администрирование» предназначен для тех, кто настраивает систему, 
                управляет доступами, интегрирует с VK API и решает технические вопросы. 
                Это продвинутый раздел для администраторов и владельцев.
            </p>

            <hr className="!my-10" />

            {/* Основные возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что входит в этот раздел</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-purple-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Управление пользователями</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Создание и удаление аккаунтов</li>
                        <li>• Назначение ролей и прав доступа</li>
                        <li>• Привязка пользователей к проектам</li>
                        <li>• Журнал активности пользователей</li>
                    </ul>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Токены VK API</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Добавление и проверка токенов</li>
                        <li>• Права доступа токенов</li>
                        <li>• Ротация и обновление токенов</li>
                        <li>• Диагностика проблем с API</li>
                    </ul>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">База данных</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Резервное копирование данных</li>
                        <li>• Восстановление из бэкапов</li>
                        <li>• Миграции и обновления схемы</li>
                        <li>• Очистка старых данных</li>
                    </ul>
                </div>

                <div className="bg-white border border-orange-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Системные настройки</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Конфигурация сервера</li>
                        <li>• Параметры автоматизаций</li>
                        <li>• Лимиты и ограничения</li>
                        <li>• Интеграции с внешними сервисами</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Чему научитесь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чему вы научитесь</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold">
                        1
                    </div>
                    <div>
                        <p className="font-medium text-purple-800">Настраивать права доступа</p>
                        <p className="text-sm text-purple-700 mt-1">
                            Создадите систему ролей: кто может только смотреть, кто редактировать, 
                            а кто имеет полный доступ к администрированию.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
                        2
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Работать с VK API безопасно</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Научитесь получать, проверять и обновлять токены, понимать ошибки API 
                            и настраивать права для разных типов действий.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                        3
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Делать бэкапы и восстанавливать данные</p>
                        <p className="text-sm text-green-700 mt-1">
                            Освоите резервное копирование базы данных, восстановление после сбоев 
                            и миграцию данных между средами.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-700 font-bold">
                        4
                    </div>
                    <div>
                        <p className="font-medium text-orange-800">Диагностировать проблемы системы</p>
                        <p className="text-sm text-orange-700 mt-1">
                            Научитесь читать логи, находить причины ошибок, отслеживать производительность 
                            и решать технические инциденты.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Важные темы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ключевые темы раздела</h2>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Роли и права</strong> — как правильно настроить доступы для команды</li>
                <li><strong>VK API и токены</strong> — получение, проверка, обновление, типичные ошибки</li>
                <li><strong>Безопасность</strong> — защита токенов, логирование действий, аудит</li>
                <li><strong>Резервное копирование</strong> — автоматические и ручные бэкапы, восстановление</li>
                <li><strong>Мониторинг</strong> — отслеживание работы системы, уведомления о проблемах</li>
                <li><strong>Обновления</strong> — как обновлять систему без потери данных</li>
            </ul>

            {/* Предупреждение */}
            <div className="not-prose bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-red-800">
                    <strong>⚠️ Внимание:</strong> Этот раздел содержит критически важные настройки. 
                    <span className="font-medium"> Неправильные изменения могут нарушить работу системы</span>. 
                    Изучайте внимательно и делайте бэкапы перед изменениями.
                </p>
            </div>

            <NavigationButtons currentPath="0-3-4-administration" />
        </article>
    );
};
