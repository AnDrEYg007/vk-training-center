import React from 'react';

// =====================================================================
// Вспомогательные Mock-компоненты для визуализации интерфейса
// =====================================================================

const ImageGridMock: React.FC<{ count: number }> = ({ count }) => {
    if (!count || count === 0) return null;

    if (count === 1) {
        return (
            <div className="aspect-video w-full mt-2 mb-1 rounded-md bg-gray-200 overflow-hidden">
                <img src={`https://picsum.photos/seed/${count}-1/400/225`} alt="Placeholder" className="w-full h-full object-cover"/>
            </div>
        );
    }

    const gridImagesCount = count > 4 ? 3 : count;
    const remainingCount = count - gridImagesCount;

    return (
        <div className="grid grid-cols-2 gap-1 my-2">
            {Array.from({ length: gridImagesCount }).map((_, idx) => (
                <div key={idx} className="aspect-square bg-gray-200 rounded overflow-hidden">
                     <img src={`https://picsum.photos/seed/${count}-${idx}/200/200`} alt={`Placeholder ${idx + 1}`} className="w-full h-full object-cover"/>
                </div>
            ))}
            {count > gridImagesCount && (
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-lg">+{remainingCount}</span>
                </div>
            )}
        </div>
    );
};

const TextMock: React.FC<{ 
    length: 'short' | 'long' | 'none';
    isExpanded?: boolean;
    onClick?: () => void;
    longText?: string;
}> = ({ length, isExpanded, onClick, longText }) => {
    if (length === 'none') return null;
    if (length === 'short') {
        return <p className="text-gray-600 h-5 mt-2 text-sm">Краткий текст поста...</p>;
    }
    // long
    return (
        <p 
            onClick={onClick}
            className={`text-gray-700 break-words text-sm overflow-hidden transition-[max-height] duration-500 ease-in-out mt-2 ${onClick ? 'cursor-pointer' : ''} ${isExpanded ? 'max-h-96' : 'max-h-16'}`}
        >
            {longText || 'Это длинный текст поста, который изначально свернут для экономии места. В реальном приложении здесь может быть ваш рекламный текст, анонс или любая другая информация. Кликните на этот абзац, и он плавно развернется, чтобы показать все содержимое. Повторный клик снова свернет его. Эта механика позволяет держать календарь чистым и организованным, даже если у вас очень объемные посты.'}
        </p>
    );
};


export const MockPostCard: React.FC<{
    type?: 'published' | 'vk' | 'system';
    statusIcon?: React.ReactNode;
    imagesCount?: number;
    textLength?: 'short' | 'long' | 'none';
    showActions?: boolean;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    longText?: string;
}> = ({ type = 'vk', statusIcon, imagesCount = 0, textLength = 'none', showActions = false, isExpanded, onToggleExpand, longText }) => {
    let borderClass = 'border-gray-200';
    if (type === 'system') borderClass = 'border-dashed border-gray-400';

    return (
        <div className={`relative bg-white p-2.5 rounded-lg border shadow-sm text-xs ${borderClass} not-prose`}>
            {type === 'published' && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 rounded-lg pointer-events-none"></div>
                    <div className="absolute top-2 left-2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </>
            )}
            {type === 'system' && statusIcon && (
                <div className="absolute top-2 left-2 text-gray-500 text-lg">
                    {statusIcon}
                </div>
            )}
            <div className={`flex justify-between items-center mb-1 ${type !== 'vk' ? 'pl-7' : ''}`}>
                <p className="font-semibold text-gray-500">14:30</p>
            </div>

            {showActions && (
                 <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 text-gray-400 bg-white/50 backdrop-blur-sm p-1 rounded-md">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
            )}
            
            <div className={showActions ? 'opacity-50' : ''}>
                <ImageGridMock count={imagesCount} />
                <TextMock 
                    length={textLength} 
                    isExpanded={isExpanded}
                    onClick={onToggleExpand}
                    longText={longText}
                />
            </div>
        </div>
    );
};


export const ActionIcon: React.FC<{ icon: React.ReactNode; label: string; description: string }> = ({ icon, label, description }) => (
    <div className="flex items-start not-prose">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
            {icon}
        </div>
        <div className="ml-4">
            <p className="font-bold text-gray-800 text-base">{label}</p>
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        </div>
    </div>
);

export const StatusTable: React.FC = () => {
    const statuses = [
        { icon: '🕒', name: 'pending_publication', description: 'Пост создан и ждет своего времени для публикации.' },
        { icon: '⚙️', name: 'publishing', description: 'Наш сервер отправляет пост в VK. Редактирование в это время заблокировано.' },
        { icon: '⚠️', name: 'possible_error', description: 'Сервер не смог подтвердить выход поста. Проверьте стену VK вручную.' },
        { icon: '❌', name: 'error', description: 'При публикации произошла ошибка. Откройте пост, чтобы исправить.' },
    ];
    return (
        <div className="my-6 border rounded-lg overflow-hidden not-prose shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Иконка</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Статус</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Что это значит?</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {statuses.map((status, index) => (
                        <tr key={status.name} className={index % 2 === 0 ? undefined : 'bg-gray-50/50'}>
                            <td className="px-4 py-4 text-2xl text-center">{status.icon}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                <code className="px-1.5 py-1 text-xs bg-gray-100 rounded-md text-gray-700 font-mono border border-gray-200">{status.name}</code>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{status.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};