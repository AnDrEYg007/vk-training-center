import React, { useState } from 'react';
import { Sandbox, NavigationButtons, ContentProps } from '../shared';
import { MockImageRibbon } from './SuggestedPostsMocks';

// =====================================================================
// Страница обучения: Лента изображений
// =====================================================================
export const ImageRibbonPage: React.FC<ContentProps> = ({ title }) => {
    const [demoImages] = useState<string[]>([
        'https://picsum.photos/seed/img1/400/400',
        'https://picsum.photos/seed/img2/400/400',
        'https://picsum.photos/seed/img3/400/400',
        'https://picsum.photos/seed/img4/400/400',
        'https://picsum.photos/seed/img5/400/400',
    ]);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Лента изображений</strong> — это горизонтальная полоса с миниатюрами фотографий, которая появляется вверху карточки предложенного поста, если к нему прикреплены изображения.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раньше приходилось открывать каждое изображение отдельно, чтобы посмотреть его целиком. Теперь все фотографии видны сразу — можно быстро оценить визуальный контент поста и кликнуть на нужное для просмотра в полном размере.
            </p>

            <hr className="!my-10" />

            {/* Секция 1: Внешний вид */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Внешний вид ленты
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Лента представляет собой горизонтальный ряд квадратных миниатюр размером <strong>96×96 пикселей</strong> (w-24 h-24). Она расположена в верхней части карточки, сразу под заголовком или статусом поста.
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Фон:</strong> светло-серый полупрозрачный (bg-gray-100/70)</li>
                    <li><strong>Граница снизу:</strong> серая линия (border-b border-gray-200) отделяет ленту от текста поста</li>
                    <li><strong>Отступы:</strong> небольшой padding (p-2) внутри ленты</li>
                    <li><strong>Расстояние между миниатюрами:</strong> 8px (space-x-2)</li>
                    <li><strong>Скругление углов:</strong> верхние углы скруглены (rounded-t-lg), миниатюры также имеют скругление (rounded-md)</li>
                </ul>
            </div>

            <Sandbox
                title="Пример ленты изображений"
                description="Попробуйте кликнуть на любую миниатюру — откроется просмотр в полном размере."
                instructions={[
                    'Наведите курсор на миниатюру — появится рамка-индикатор фокуса (синяя)',
                    'Кликните по изображению — откроется всплывающее окно с полноразмерной версией',
                    'Если изображений много, появится горизонтальная прокрутка'
                ]}
            >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-xl">
                    <MockImageRibbon 
                        images={demoImages} 
                        onImageClick={(url) => setSelectedImage(url)} 
                    />
                    <div className="p-4">
                        <p className="text-sm text-gray-600">
                            Это карточка предложенного поста с лентой изображений вверху
                        </p>
                    </div>
                </div>

                {/* Всплывающее окно просмотра */}
                {selectedImage && (
                    <div 
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl max-h-screen p-4">
                            <button
                                className="absolute top-6 right-6 text-white hover:text-gray-300 text-3xl font-bold"
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Просмотр" 
                                className="max-w-full max-h-screen object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Секция 2: Интерактивность */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Взаимодействие с лентой
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Клик по миниатюре
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При клике на любое изображение в ленте открывается всплывающее окно с полноразмерной версией. Это удобно, когда нужно рассмотреть детали фото или проверить качество перед публикацией.
            </p>

            <div className="not-prose">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Важно:</strong> Клик по изображению не открывает саму карточку поста — только всплывающее окно просмотра фото. Это позволяет быстро просмотреть все изображения, не переходя в режим редактирования.
                    </p>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Индикатор фокуса
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При наведении курсора или фокусе (например, при навигации с клавиатуры) вокруг миниатюры появляется <strong>синяя рамка</strong> (ring-2 ring-indigo-500). Это визуальная подсказка, что элемент интерактивный и его можно кликнуть.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Горизонтальная прокрутка
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если к посту прикреплено много изображений (больше, чем помещается на экране), лента становится прокручиваемой по горизонтали. Для этого используется стандартная прокрутка с кастомным стилем скроллбара (custom-scrollbar).
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Скроллбар:</strong> тонкий (6px), серый, появляется только при наличии прокрутки</li>
                    <li><strong>Миниатюры не сжимаются:</strong> каждая всегда остаётся 96×96px, даже если их много</li>
                    <li><strong>Прокрутка мышью/тачпадом:</strong> работает как в обычном горизонтальном списке</li>
                </ul>
            </div>

            <Sandbox
                title="Пример с большим количеством изображений"
                description="Лента с 8 изображениями — попробуйте прокрутить горизонтально."
            >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-xl">
                    <MockImageRibbon 
                        images={[
                            'https://picsum.photos/seed/scroll1/400/400',
                            'https://picsum.photos/seed/scroll2/400/400',
                            'https://picsum.photos/seed/scroll3/400/400',
                            'https://picsum.photos/seed/scroll4/400/400',
                            'https://picsum.photos/seed/scroll5/400/400',
                            'https://picsum.photos/seed/scroll6/400/400',
                            'https://picsum.photos/seed/scroll7/400/400',
                            'https://picsum.photos/seed/scroll8/400/400',
                        ]} 
                        onImageClick={(url) => setSelectedImage(url)} 
                    />
                    <div className="p-4">
                        <p className="text-sm text-gray-600">
                            Прокрутите ленту вправо, чтобы увидеть все изображения
                        </p>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Секция 3: Оптимизация загрузки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Ленивая загрузка изображений
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Чтобы не замедлять работу приложения, изображения в ленте загружаются <strong>постепенно</strong> (lazy loading). Пока картинка загружается, на её месте показывается серая анимированная заглушка (skeleton loader).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Как это работает
            </h3>

            <div className="not-prose">
                <ol className="list-decimal list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Skeleton-заглушка:</strong> При первой загрузке на месте миниатюры показывается серый прямоугольник с пульсирующей анимацией (skeleton-loader animate-pulse)</li>
                    <li><strong>Предзагрузка:</strong> Браузер начинает загружать изображение в фоновом режиме</li>
                    <li><strong>Проверка кэша:</strong> Если изображение уже было загружено ранее (image.complete), оно показывается сразу без skeleton</li>
                    <li><strong>Плавное появление:</strong> Когда картинка загружена, она появляется с анимацией затухания (animate-image-fade-in)</li>
                    <li><strong>Очистка:</strong> После завершения анимации класс удаляется, чтобы не перерисовывать компонент лишний раз</li>
                </ol>
            </div>

            <div className="not-prose">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-sm text-green-800">
                        <strong>Польза:</strong> Ленивая загрузка экономит трафик и ускоряет открытие страницы. Если у пользователя медленный интернет, он увидит skeleton вместо долгого ожидания белого экрана.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Секция 4: Особенности использования */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Когда лента появляется
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Лента изображений показывается <strong>только если к посту прикреплены фотографии</strong>. Если изображений нет — лента не отображается вообще.
            </p>

            <div className="not-prose">
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-6">
                    <p className="text-sm text-gray-700">
                        <strong>Логика:</strong> В коде есть проверка: <code>if (!images || images.length === 0) return null</code>. Это означает, что компонент просто не рендерится для постов без изображений.
                    </p>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Практические сценарии
            </h3>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Пост с 1 изображением:</strong> Лента покажет одну миниатюру — клик откроет полноразмерную версию</li>
                    <li><strong>Пост с несколькими фото:</strong> Все миниатюры выстроятся в ряд, при необходимости появится горизонтальная прокрутка</li>
                    <li><strong>Текстовый пост без фото:</strong> Ленты не будет, карточка начнётся сразу с текста</li>
                </ul>
            </div>

            <Sandbox
                title="Карточка без изображений"
                description="Пример поста, где лента изображений отсутствует."
            >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-xl">
                    <MockImageRibbon 
                        images={[]} 
                        onImageClick={() => {}} 
                    />
                    <div className="p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Текстовый пост</p>
                        <p className="text-sm text-gray-600">
                            Это пост без изображений. Лента не отображается, карточка начинается сразу с заголовка и текста.
                        </p>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Итоги */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Итоги
            </h2>

            <div className="not-prose">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-bold text-indigo-900 mb-3">Что нужно запомнить:</h4>
                    <ul className="list-disc list-inside text-base text-indigo-800 space-y-2">
                        <li>Лента показывает миниатюры 96×96px с горизонтальной прокруткой</li>
                        <li>Клик по изображению открывает всплывающее окно для просмотра в полном размере</li>
                        <li>Если изображений нет — лента не отображается</li>
                        <li>Ленивая загрузка с skeleton-заглушкой ускоряет работу приложения</li>
                        <li>Синяя рамка фокуса помогает понять, что элемент кликабельный</li>
                    </ul>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-2-2-image-ribbon" />
        </article>
    );
};
