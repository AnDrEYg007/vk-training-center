import React from 'react';
import { LazyImage } from '../../../shared/components/LazyImage';

interface ImageRibbonProps {
    images: string[];
    onImageClick: (url: string) => void;
}

export const ImageRibbon: React.FC<ImageRibbonProps> = ({ images, onImageClick }) => {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-t-lg">
             <div className="flex space-x-2 p-2 bg-gray-100/70 border-b border-gray-200 overflow-x-auto custom-scrollbar">
                {images.map((url, idx) => (
                    <button
                        key={idx}
                        className="flex-shrink-0 w-24 h-24 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(url);
                        }}
                    >
                        <LazyImage src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-md" />
                    </button>
                ))}
            </div>
        </div>
    );
};