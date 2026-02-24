import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockConditionsBuilder, CONDITION_TYPES } from './GeneralContestsMocks';

/**
 * 2.4.4.5. Условия участия
 */
export const GeneralContestsConditions: React.FC<ContentProps> = ({ title }) => {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое условия участия?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Условия — это действия, которые должен выполнить участник, чтобы попасть в розыгрыш. 
        Универсальные конкурсы позволяют комбинировать несколько условий: лайк + репост, комментарий или подписка — любые сочетания.
      </p>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Доступные условия</h2>
      <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONDITION_TYPES.map(ct => (
          <div key={ct.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">{ct.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">{ct.label}</h4>
              <p className="text-xs text-gray-600 mt-1">
                {ct.type === 'like' && 'Участник должен поставить лайк на стартовый пост конкурса'}
                {ct.type === 'repost' && 'Участник должен сделать репост поста к себе на стену'}
                {ct.type === 'comment' && 'Участник должен оставить комментарий под постом (можно проверить наличие ключевых слов)'}
                {ct.type === 'subscription' && 'Участник должен быть подписан на сообщество'}
                {ct.type === 'member_of_group' && 'Участник должен вступить в группу-спонсора (продвижение партнёров)'}
                {ct.type === 'mailing' && 'Участник должен быть подписан на рассылку сообщества'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Конструктор условий</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Условия настраиваются визуально — через конструктор. Вы добавляете нужные действия, и система проверяет их выполнение автоматически.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Простой пример"
          description="Конкурс с двумя условиями: лайк И репост (оба обязательны)"
          instructions={[
            'Участник попадёт в розыгрыш только если <strong>выполнит оба действия</strong>',
            'Кнопка <strong>"Добавить условие (И)"</strong> позволяет добавить ещё одно обязательное действие'
          ]}
        >
          <MockConditionsBuilder selectedConditions={['like', 'repost']} />
        </Sandbox>
      </div>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Логика "И" и "ИЛИ"</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Система поддерживает два типа логики:
      </p>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>И (AND)</strong> — внутри одного варианта все условия обязательны. Участник должен выполнить <em>все</em> действия.</li>
        <li><strong>ИЛИ (OR)</strong> — можно создать несколько вариантов участия. Участник выполняет <em>любой</em> из них.</li>
      </ul>

      <div className="not-prose my-6">
        <Sandbox
          title="Сложный пример с ИЛИ"
          description="Два варианта участия: (лайк + репост) ИЛИ (комментарий)"
          instructions={[
            '<strong>Вариант 1:</strong> Поставить лайк <strong>И</strong> сделать репост',
            '<strong>Вариант 2:</strong> Написать комментарий',
            'Участник может выбрать любой вариант — ему достаточно выполнить <strong>хотя бы один</strong>',
            'Кнопка <strong>"Добавить вариант (ИЛИ)"</strong> создаёт альтернативный путь участия'
          ]}
        >
          <MockConditionsBuilder selectedConditions={['like', 'repost']} showGroupExample={true} />
        </Sandbox>
      </div>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как система проверяет условия?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        После публикации стартового поста система автоматически, каждые несколько минут:
      </p>
      <div className="not-prose my-6">
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p className="text-sm text-gray-700">Запрашивает у VK API список пользователей, которые поставили лайк на пост</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <p className="text-sm text-gray-700">Проверяет репосты (кто поделился постом)</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <p className="text-sm text-gray-700">Читает комментарии и проверяет, есть ли в них ключевые слова (если настроено)</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <p className="text-sm text-gray-700">Проверяет подписку на сообщество и вступление в группы-спонсоры</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
            <p className="text-sm text-gray-700">Сравнивает с чёрным списком — исключает заблокированных пользователей</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">6</span>
            <p className="text-sm text-gray-700">Добавляет всех прошедших проверку в список участников</p>
          </div>
        </div>
      </div>

      <div className="not-prose my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Полезно знать</p>
            <p className="text-sm text-blue-800">
              Проверка происходит автоматически в фоновом режиме. Участники появляются в списке через 5-10 минут после выполнения условий.
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons currentPath="2-4-4-5-conditions" />
    </article>
  );
};
