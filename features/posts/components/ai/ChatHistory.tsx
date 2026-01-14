import React from 'react';
import { ChatTurn } from '../../hooks/useAIGenerator';
import { ChatTurnDisplay } from './ChatTurnDisplay';

interface ChatHistoryProps {
    chatHistory: ChatTurn[];
    chatContainerRef: React.RefObject<HTMLDivElement>;
    turnRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    highlightedTurnId: string | null;
    handleAddToPost: (text: string) => void;
    setReplyToTurn: (turn: ChatTurn) => void;
    handleJumpToTurn: (turnId: string) => void;
    getRepliedTurnText: (turnId: string) => string | undefined;
    onRegenerate: (turn: ChatTurn) => void; 
    // Новые пропсы
    isMultiGenerationMode?: boolean;
    selectedTurnId?: string | null;
    onToggleSelection?: (turnId: string) => void;
    className?: string; // Для кастомных стилей контейнера
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
    chatHistory, chatContainerRef, turnRefs, highlightedTurnId,
    handleAddToPost, setReplyToTurn, handleJumpToTurn, getRepliedTurnText,
    onRegenerate, isMultiGenerationMode, selectedTurnId, onToggleSelection,
    className
}) => {
    return (
        <div ref={chatContainerRef} className={`flex-grow overflow-y-auto custom-scrollbar ${className || ''}`}>
            {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 min-h-[200px]">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-sm">История диалога будет здесь</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {chatHistory.map(turn => (
                        <div
                            key={turn.id}
                            ref={el => { turnRefs.current[turn.id] = el; }}
                            className={`p-1 -m-1 transition-all duration-700 rounded-lg ${
                                highlightedTurnId === turn.id ? 'bg-amber-100' : ''
                            }`}
                        >
                            <ChatTurnDisplay
                                turn={turn}
                                onAddToPost={handleAddToPost}
                                onReply={setReplyToTurn}
                                onJumpToTurn={handleJumpToTurn}
                                getRepliedTurnText={getRepliedTurnText}
                                onRegenerate={onRegenerate} 
                                // Новые пропсы
                                isMultiGenerationMode={isMultiGenerationMode}
                                isSelected={selectedTurnId === turn.id}
                                onToggleSelection={onToggleSelection}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};