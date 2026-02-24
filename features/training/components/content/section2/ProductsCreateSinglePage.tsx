import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: превью фото с кнопкой удаления
const MockPhotoPreview: React.FC<{ onClear: () => void }> = ({ onClear }) => (
    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
        <img src="https://via.placeholder.com/150" alt="Preview" className="w-full h-full object-cover"/>
        <button
            onClick={onClear}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            title="Удалить фото"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
);

// Mock компонент: секция загрузки фото
const MockPhotoUploadSection: React.FC<{ hasError?: boolean }> = ({ hasError }) => {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [useDefault, setUseDefault] = useState(false);

    return (
        <div className="flex items-start gap-4">
            {photoPreview ? (
                <MockPhotoPreview onClear={() => setPhotoPreview(null)} />
            ) : (
                <div className={`w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center flex-shrink-0 ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                    <span className={`text-xs text-center ${hasError ? 'text-red-500' : 'text-gray-400'}`}>Нет фото</span>
                </div>
            )}
            
            <div className="w-44 flex-shrink-0 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Главное фото <span className="text-red-500">*</span></label>
                <button 
                    onClick={() => setPhotoPreview('https://via.placeholder.com/150')}
                    className="w-full h-10 text-sm border p-2 rounded-md hover:bg-gray-50 text-gray-700 bg-white flex items-center justify-center"
                >
                    Выбрать файл
                </button>
                <input 
                    type="text" 
                    placeholder="Или ссылка..." 
                    className={`w-full h-10 text-sm border p-2 rounded-md focus:outline-none focus:ring-2 ${hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                />
                <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="checkbox" 
                        checked={useDefault}
                        onChange={(e) => {
                            setUseDefault(e.target.checked);
                            if (e.target.checked) setPhotoPreview('https://via.placeholder.com/150?text=Default');
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label className="text-xs text-gray-700 cursor-pointer select-none">
                        Заглушка (дефолтное фото)
                    </label>
                </div>
            </div>
        </div>
    );
};

// Mock компонент: всплывающее окно единичного создания
const MockCreateSingleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Создать новый товар</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <main className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex items-start gap-4">
                    <MockPhotoUploadSection />
                    <div className="flex-grow space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Категория <span className="text-red-500">*</span></label>
                            <select className="w-full h-10 px-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm">
                                <option>Выберите категорию...</option>
                                <option>Еда</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Подборка</label>
                            <select className="w-full h-10 px-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm">
                                <option>Не выбрано</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Название <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Например: Пицца Пепперони (минимум 4 символа)" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Описание <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">AI-помощник</button>
                            <button className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">Переменные</button>
                        </div>
                    </div>
                    <textarea rows={4} className="w-full mt-1 p-2 border rounded-md custom-scrollbar focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Введите описание товара (минимум 10 символов)..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Цена, ₽ <span className="text-red-500">*</span></label>
                        <input type="number" className="w-full mt-1 p-2 border rounded-md no-spinners focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Старая цена</label>
                        <input type="number" placeholder="Необяз." className="w-full mt-1 p-2 border rounded-md no-spinners focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Артикул</label>
                        <input type="text" placeholder="Необяз." className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
            </main>

            <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                <button className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 w-24 flex justify-center items-center">Создать</button>
            </footer>
        </div>
    </div>
);

// ===================================================================== 
// Основной компонент страницы
// =====================================================================
export const ProductsCreateSinglePage: React.FC<ContentProps> = ({ title }) => {
    const [showSingleModal, setShowSingleModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Используется, когда нужно добавить один товар с детальным описанием. Всплывающее окно открывается из основной таблицы товаров 
                по кнопке "Создать" в правом верхнем углу.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <h4 className="font-bold text-blue-900 mb-2">Обязательные поля (помечены красной звездочкой *):</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                    <li>• <strong>Главное фото</strong> — загрузка файла, URL или чекбокс "Заглушка (дефолтное фото)"</li>
                    <li>• <strong>Название</strong> — минимум 4 символа</li>
                    <li>• <strong>Описание</strong> — минимум 10 символов</li>
                    <li>• <strong>Цена, ₽</strong> — обязательное числовое значение</li>
                    <li>• <strong>Категория</strong> — выбор из списка категорий VK</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура модального окна</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Загрузка фото (слева вверху)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Фото товара можно добавить тремя способами: загрузка файла ("Выбрать файл"), вставка URL ("Или ссылка..."), 
                или использование дефолтного фото VK (чекбокс "Заглушка"). При наведении на загруженное фото появляется кнопка удаления.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Категория и подборка (справа вверху)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Категория обязательна — выбирается из стандартных категорий VK. Подборка необязательна — если в проекте созданы подборки товаров, 
                можно сразу добавить товар в одну из них.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Название и описание</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Название минимум 4 символа. У описания есть кнопки "AI-помощник" (генерация описания) и "Переменные" (вставка переменных проекта).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Цена, старая цена, артикул</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Три поля в одном ряду. Цена обязательна, старая цена и артикул — необязательны.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим копирования</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Если открыть всплывающее окно через кнопку "Копировать" на карточке существующего товара, все поля заполнятся данными исходного товара, 
                а к названию автоматически добавится префикс <strong>"NEW "</strong>.
            </p>

            <Sandbox 
                title="Попробуйте: Единичное создание товара"
                description="Нажмите кнопку ниже, чтобы открыть интерактивный пример всплывающего окна создания товара."
                instructions={[
                    'Нажмите кнопку "Создать товар"',
                    'Изучите структуру формы: фото слева, категории справа',
                    'Обратите внимание на кнопки "AI-помощник" и "Переменные"',
                    'Попробуйте загрузить фото кликом на "Выбрать файл"',
                    'Поставьте чекбокс "Заглушка" — фото заменится на дефолтное'
                ]}
            >
                <button 
                    onClick={() => setShowSingleModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Создать товар
                </button>
                {showSingleModal && <MockCreateSingleModal onClose={() => setShowSingleModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-5-1-create-single" />
        </article>
    );
};
