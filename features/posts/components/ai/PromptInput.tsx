import React from 'react';
import { ChatTurn } from '../../hooks/useAIGenerator';

interface PromptInputProps {
    replyToTurn: ChatTurn | null;
    setReplyToTurn: (turn: ChatTurn | null) => void;
    userPrompt: string;
    setUserPrompt: (value: string) => void;
    isGenerating: boolean;
    handleGenerateText: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
    replyToTurn, setReplyToTurn, userPrompt, setUserPrompt, isGenerating, handleGenerateText
}) => {
    return (
        <div className="flex-shrink-0">
            {replyToTurn && (
                <div className="mb-2 animate-fade-in-up">
                    <div className="relative p-3 pl-4 bg-gray-200 border-l-4 border-indigo-400 rounded-md">
                        <p className="text-xs font-semibold text-gray-800">В ответ на:</p>
                        <p className="text-sm text-gray-600 truncate">{replyToTurn.aiResponse}</p>
                        <button 
                            type="button" 
                            onClick={() => setReplyToTurn(null)} 
                            className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700 rounded-full"
                            title="Отменить ответ"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="flex gap-2">
                <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={2}
                    placeholder="Напишите задачу для AI..."
                    className="flex-grow border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 custom-scrollbar resize-none"
                    disabled={isGenerating}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerateText();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleGenerateText}
                    disabled={isGenerating || !userPrompt.trim()}
                    className="px-4 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center"
                    title="Отправить (Enter)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};