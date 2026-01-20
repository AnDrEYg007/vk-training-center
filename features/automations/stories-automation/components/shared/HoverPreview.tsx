import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Компонент для предпросмотра изображения при наведении (скопирован из PostMediaSection для изоляции)
export const HoverPreview: React.FC<{ url: string; rect: DOMRect; isExiting: boolean }> = ({ url, rect, isExiting }) => {
    const scale = 2.5;
    const newWidth = rect.width * scale;
    const newHeight = rect.height * scale;
    
    let top = rect.top + (rect.height - newHeight) / 2;
    let left = rect.left + (rect.width - newWidth) / 2;
    
    const margin = 16;
    if (top < margin) top = margin;
    if (left < margin) left = margin;
    if (top + newHeight > window.innerHeight - margin) top = window.innerHeight - newHeight - margin;
    if (left + newWidth > window.innerWidth - margin) left = window.innerWidth - newWidth - margin;

    const animationClass = isExiting ? 'animate-image-preview-out' : 'animate-image-preview-in';

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                zIndex: 150,
                pointerEvents: 'none',
            }}
            className={`shadow-2xl rounded-lg ${animationClass}`}
        >
            <img src={url} className="w-full h-full object-cover rounded-lg border-2 border-white" alt="Hover preview" />
        </div>,
        document.body
    );
};
