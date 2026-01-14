import React, { useState, useEffect } from 'react';

interface AiEditorProps {
    correctedText: string;
    isCorrecting: boolean;
    onCopyToClipboard: (text: string) => void;
}

export const AiEditor: React.FC<AiEditorProps> = ({
    correctedText,
    isCorrecting,
    onCopyToClipboard,
}) => {
    const [editableText, setEditableText] = useState(correctedText);
    const [copyButtonText, setCopyButtonText] = useState('Копировать');

    // Update the local state when the prop changes (i.e., when AI returns a new result)
    useEffect(() => {
        setEditableText(correctedText);
    }, [correctedText]);
    
    // Reset copy button text when the content changes
    useEffect(() => {
        setCopyButtonText('Копировать');
    }, [editableText]);

    const handleCopyClick = () => {
        if (editableText.trim()) {
            onCopyToClipboard(editableText);
            setCopyButtonText('Скопировано!');
            setTimeout(() => setCopyButtonText('Копировать'), 2000);
        }
    };

    if (isCorrecting) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full p-4 items-center justify-center text-center">
                <div className="loader" style={{ width: '32px', height: '32px', borderTopColor: '#4f46e5' }}></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">ИИ-помощник исправляет текст...</p>
                <p className="mt-1 text-xs text-gray-500">Это может занять несколько секунд</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full p-4 space-y-3">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                </svg>
                <h2 className="text-base font-semibold text-gray-700 ml-2">Исправленный текст AI</h2>
            </div>
            <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full flex-grow border rounded p-3 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100/80 transition-colors custom-scrollbar"
                placeholder={'Результат появится здесь...'}
                disabled={isCorrecting}
            />
            <button
                onClick={handleCopyClick}
                disabled={!editableText.trim() || isCorrecting}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md text-white disabled:bg-gray-400 transition-all ${
                    copyButtonText === 'Скопировано!' ? 'bg-teal-500' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {copyButtonText}
            </button>
        </div>
    );
};
