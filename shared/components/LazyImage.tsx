import React, { useState, useEffect } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [animationClass, setAnimationClass] = useState('animate-image-fade-in');

    useEffect(() => {
        // Сбрасываем состояние при смене src
        setIsLoading(true);
        setAnimationClass('animate-image-fade-in');

        const image = new Image();
        image.src = src;
        
        // Если изображение уже в кэше, оно загрузится синхронно
        if (image.complete) {
            setIsLoading(false);
            setAnimationClass(''); // Убираем анимацию для кэшированных изображений
        } else {
            image.onload = () => {
                setIsLoading(false);
                // Класс анимации уже установлен
            };
            image.onerror = () => {
                // Обработка ошибки загрузки
                setIsLoading(false);
                setAnimationClass(''); // Не анимируем при ошибке
            };
        }
    }, [src]);

    if (isLoading) {
        return <div className={`skeleton-loader animate-pulse ${className}`} />;
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={`${className} ${animationClass}`}
            // Удаляем класс анимации после ее завершения, чтобы она не повторялась при ре-рендерах
            onAnimationEnd={() => setAnimationClass('')}
        />
    );
};