
import React, { RefObject } from 'react';

interface PhotoUploadSectionProps {
    photoPreview: string | null;
    photoUrl: string;
    setPhotoUrl: (url: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUrlBlur: () => void;
    onClearPhoto: () => void;
    fileInputRef: RefObject<HTMLInputElement>;
    hasError?: boolean;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
    photoPreview,
    photoUrl,
    setPhotoUrl,
    onFileChange,
    onUrlBlur,
    onClearPhoto,
    fileInputRef,
    hasError
}) => {
    const borderClass = hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50';

    return (
        <div className="flex items-start gap-4">
            {/* 1. Превью фото */}
            <div className={`w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden relative group ${borderClass}`}>
                {photoPreview ? (
                    <>
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover"/>
                        <button
                            onClick={onClearPhoto}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                            title="Удалить фото"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <span className={`text-xs text-center ${hasError ? 'text-red-500' : 'text-gray-400'}`}>Нет фото</span>
                )}
            </div>
            
            {/* 2. Кнопки загрузки */}
            <div className="w-44 flex-shrink-0 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Главное фото <span className="text-red-500">*</span></label>
                <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden"/>
                <button onClick={() => fileInputRef.current?.click()} className="w-full h-10 text-sm border p-2 rounded-md hover:bg-gray-50 text-gray-700 bg-white flex items-center justify-center">
                    Выбрать файл
                </button>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Или ссылка..." 
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        onBlur={onUrlBlur}
                        onKeyDown={(e) => e.key === 'Enter' && onUrlBlur()}
                        className={`w-full h-10 text-sm border p-2 rounded-md focus:outline-none focus:ring-2 ${hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                    />
                </div>
            </div>
        </div>
    );
};
