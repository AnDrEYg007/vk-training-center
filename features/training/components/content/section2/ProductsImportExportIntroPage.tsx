import React from 'react';
import { ContentProps, NavigationButtons, NavigationLink } from '../shared';

export const ProductsImportExportIntroPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел описывает работу с файлами товаров: как загружать товары из Excel/CSV, как обновлять существующие 
                и как выгружать каталог для работы в табличных редакторах.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Было / Стало</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {/* Было */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">😓</span> Раньше (без приложения)
                    </h3>
                    <ul className="space-y-3 text-sm text-orange-800">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold mt-0.5">×</span>
                            <span>Добавлять 50 товаров руками через админку VK — по одному товару за раз</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold mt-0.5">×</span>
                            <span>Обновлять цены в Excel, потом вручную переносить в каждую карточку товара</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold mt-0.5">×</span>
                            <span>Выгружать товары через экспорт VK, получать непонятный формат без VK ID</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold mt-0.5">×</span>
                            <span>Тратить часы на синхронизацию каталога между Google Sheets и VK</span>
                        </li>
                    </ul>
                </div>

                {/* Стало */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✨</span> Сейчас (в приложении)
                    </h3>
                    <ul className="space-y-3 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span>Загрузить CSV/XLSX с 50 товарами — все создадутся за одну операцию</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span>Изменить цены в Excel, загрузить файл — система найдёт товары и обновит автоматически</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span>Скачать xlsx с VK ID и ссылками — можно вернуться и обновить нужные товары</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span>Двусторонняя синхронизация: изменили в Excel → загрузили → товары обновились в VK</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Разделы</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <NavigationLink 
                    to="2-3-6-1-import-file" 
                    title="Импорт из файла (CSV/XLSX)"
                    description="Как загрузить товары из табличного файла, два режима: создание новых и обновление существующих"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-6-2-column-mapping" 
                    title="Маппинг колонок при импорте"
                    description="Автоматическое сопоставление колонок файла с полями системы, ручная настройка маппинга"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-6-3-update-from-file" 
                    title="Обновление товаров из файла"
                    description="Умное сопоставление товаров по VK ID, названию или артикулу, групповое обновление полей"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-6-4-export-csv" 
                    title="Экспорт в CSV"
                    description="Выгрузка каталога в CSV с поддержкой кириллицы, формат для Excel"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-6-5-export-xlsx" 
                    title="Экспорт в XLSX"
                    description="Выгрузка каталога в Excel-формат, готово к редактированию и обратной загрузке"
                    variant="related"
                />
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практические сценарии</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <h4 className="font-bold text-purple-900 mb-2">📦 Массовое добавление товаров</h4>
                    <p className="text-sm text-purple-800">
                        Заказчик прислал Excel с 100 товарами. Нажали "Загрузить", выбрали "Создать новые товары", 
                        настроили маппинг колонок — все товары создались автоматически. Экономия: 2 часа работы.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-2">💰 Массовое обновление цен</h4>
                    <p className="text-sm text-blue-800">
                        Скачали xlsx с текущими товарами, изменили цены в колонке "Цена", загрузили обратно с режимом 
                        "Обновить существующие" → система нашла товары по VK ID и обновила только цены. Экономия: 1 час.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-2">🔄 Синхронизация с внешней базой</h4>
                    <p className="text-sm text-green-800">
                        Товары хранятся в Google Sheets. Каждую неделю экспортируем оттуда в xlsx, загружаем в приложение 
                        с режимом "Обновить" → все изменения (новые описания, цены, артикулы) автоматически применяются.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Совет:</h4>
                <p className="text-sm text-blue-800">
                    Всегда экспортируйте товары перед массовым обновлением — это создаёт резервную копию. 
                    Если что-то пойдёт не так, можно вернуть старые данные.
                </p>
            </div>

            <NavigationButtons currentPath="2-3-6-import-export" />
        </article>
    );
};
