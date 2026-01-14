import React from 'react';
import { ScheduledPost } from '../../../../shared/types';
import { LazyImage } from '../../../../shared/components/LazyImage';

export const ImageGrid: React.FC<{ images: ScheduledPost['images'] }> = React.memo(({ images }) => {
    if (images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="group relative aspect-video w-full mt-2 mb-1 rounded-md bg-gray-200">
                <LazyImage src={images[0].url} alt="Post image" className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out"/>
            </div>
        );
    }

    const remainingCount = images.length - 4;

    return (
        <div className="grid grid-cols-2 gap-1 my-2">
            {images.slice(0, images.length > 4 ? 3 : 4).map((img, idx) => (
                <div key={img.id} className="group relative aspect-square">
                    <LazyImage src={img.url} className="rounded object-cover w-full h-full transition-transform duration-300 ease-in-out" alt={`Post image ${idx + 1}`} />
                </div>
            ))}
            {images.length > 4 && (
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-lg">+{remainingCount + 1}</span>
                </div>
            )}
        </div>
    );
});