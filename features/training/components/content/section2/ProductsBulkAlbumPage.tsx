import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: AlbumSelector (выпадающий список подборок)
const AlbumSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => {
    const albums = [
        { id: '', name: 'Без подборки (удалить из подборки)' },
        { id: '1', name: 'Новинки 2024' },
        { id: '2', name: 'Зимняя коллекция' },
        { id: '3', name: 'Летняя коллекция' },
        { id: '4', name: 'Хиты продаж' },
        { id: '5', name: 'Распродажа' },
        { id: '6', name: 'Архив' }
    ];

    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            {albums.map(album => (
                <option key={album.id} value={album.id}>
                    {album.name}
                </option>
            ))}
        </select>
    );
};

// Mock компонент: всплывающее окно изменения подборки
const MockBulkAlbumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedAlbum, setSelectedAlbum] = useState('5');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение подборки</h2>
                    <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>42</strong> выбранным товарам.</p>
                </header>

                <main className="p-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Выберите подборку</label>
                        <AlbumSelector value={selectedAlbum} onChange={setSelectedAlbum} />
                        <p className="text-xs text-gray-500">
                            Все выбранные товары будут перемещены в эту подборку. 
                            Если выбрать "Без подборки", товары будут удалены из текущих подборок.
                        </p>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Применить</button>
                </footer>
            </div>
        </div>
    );
};

export const ProductsBulkAlbumPage: React.FC<ContentProps> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое изменение подборки позволяет быстро переместить группу товаров в другую подборку или убрать их из всех подборок. 
                Это самый простой режим массового редактирования — всего один выпадающий список.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое подборка</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Подборка (или "Альбом") — это способ группировки товаров в VK для удобной навигации покупателей. 
                Примеры подборок:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Новинки 2024</strong> — недавно добавленные товары</li>
                <li><strong>Зимняя коллекция</strong> — сезонная группа</li>
                <li><strong>Хиты продаж</strong> — самые популярные позиции</li>
                <li><strong>Распродажа</strong> — акционные товары</li>
                <li><strong>Архив</strong> — товары, снятые с продажи (но не удалённые)</li>
            </ul>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">Зачем менять подборки массово:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Конец сезона: переместить 150 летних товаров в "Архив"</li>
                    <li>Начало акции: добавить 80 товаров в "Распродажа"</li>
                    <li>Реорганизация: перенести товары из "Новинки" в основную коллекцию</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работает</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое изменение подборки — самый простой режим. В модальном окне всего одно поле:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Выберите товары через фильтры и "Выбрать"</li>
                <li>Нажмите "Изменить" → "Подборку"</li>
                <li>В выпадающем списке выберите целевую подборку</li>
                <li>Нажмите "Применить"</li>
            </ol>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Действие</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Выбор в списке</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Результат</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">Переместить в другую подборку</td>
                            <td className="px-4 py-2 font-medium">Выбрать "Распродажа"</td>
                            <td className="px-4 py-2 text-green-600">Все товары теперь в подборке "Распродажа"</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Убрать из подборки</td>
                            <td className="px-4 py-2 font-medium">Выбрать "Без подборки"</td>
                            <td className="px-4 py-2 text-orange-600">Товары удалены из всех подборок</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Отправить в архив</td>
                            <td className="px-4 py-2 font-medium">Выбрать "Архив"</td>
                            <td className="px-4 py-2 text-gray-600">Товары в архивной подборке</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Важные особенности</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Один товар — одна подборка</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В VK один товар может находиться только в одной подборке одновременно. 
                Если товар уже в подборке "Новинки", а вы переместите его в "Распродажа", 
                он автоматически исчезнет из "Новинки".
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Опция "Без подборки"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Выбор "Без подборки (удалить из подборки)" убирает товары из всех подборок. 
                Товары останутся в каталоге, но не будут отображаться ни в одной тематической группе.
            </p>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно:</h4>
                <p className="text-sm text-yellow-800">
                    Удаление товара из подборки <strong>не удаляет товар</strong> из магазина. 
                    Товар останется в каталоге и будет виден покупателям при поиске или просмотре всех товаров. 
                    Для полного удаления товаров используйте кнопку "Удалить" (красная кнопка справа).
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практические сценарии</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Сценарий 1: Конец сезона</h4>
                    <p className="text-sm text-green-700 mb-2">
                        <strong>Задача:</strong> Летний сезон закончился, нужно убрать 150 летних товаров с витрины, но не удалять их.
                    </p>
                    <p className="text-xs text-green-600">
                        <strong>Решение:</strong> Отфильтровать по подборке "Летняя коллекция" → "Выбрать" → "Изменить" → "Подборку" → 
                        выбрать "Архив" → "Применить". Все товары переместятся в архив.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Сценарий 2: Запуск распродажи</h4>
                    <p className="text-sm text-purple-700 mb-2">
                        <strong>Задача:</strong> 80 товаров с низкими остатками нужно добавить в подборку "Распродажа" для увеличения видимости.
                    </p>
                    <p className="text-xs text-purple-600">
                        <strong>Решение:</strong> Отфильтровать по низким остаткам → "Выбрать" → "Изменить" → "Подборку" → 
                        выбрать "Распродажа" → "Применить".
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">Сценарий 3: Очистка "Новинок"</h4>
                    <p className="text-sm text-orange-700 mb-2">
                        <strong>Задача:</strong> Товары в "Новинки" устарели (добавлены 3 месяца назад), нужно убрать их из этой подборки.
                    </p>
                    <p className="text-xs text-orange-600">
                        <strong>Решение:</strong> Отфильтровать "Новинки" → "Выбрать" → "Изменить" → "Подборку" → 
                        выбрать "Без подборки" → "Применить". Товары останутся в каталоге, но выйдут из "Новинок".
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Сценарий 4: Реорганизация коллекций</h4>
                    <p className="text-sm text-blue-700 mb-2">
                        <strong>Задача:</strong> Создали новую подборку "Осенняя коллекция", нужно переместить туда 60 товаров из разных подборок.
                    </p>
                    <p className="text-xs text-blue-600">
                        <strong>Решение:</strong> Использовать поиск или фильтры для выбора 60 нужных товаров → "Выбрать" → "Изменить" → "Подборку" → 
                        выбрать "Осенняя коллекция" → "Применить".
                    </p>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-indigo-900 mb-2">💡 Совет про подборки:</h4>
                <p className="text-sm text-indigo-800">
                    Используйте подборку "Архив" для товаров, которые временно сняты с продажи (например, ожидается поставка). 
                    Это позволяет сохранить историю продаж и быстро вернуть товар на витрину, просто сменив подборку обратно.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение подборки"
                description="Интерактивное всплывающее окно с выпадающим списком подборок."
                instructions={[
                    'Нажмите кнопку "Открыть окно"',
                    'Выберите подборку из выпадающего списка',
                    'Попробуйте выбрать "Без подборки" — обратите внимание на пояснение',
                    'Посмотрите, как меняется описание под селектором',
                    'Это самый простой режим массового редактирования'
                ]}
            >
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Открыть окно
                </button>
                {showModal && <MockBulkAlbumModal onClose={() => setShowModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-5-bulk-album" />
        </article>
    );
};
