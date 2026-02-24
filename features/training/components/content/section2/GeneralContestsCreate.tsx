import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * 2.4.4.3. Создание конкурса
 */
export const GeneralContestsCreate: React.FC<ContentProps> = ({ title }) => {
  const [step, setStep] = useState(1);

  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        {title}
      </h1>

      {/* Как создать первый конкурс? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как создать первый конкурс?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Создание конкурса начинается с нажатия кнопки <strong>"+ Создать"</strong> или <strong>"Создать конкурс"</strong> 
        на странице списка конкурсов. Система откроет редактор с настройками по умолчанию, которые вы сможете изменить под свои нужды.
      </p>

      {/* Быстрый старт за 3 шага */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Быстрый старт за 3 шага</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Для запуска простого конкурса достаточно выполнить три действия. Остальные настройки система заполнит сама разумными значениями.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Пошаговая инструкция"
          description="Переключайте шаги, чтобы увидеть процесс создания конкурса"
          instructions={[
            'Нажимайте кнопки <strong>"Шаг 1"</strong>, <strong>"Шаг 2"</strong>, <strong>"Шаг 3"</strong> для переключения',
            'Каждый шаг показывает, что именно нужно сделать'
          ]}
        >
          {/* Кнопки переключения шагов */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setStep(1)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Шаг 1
            </button>
            <button 
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Шаг 2
            </button>
            <button 
              onClick={() => setStep(3)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Шаг 3
            </button>
          </div>

          {/* Содержимое шагов */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Придумайте название конкурса</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Название — это внутренняя метка для вашего удобства. Участники его не увидят. 
                      Например: "Еженедельный розыгрыш пиццы" или "Февральский конкурс".
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">Название конкурса (внутреннее)</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Например: Ежемесячный розыгрыш пиццы"
                        defaultValue="Розыгрыш промокодов"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Придумайте понятное название, чтобы легко находить конкурс в списке
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Напишите текст поста о конкурсе</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Это текст, который увидят участники в ВКонтакте. Опишите, что нужно сделать и что можно выиграть. 
                      Система автоматически опубликует этот пост в указанное время.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">Текст поста</label>
                      <textarea
                        className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-vertical"
                        placeholder="Опишите условия конкурса"
                        defaultValue="🎉 Розыгрыш промокодов на пиццу!&#10;&#10;Что нужно сделать:&#10;❤️ Поставить лайк&#10;📢 Сделать репост&#10;&#10;Итоги подведём через неделю. Удачи! 🍕"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Можно добавить эмодзи, чтобы пост выглядел привлекательнее
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Добавьте промокоды для победителей</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Загрузите промокоды, которые получат победители. Это могут быть коды на скидку, ссылки на подарки 
                      или просто текст с инструкцией. Минимум промокодов должно совпадать с количеством победителей.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">Промокоды (по одному на строку)</label>
                          <textarea
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px] resize-vertical font-mono"
                            placeholder="PIZZA50&#10;DISCOUNT30&#10;FREEDELIVERY"
                            defaultValue="PIZZA50&#10;DISCOUNT30&#10;WINNER25"
                          />
                        </div>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                          Загрузить промокоды
                        </button>
                        <p className="text-xs text-gray-500">
                          💡 Свободных промокодов должно быть не меньше, чем количество победителей (по умолчанию 1)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Итоговое действие */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Готово!</p>
                <p className="text-sm text-green-800">
                  Нажмите кнопку <strong>"Сохранить"</strong> в редакторе. Система автоматически опубликует пост в указанное время, 
                  начнёт собирать участников и выберет победителей по завершении конкурса.
                </p>
              </div>
            </div>
          </div>
        </Sandbox>
      </div>

      {/* Что настроится автоматически? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что настроится автоматически?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Если вы выполнили только 3 шага выше, система применит следующие настройки по умолчанию:
      </p>

      <div className="not-prose my-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Параметр</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Значение по умолчанию</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">Дата старта</td>
                <td className="px-4 py-3 text-gray-700">Через 5 минут от текущего времени</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">Условия участия</td>
                <td className="px-4 py-3 text-gray-700">Поставить лайк (можно изменить)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">Длительность</td>
                <td className="px-4 py-3 text-gray-700">24 часа (1 день)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">Количество победителей</td>
                <td className="px-4 py-3 text-gray-700">1 человек</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">Цикличность</td>
                <td className="px-4 py-3 text-gray-700">Нет (разовый конкурс)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">Статус</td>
                <td className="px-4 py-3 text-gray-700">Активен (система запустит автоматически)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="!text-base !leading-relaxed !text-gray-700">
        Все эти параметры можно изменить в редакторе до сохранения или после — в любой момент до старта конкурса.
      </p>

      {/* Что происходит после сохранения? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что происходит после сохранения?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        После нажатия кнопки "Сохранить" система выполнит следующие действия:
      </p>

      <div className="not-prose my-6">
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Создаёт конкурс в базе данных</h4>
              <p className="text-sm text-gray-600">
                Все настройки сохраняются. Конкурс появляется в списке конкурсов проекта.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Добавляет системные посты в календарь</h4>
              <p className="text-sm text-gray-600">
                В календаре появятся два системных поста: <strong>стартовый</strong> (с голубым бейджем "Конкурс") 
                и <strong>итоговый</strong> (с оранжевым бейджем "Итоги"). Они опубликуются автоматически в назначенное время.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Запускает автоматический сбор участников</h4>
              <p className="text-sm text-gray-600">
                После публикации стартового поста система начнёт проверять, кто выполнил условия (лайк, репост, комментарий). 
                Все участники появятся в табе "Участники".
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Выбирает победителей и публикует итоги</h4>
              <p className="text-sm text-gray-600">
                Когда время конкурса истечёт, система случайным образом выберет указанное количество победителей, 
                опубликует пост с их именами и отправит промокоды в личные сообщения.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Важные моменты */}
      <div className="not-prose my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Важно знать</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Конкурс можно редактировать до момента публикации стартового поста</li>
              <li>• Промокодов должно быть не меньше, чем победителей, иначе конкурс не запустится</li>
              <li>• Если выключить конкурс, система прекратит сбор участников</li>
            </ul>
          </div>
        </div>
      </div>

      <NavigationButtons currentPath="2-4-4-3-create" />
    </article>
  );
};
