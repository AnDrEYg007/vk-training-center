import React from 'react';
import { createPortal } from 'react-dom';
import { Photo, PhotoAttachment } from '../../types';

interface ImagePreviewModalProps {
    // Тип объединен для возможности принимать как Photo из галереи, так и PhotoAttachment из поста
    image: Photo | PhotoAttachment;
    onClose: () => void;
    // Используем children для гибкой передачи кнопок действий (например, "Выбрать")
    children?: React.ReactNode; 
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ image, onClose, children }) => {
    // Используем React Portal, чтобы рендерить модальное окно в document.body.
    // Это гарантирует, что оно будет поверх всех других элементов.
    return createPortal(
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]" 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <div className="relative max-w-4xl max-h-4/5 p-4" onClick={e => e.stopPropagation()}>
                <img src={image.url} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg"/>
                <button 
                    onClick={onClose} 
                    className="absolute -top-2 -right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    title="Закрыть"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Рендерим любые дочерние элементы, переданные в модальное окно */}
                {children}
            </div>
        </div>,
        document.body
    );
};