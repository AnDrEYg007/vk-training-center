
import React, { useState } from 'react';
import { ChatTurn } from '../../hooks/useAIGenerator';

interface ChatTurnDisplayProps {
    turn: ChatTurn;
    onAddToPost: (text: string) => void;
    onReply: (turn: ChatTurn) => void;
    onJumpToTurn: (turnId: string) => void;
    getRepliedTurnText: (turnId: string) => string | undefined;
    onRegenerate: (turn: ChatTurn) => void;
    // Новые пропсы
    isMultiGenerationMode?: boolean;
    isSelected?: boolean;
    onToggleSelection?: (turnId: string) => void;
}

const ExpandableText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = text.length > 150;

    return (
        <div 
            onClick={(e) => {
                if (isLong) {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }
            }}
            className={`group transition-all duration-200 ${isLong ? 'cursor-pointer' : ''}`}
        >
            <p className={`${className} whitespace-pre-wrap ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
                {text}
            </p>
            {isLong && (
                <span className="text-[10px] text-indigo-600/70 font-medium group-hover:text-indigo-800 transition-colors mt-0.5 inline-flex items-center gap-0.5">
                    {isExpanded ? 'Свернуть' : 'Показать полностью...'}
                </span>
            )}
        </div>
    );
};

export const ChatTurnDisplay: React.FC<ChatTurnDisplayProps> = ({ 
    turn, onAddToPost, onReply, onJumpToTurn, getRepliedTurnText, onRegenerate,
    isMultiGenerationMode, isSelected, onToggleSelection
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const repliedTurnText = turn.replyToId ? getRepliedTurnText(turn.replyToId) : null;

    const handleCopy = () => {
        if (turn.aiResponse) {
            navigator.clipboard.writeText(turn.aiResponse);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // Иконки для типов контекста
    const getContextIcon = (type: 'product' | 'company') => {
        if (type === 'product') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="space-y-3 animate-fade-in-up">
            {/* Блок пользователя: системный промпт + запрос (выравнивание по правому краю) */}
            <div className="flex justify-end items-start gap-2">
                {/* Radio button for selection mode */}
                {isMultiGenerationMode && onToggleSelection && (
                    <div 
                        onClick={() => !turn.isLoading && onToggleSelection(turn.id)}
                        className={`mt-2 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                            ${turn.isLoading ? 'border-gray-200 cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-indigo-400'} 
                            ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}
                        `}
                        title={turn.isLoading ? "Ожидайте завершения генерации" : "Выбрать этот промпт для генерации всех постов"}
                    >
                         {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-600 animate-fade-in-up"></div>}
                    </div>
                )}
                
                <div className={`p-3 bg-indigo-100 rounded-lg max-w-[85%] shadow-sm ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                    <div className="border-b border-indigo-200 pb-2 mb-2">
                        <p className="text-xs font-semibold text-indigo-800">Роль / Инструкция:</p>
                        <ExpandableText 
                            text={turn.systemPrompt} 
                            className="text-xs text-gray-700 italic"
                        />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-indigo-800">Ваш запрос:</p>
                        <ExpandableText 
                            text={turn.userPrompt} 
                            className="text-sm text-gray-800 font-medium"
                        />
                    </div>
                    
                    {/* БЛОК КОНТЕКСТА */}
                    {turn.contextSnapshot && turn.contextSnapshot.items.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                             <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Прикрепленный контекст:</p>
                            {turn.contextSnapshot.items.map((item, index) => (
                                <div key={index} className="bg-white/60 rounded p-2 text-xs border border-indigo-200">
                                    <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1">
                                        {getContextIcon(item.type)}
                                        {item.type === 'product' ? 'Товар' : 'Компания'}
                                    </div>
                                    <div className="flex items-start gap-2">
                                        {item.photo && (
                                            <img src={item.photo} alt="" className="w-8 h-8 rounded object-cover bg-gray-200 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-[10px] text-gray-500">
                                                Передано: {item.details}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {repliedTurnText && (
                        <div
                            className="mt-2 p-2 pl-3 border-l-2 border-indigo-400 cursor-pointer hover:bg-indigo-200 rounded transition-colors bg-indigo-50"
                            onClick={() => turn.replyToId && onJumpToTurn(turn.replyToId)}
                            title="Перейти к сообщению"
                        >
                            <p className="text-xs font-semibold text-indigo-700">В ответ на:</p>
                            <p className="text-sm text-indigo-900 truncate">{repliedTurnText}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Блок AI: результат (выравнивание по левому краю) */}
            <div className="flex justify-start">
                <div
                    className="group p-3 bg-gray-100 rounded-lg max-w-[85%] transition-colors duration-200 shadow-sm"
                    onDoubleClick={() => {
                        if (!turn.isLoading && turn.aiResponse) {
                            onReply(turn);
                        }
                    }}
                    title="Двойной клик, чтобы ответить на это сообщение"
                >
                    <p className="text-xs font-semibold text-gray-800 mb-2">Результат генерации:</p>
                    {turn.isLoading ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                            <span>Думаю...</span>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap break-words">{turn.aiResponse}</p>
                        </div>
                    )}
                    {!turn.isLoading && turn.aiResponse && (
                         <div className="flex justify-end items-center gap-1 mt-3 pt-3 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => onRegenerate(turn)}
                                title="Сгенерировать заново с теми же параметрами"
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                            </button>
                             <button
                                type="button"
                                onClick={handleCopy}
                                title={isCopied ? 'Скопировано!' : 'Копировать'}
                                className={`p-2 rounded-full transition-colors ${isCopied ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => onAddToPost(turn.aiResponse)}
                                title="Добавить в текст поста"
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
