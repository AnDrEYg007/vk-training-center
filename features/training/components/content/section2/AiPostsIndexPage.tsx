import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';
import { MockAiPostCard } from './AiPostsMocks';

/**
 * 2.4.5. AI посты — главная страница раздела
 * Краткая обзорная страница с описанием функционала
 */
export const AiPostsIndexPage: React.FC<ContentProps> = ({ title }) => {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        {title}
      </h1>

      {/* Что это такое? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        <strong>AI посты</strong> — это инструмент автоматизации создания постов для VK с помощью искусственного интеллекта.
        Система генерирует контент на основе заданных вами параметров: тема, стиль, длина, ключевые слова, эмодзи и другие настройки.
      </p>

      {/* Раньше vs Теперь */}
      <div className="not-prose my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Раньше */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (без системы)</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Вручную придумывали темы и идеи для каждого поста</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Писали текст самостоятельно или через ChatGPT с копированием</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Редактировали и адаптировали текст под нужный формат</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Вручную подбирали эмодзи и размещали их в тексте</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Каждый пост требовал 15-30 минут работы</span>
              </li>
            </ul>
          </div>

          {/* Теперь */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-green-900 mb-3">✅ Теперь (с системой)</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Система сама генерирует текст поста по вашим параметрам</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Автоматически подбирает эмодзи в нужных местах</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Адаптирует стиль и тон под ваши требования</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Создание одного поста занимает 1-2 минуты</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Можно создавать серии постов с общей тематикой</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Пример AI поста */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-12">Как выглядит AI пост?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Вот пример карточки AI поста в системе. Каждый пост содержит статус генерации, 
        сгенерированный текст, настройки генерации и кнопки управления:
      </p>

      {/* Интерактивный пример */}
      <div className="not-prose my-6">
        <MockAiPostCard 
          post={{
            id: 'example-1',
            title: 'Пост про летнюю коллекцию',
            description: 'Автоматически генерируемый пост о новинках',
            isActive: true,
            nextRun: '20.02.26, 14:00',
            recurrenceType: 'days',
            recurrenceInterval: 2,
            systemPrompt: 'Ты SMM-менеджер магазина одежды',
            userPrompt: 'Напиши пост про новую коллекцию летней одежды',
            generatedText: '🌞 Встречайте новую летнюю коллекцию! ☀️\n\nЯркие краски, легкие ткани и стильные фасоны — всё, что нужно для незабываемого лета! 👗✨\n\n🔥 В коллекции вы найдете:\n• Воздушные платья и сарафаны\n• Стильные шорты и юбки\n• Яркие футболки и топы\n\nУспейте заказать со скидкой 20% до конца недели! 🎁',
            images: [],
            mediaMode: 'all'
          }}
        />
      </div>

      {/* Основные возможности */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-12">Основные возможности</h2>
      <div className="not-prose my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Быстрая генерация */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="text-base font-bold text-blue-900 mb-1">Быстрая генерация</h3>
                <p className="text-sm text-blue-800">
                  Создание поста занимает 10-30 секунд в зависимости от модели AI
                </p>
              </div>
            </div>
          </div>

          {/* Гибкие настройки */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚙️</div>
              <div>
                <h3 className="text-base font-bold text-purple-900 mb-1">Гибкие настройки</h3>
                <p className="text-sm text-purple-800">
                  Настройте длину, стиль, эмодзи, температуру и другие параметры генерации
                </p>
              </div>
            </div>
          </div>

          {/* Несколько моделей */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="text-base font-bold text-green-900 mb-1">Несколько моделей AI</h3>
                <p className="text-sm text-green-800">
                  Выбирайте между GPT-4o, Claude 3.5 Sonnet и другими моделями
                </p>
              </div>
            </div>
          </div>

          {/* История и редактирование */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <h3 className="text-base font-bold text-orange-900 mb-1">История и редактирование</h3>
                <p className="text-sm text-orange-800">
                  Все посты сохраняются, их можно просмотреть, отредактировать или перегенерировать
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Разделы документации */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-12">Разделы документации</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Изучите следующие разделы, чтобы освоить работу с AI постами:
      </p>

      <div className="not-prose my-6">
        <div className="space-y-3">
          {/* Обзор функционала */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              📋 Обзор функционала
            </h3>
            <p className="text-sm text-gray-700">
              Подробное описание всех возможностей AI постов: зачем они нужны, 
              как работают, какие модели доступны и как происходит генерация
            </p>
          </div>

          {/* Список AI постов */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              📑 Список AI постов
            </h3>
            <p className="text-sm text-gray-700">
              Описание интерфейса списка постов: как выглядят карточки, 
              какую информацию они содержат, как управлять постами
            </p>
          </div>

          {/* Создание AI поста */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              ➕ Создание AI поста
            </h3>
            <p className="text-sm text-gray-700">
              Пошаговая инструкция по созданию нового AI поста: 
              выбор модели, настройка параметров, написание промпта
            </p>
          </div>

          {/* Редактор AI постов */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              ✏️ Редактор AI постов
            </h3>
            <p className="text-sm text-gray-700">
              Детальное описание редактора: как просматривать результат, 
              редактировать настройки, перегенерировать пост
            </p>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <NavigationButtons currentPath="2-4-5-ai-posts" />
    </article>
  );
};
