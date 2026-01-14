
import React from 'react';
import { AiPost } from '../types';

interface AiPostCardProps {
    post: AiPost;
    onDelete: (id: string) => void;
    onEdit?: (post: AiPost) => void;
}

export const AiPostCard: React.FC<AiPostCardProps> = ({ post, onDelete, onEdit }) => {
    
    // Парсим параметры генерации
    let aiParams: any = {};
    try {
        aiParams = post.aiGenerationParams || (post as any).ai_generation_params ? JSON.parse((post as any).ai_generation_params) : {};
    } catch (e) {
        console.warn("Failed to parse AI params for card", e);
    }

    const nextRun = new Date(post.publication_date).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    
    const getRecurrenceLabel = () => {
        const interval = post.recurrence_interval || 1;
        const typeMap: Record<string, string> = {
            'minutes': 'мин.', 'hours': 'ч.', 'days': 'дн.', 'weeks': 'нед.', 'months': 'мес.'
        };
        const type = typeMap[post.recurrence_type || 'days'] || post.recurrence_type;
        return `Каждые ${interval} ${type}`;
    };
    
    const isActive = post.is_active !== false; // По умолчанию True
    
    // Получаем название шаблона
    const promptName = aiParams.systemPromptName || (aiParams.systemPrompt ? "Пользовательский" : "Системный");

    // Параметры медиа
    const mediaMode = aiParams.mediaMode || 'all';
    const mediaCount = aiParams.mediaSubsetCount || 1;
    const mediaType = aiParams.mediaSubsetType === 'order' ? 'По порядку' : 'Случайно';
    
    const images = post.images && typeof post.images === 'string' 
        ? JSON.parse(post.images) 
        : (post.images || []);

    const hasMedia = images.length > 0;

    return (
        <div className={`bg-white rounded-lg shadow-sm border flex flex-col h-full transition-all hover:shadow-md ${isActive ? 'border-indigo-100' : 'border-gray-200 bg-gray-50/50'}`}>
            
            {/* 1. ЗАГОЛОВОК, ОПИСАНИЕ, СТАТУС */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-500'}`} title={post.title || "Без названия"}>
                            {post.title || "Без названия"}
                        </h3>
                        {post.description ? (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                        ) : (
                            <p className="text-xs text-gray-400 italic mt-1">Нет описания</p>
                        )}
                    </div>
                    
                    <div className="flex-shrink-0">
                        {isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide border border-green-200">
                                Активно
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600 uppercase tracking-wide border border-gray-300">
                                Пауза
                            </span>
                        )}
                    </div>
                </div>

                {/* Информация о запуске */}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span><span className="font-medium text-gray-700">След. запуск:</span> {nextRun}</span>
                    </div>
                    <div className="h-3 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>{getRecurrenceLabel()}</span>
                    </div>
                </div>
            </div>

            {/* ОБЕРТКА КОНТЕНТА: Занимает все свободное место, чтобы футер был внизу, но внутри блоки идут подряд */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* 2. AI КОНФИГУРАЦИЯ */}
                <div className="px-4 py-3 space-y-3 bg-white">
                    {/* Системная роль */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Системная роль</p>
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 truncate max-w-[120px]" title="Шаблон">
                                {promptName}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 italic leading-snug line-clamp-2 pl-2 border-l-2 border-indigo-200">
                            {aiParams.systemPrompt || "Инструкция по умолчанию"}
                        </div>
                    </div>

                    {/* Задача (Prompt) */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Задача (Prompt)</p>
                        <div className="text-xs text-gray-800 font-medium leading-snug line-clamp-3">
                            {aiParams.userPrompt || "—"}
                        </div>
                    </div>
                </div>
                
                {/* 3. РЕЗУЛЬТАТ */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                     <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ориентировочный результат генерации</p>
                        {post.text && <span className="text-[9px] text-gray-400">{post.text.length} симв.</span>}
                     </div>
                     
                     <p className="text-xs text-gray-600 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                        {post.text || <span className="italic text-gray-400">Текст еще не сгенерирован</span>}
                     </p>
                </div>

                {/* 4. МЕДИА ВЛОЖЕНИЯ (Или сообщение об отсутствии) */}
                {hasMedia ? (
                    <div className="px-4 py-3 border-t border-gray-100 bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Медиа вложения</p>
                            <div className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {mediaMode === 'all' 
                                    ? `Все (${images.length})` 
                                    : `Часть: ${mediaCount} шт. (${mediaType})`
                                }
                            </div>
                        </div>
                        
                        <div className="w-full flex gap-2">
                             {images.slice(0, 4).map((img: any, index: number) => {
                                const isLast = index === 3;
                                const showOverlay = isLast && images.length > 4;
                                const remainingCount = images.length - 3; // Всего - 3 показанных

                                return (
                                    <div key={index} className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 group">
                                        <img src={img.url} className="w-full h-full object-cover" alt="media" />
                                        {showOverlay && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">+{remainingCount}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="px-4 py-3 border-t border-gray-100 bg-white">
                        <p className="text-[10px] text-gray-400 italic text-center">Медиа вложения отсутствуют</p>
                    </div>
                )}
            </div>

            {/* 5. ФУТЕР */}
            <div className="flex justify-end p-3 border-t border-gray-200 gap-2 bg-gray-50 rounded-b-lg flex-shrink-0 mt-auto">
                {onEdit && (
                    <button 
                        onClick={() => onEdit(post)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-3 py-1.5 rounded hover:bg-white transition-colors flex items-center gap-1 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                        Изменить
                    </button>
                )}
                <button 
                    onClick={() => onDelete(post.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors border border-transparent"
                >
                    Удалить
                </button>
            </div>
        </div>
    );
};
