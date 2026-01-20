
import React from 'react';
import { NewProductRow } from '../../../types';

interface PhotoCellProps {
    row: NewProductRow;
    urlInputValue: string;
    inputClass: string;
    onUrlChange: (value: string) => void;
    onUrlBlur: () => void;
    onClear: () => void;
    onFileChange: (file: File) => void;
    hasError?: boolean;
    errorMessage?: string;
    useDefaultImage?: boolean; // New prop
    onToggleDefault?: (val: boolean) => void; // New prop
}

export const PhotoCell: React.FC<PhotoCellProps> = ({
    row,
    urlInputValue,
    inputClass,
    onUrlChange,
    onUrlBlur,
    onClear,
    onFileChange,
    hasError = false,
    errorMessage,
    useDefaultImage,
    onToggleDefault
}) => {
    return (
        <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 h-9">
                {row.photoPreview ? (
                    <div className={`relative group h-9 w-9 flex-shrink-0 rounded border ${hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`} title={errorMessage}>
                        <img src={row.photoPreview} className="w-full h-full object-cover rounded" alt="preview" />
                        <button 
                            onClick={onClear}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                            title="Удалить фото"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <>
                        <input type="file" accept="image/*" className="hidden" id={`file-${row.tempId}`} onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) onFileChange(file);
                        }}/>
                        <label 
                            htmlFor={`file-${row.tempId}`} 
                            className={`cursor-pointer h-9 w-9 border rounded-md flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex-shrink-0 ${
                                hasError 
                                ? 'border-red-500 text-red-500 bg-red-50 focus:ring-1 focus:ring-red-500' 
                                : 'border-gray-300 text-gray-500 hover:border-indigo-300'
                            }`}
                            title={errorMessage || "Загрузить файл"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </label>
                    </>
                )}
                
                <input 
                    type="text" 
                    placeholder={row.photoPreview ? "Фото загружено" : "Или URL..."} 
                    value={urlInputValue || ''}
                    onChange={(e) => onUrlChange(e.target.value)}
                    onBlur={onUrlBlur}
                    onKeyDown={(e) => e.key === 'Enter' && onUrlBlur()}
                    className={inputClass}
                    disabled={!!row.photoPreview}
                />
            </div>
            
            {!row.photoPreview && onToggleDefault && (
                <div className="flex items-center mt-1 ml-0.5">
                    <input 
                        type="checkbox" 
                        id={`default-photo-${row.tempId}`}
                        checked={useDefaultImage || false} 
                        onChange={(e) => onToggleDefault(e.target.checked)}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`default-photo-${row.tempId}`} className="text-[10px] text-gray-500 ml-1 select-none cursor-pointer">
                        Заглушка
                    </label>
                </div>
            )}

            {errorMessage && (
                <div className="text-[10px] text-red-500 leading-tight mt-0.5">
                    {errorMessage}
                </div>
            )}
        </td>
    );
};
