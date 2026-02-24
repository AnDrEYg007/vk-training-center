import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { VK_COLORS, VkPost, VkComment, VkMessage, Icons } from '../../../../automations/reviews-contest/components/preview/VkUiKit';

export const GeneralContestsPreviewPage: React.FC<ContentProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Предпросмотр конкурса
        </h1>
        <p className="text-lg text-gray-600">
          Узнайте, как проверить, как будут выглядеть посты конкурса в ВКонтакте: стартовый пост, итоги и сообщения победителям.
        </p>
      </div>

      {/* Что это такое */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Что такое "Предпросмотр"?
        </h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="text-indigo-700">Предпросмотр</strong> — это режим, который показывает, как будут выглядеть все посты и сообщения конкурса в интерфейсе ВКонтакте. Вы видите <strong>точную имитацию VK</strong>: цвета, шрифты, кнопки, аватары — всё как в настоящей социальной сети.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Что показывается:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Стартовый пост</strong> — как будет выглядеть объявление о начале конкурса (с текстом и фотографиями)</li>
            <li><strong>Итоговый пост</strong> — как система оформит результаты с именами и номерами победителей</li>
            <li><strong>Личное сообщение</strong> — какой текст с промокодом получит победитель в ЛС</li>
            <li><strong>Комментарий-заглушка</strong> — что система напишет под постом пользователя, если личные сообщения закрыты</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Превью показывает <strong>подстановку переменных</strong> с примерами данных. Например, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{winners_list}'}</code> заменяется на «1. Иван Петров (№42)», а <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{promo_code}'}</code> на «WIN-2025».
          </p>
        </div>
      </section>

      {/* Было/Стало */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Было / Стало
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Было */}
          <div className="bg-white rounded-lg p-5 border-2 border-red-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900">Было (вручную)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Писали текст поста в блокноте, не видя как выглядит</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Не знали, куда встанут переменные типа {'{winners_list}'}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Публиковали пост — только тогда видели опечатки</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Приходилось редактировать уже опубликованный пост</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Не было уверенности: правильно ли подставятся данные</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700">
                ⏱ Время: ~20 минут на правки после публикации
              </p>
            </div>
          </div>

          {/* Стало */}
          <div className="bg-white rounded-lg p-5 border-2 border-green-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-green-900">Стало (автоматически)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Видите точную имитацию VK ещё до публикации</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Переменные подставлены с примерами данных</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Видно, как выглядят все 3 сценария (старт, итоги, ЛС)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Проверяете текст, форматирование, фото перед запуском</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Запускаете конкурс с уверенностью — всё проверено</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm font-semibold text-green-700">
                ⏱ Время: ~2 минуты на проверку
              </p>
              <p className="text-xs text-green-600 mt-1">
                💰 Экономия: 18 минут + нет правок после публикации
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Интерактивные демонстрации */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Интерактивные примеры
        </h2>

        {/* 1. Общий вид превью */}
        <Sandbox
          title="1. Общий вид предпросмотра (все 3 блока)"
          description="Превью показывает 3 ключевых момента конкурса: стартовый пост, итоговый пост и сообщение победителю. Всё оформлено в стиле ВКонтакте с реальными цветами, иконками и кнопками."
          highlight="indigo"
          instructions={[
            'Каждый блок имеет заголовок: "1. Старт конкурса", "2. Объявление итогов", "3. Вручение приза"',
            'Аватар сообщества, синяя галочка верификации, кнопки Like/Comment/Share',
            'Фон страницы — серый (#edeef0), как в настоящем VK'
          ]}
        >
          <FullPreviewDemo />
        </Sandbox>

        {/* 2. Стартовый пост */}
        <Sandbox
          title="2. Стартовый пост конкурса"
          description="Первый блок показывает, как будет выглядеть объявление о конкурсе. Текст из поля 'Текст поста', фотографии из 'Изображения стартового поста', дата и время запуска."
          highlight="indigo"
          instructions={[
            'Аватар и название сообщества берутся из проекта',
            'Дата формируется из полей "Дата старта" и "Время старта"',
            'Если фотографий несколько — показываются сеткой 2x2',
            'Кнопки действий (Like, Comment, Share, Views) слегка размыты — акцент на текст'
          ]}
        >
          <StartPostDemo />
        </Sandbox>

        {/* 3. Итоговый пост */}
        <Sandbox
          title="3. Итоговый пост с победителями"
          description="Второй блок показывает, как будут оформлены результаты. Система подставляет переменную {'{winners_list}'} с примером данных: '1. Иван Петров (№42)'."
          highlight="indigo"
          instructions={[
            'Текст берётся из шаблона "Итоговый пост"',
            'Переменная <code>{winners_list}</code> заменяется на пример списка победителей',
            'Дата показывается как "после завершения"',
            'Фотографии из поля "Изображения итогового поста"'
          ]}
        >
          <ResultPostDemo />
        </Sandbox>

        {/* 4. Личное сообщение */}
        <Sandbox
          title="4. Личное сообщение победителю"
          description="Третий блок (первая часть) — сообщение, которое получит победитель в ЛС сообщества. Переменные {'{promo_code}'} и {'{description}'} подставлены с примерами данных."
          highlight="indigo"
          instructions={[
            'Шапка "Сообщения сообщества" + ссылка "К диалогу"',
            'Текст из шаблона "Личное сообщение"',
            'Переменные: <code>{promo_code}</code> → "WIN-2025", <code>{description}</code> → "Подарок недели"',
            'Текст в серой плашке, как в настоящих сообщениях VK'
          ]}
        >
          <DirectMessageDemo />
        </Sandbox>

        {/* 5. Комментарий-фолбэк */}
        <Sandbox
          title="5. Комментарий, если личка закрыта"
          description="Третий блок (вторая часть) — что система напишет под постом пользователя, если ему нельзя отправить ЛС. Показывается пост пользователя с ответом от сообщества."
          highlight="indigo"
          instructions={[
            'Разделитель "Если ЛС закрыто" между сообщением и постом',
            'Мок-пост пользователя: "Спасибо за конкурс! Жду результаты ❤️"',
            'Комментарий сообщества с синей галочкой',
            'Текст из шаблона "Комментарий-заглушка", переменная <code>{user_name}</code> → "Мария"'
          ]}
        >
          <FallbackCommentDemo />
        </Sandbox>

        {/* 6. Подстановка переменных */}
        <Sandbox
          title="6. Как работают переменные"
          description="Превью показывает, как система заменит переменные на реальные данные при публикации. Переменные выделены цветными плашками для наглядности."
          highlight="indigo"
          instructions={[
            'Переменные в фигурных скобках: <code>{winners_list}</code>, <code>{promo_code}</code>, <code>{user_name}</code>',
            'В превью заменяются на примеры: "Иван Петров (№42)", "WIN-2025", "Мария"',
            'Выделены indigo плашками с моноширинным шрифтом',
            'При реальной публикации подставятся настоящие данные победителей'
          ]}
        >
          <VariablesDemo />
        </Sandbox>

        {/* 7. Обработка изображений */}
        <Sandbox
          title="7. Отображение фотографий"
          description="Превью показывает, как будут выглядеть фотографии в зависимости от их количества: одно фото на всю ширину, несколько — сеткой 2x2."
          highlight="indigo"
          instructions={[
            'Одна фотография → показывается на всю ширину поста (max-height: 300px)',
            'Две и более → сетка 2 колонки, квадратные (aspect-square)',
            'Максимум 4 фотографии в превью',
            'Фотографии берутся из полей "Изображения стартового" и "Изображения итогового поста"'
          ]}
        >
          <ImagesHandlingDemo />
        </Sandbox>

        {/* 8. Размытие элементов */}
        <Sandbox
          title="8. Размытие второстепенных элементов"
          description="Кнопки действий (Like, Comment, Share), счётчики и аватары слегка размыты (blur). Это помогает сфокусироваться на главном — тексте и переменных."
          highlight="indigo"
          instructions={[
            'Кнопки Like/Comment/Share/Views размыты (blur-[1.5px], opacity-80)',
            'Аватары в сообщениях размыты (blur-[2px])',
            'Шапка сообщения, дата, имя — blur-[1px]',
            'Акцент на текст постов и подстановку переменных'
          ]}
        >
          <BlurEffectDemo />
        </Sandbox>
      </section>

      {/* Частые вопросы */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Частые вопросы
        </h2>
        
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Зачем нужен предпросмотр, если можно просто опубликовать?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Предпросмотр помогает избежать ошибок <strong>до</strong> публикации:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Опечатки в тексте</strong> — исправьте до того, как участники увидят</li>
                <li><strong>Неправильные переменные</strong> — убедитесь, что {'{winners_list}'} стоит в нужном месте</li>
                <li><strong>Форматирование</strong> — проверьте переносы строк, эмодзи, пробелы</li>
                <li><strong>Фотографии</strong> — убедитесь, что загрузили правильные изображения</li>
              </ul>
              <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 mt-3">
                💡 <strong>Правило:</strong> Всегда проверяйте превью перед запуском конкурса. Правки после публикации видны всем участникам — это выглядит непрофессионально.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Где найти вкладку "Превью"?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Вкладка "Превью" находится на странице редактирования конкурса:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4">
                <li>Откройте раздел "Автоматизации" → "Универсальные конкурсы"</li>
                <li>Выберите конкурс из списка (или создайте новый)</li>
                <li>В верхней части экрана увидите вкладки: Настройки, Условия, Участники, Победители, Промокоды, Список рассылки, Чёрный список, <strong>Превью</strong></li>
                <li>Кликните на "Превью" — справа откроется панель с имитацией VK</li>
              </ol>
              <p className="text-xs text-gray-600 mt-2">
                Превью доступно на всех вкладках конкурса — справа всегда видна панель с актуальным предпросмотром.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Почему кнопки Like/Comment размыты?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Размытие второстепенных элементов (blurredExtras) — это дизайнерское решение для акцента на главном. Вам важно проверить <strong>текст</strong> и <strong>переменные</strong>, а не количество лайков (которое в превью фиктивное). Размытие помогает не отвлекаться на детали и сконцентрироваться на контенте конкурса.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Данные в превью настоящие?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Частично.</strong> Превью использует:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Настоящие:</strong> тексты постов, шаблоны, фотографии, название и аватар сообщества, даты</li>
                <li><strong>Примеры:</strong> имена победителей («Иван Петров»), промокоды («WIN-2025»), лайки/комментарии (36/12)</li>
              </ul>
              <p className="text-gray-700 mt-2">
                При реальной публикации система подставит <strong>настоящие</strong> данные победителей из базы, а не примеры из превью.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Можно ли редактировать текст прямо в превью?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Нет.</strong> Превью — это режим только для просмотра (read-only). Чтобы изменить текст, вернитесь на вкладку <strong>"Настройки"</strong>, отредактируйте поля «Текст поста», «Итоговый пост» или «Личное сообщение», и превью автоматически обновится.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что такое "Комментарий-заглушка"?
              </span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Это запасной сценарий на случай, если победителю нельзя отправить личное сообщение (закрыты ЛС или заблокировано сообщество). Система найдёт любой пост победителя в вашем сообществе и напишет под ним комментарий:
              </p>
              <div className="bg-gray-100 p-3 rounded my-2 text-sm italic text-gray-700">
                "Напишите нам в личные сообщения, Мария, чтобы забрать приз!"
              </div>
              <p className="text-gray-700">
                Переменная <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{user_name}'}</code> заменится на имя победителя. В превью показывается, как это будет выглядеть.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ключевые преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-3xl mb-2">👁️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Точная имитация VK</h3>
            <p className="text-sm text-gray-600">
              Видите посты именно так, как их увидят участники. Цвета, шрифты, кнопки — всё как в настоящем ВКонтакте.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-3xl mb-2">🔤</div>
            <h3 className="font-semibold text-gray-900 mb-2">Проверка переменных</h3>
            <p className="text-sm text-gray-600">
              Убедитесь, что переменные стоят в правильных местах и подставятся корректно.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Нет правок после публикации</h3>
            <p className="text-sm text-gray-600">
              Запускайте конкурс с уверенностью — все опечатки и ошибки форматирования найдены заранее.
            </p>
          </div>
        </div>
      </section>

      {/* Навигация */}
      <NavigationButtons
        onPrevious={() => onNavigate('2-4-4-11-blacklist')}
        onNext={() => onNavigate('2-5-1-overview')}
        previousLabel="Чёрный список"
        nextLabel="Обзор раздела"
      />
    </div>
  );
};

// ============================================
// Демо-компоненты
// ============================================

const FullPreviewDemo: React.FC = () => {
  const mockProject = {
    name: 'Магазин Подарков',
    avatar_url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=256&h=256&fit=crop'
  };

  return (
    <div 
      className="rounded-lg overflow-hidden border border-gray-200" 
      style={{ backgroundColor: VK_COLORS.bg, maxHeight: '600px', overflowY: 'auto' }}
    >
      <div className="max-w-[550px] w-full mx-auto space-y-8 p-4">
        
        {/* 1. Стартовый пост */}
        <div>
          <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">1. Старт конкурса</div>
          <VkPost
            isGroup
            authorName={mockProject.name}
            authorAvatar={mockProject.avatar_url}
            date="20 февраля 2026 в 12:00"
            highlightWord=""
            text="🎉 Запускаем конкурс! Разыгрываем 3 подарка среди участников.&#10;&#10;Условия: лайк + репост + подписка.&#10;Итоги — 27 февраля!"
            likes={36}
            comments={12}
            reposts={4}
            views={1.8}
            images={[{ url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=400&fit=crop' }]}
            blurredExtras={true}
          />
        </div>

        {/* 2. Итоговый пост */}
        <div>
          <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">2. Объявление итогов</div>
          <VkPost
            isGroup
            authorName={mockProject.name}
            authorAvatar={mockProject.avatar_url}
            date="после завершения"
            highlightWord=""
            text="Поздравляем победителей!&#10;&#10;1. Иван Петров (№42)"
            likes={48}
            comments={15}
            reposts={6}
            views={3.1}
            blurredExtras={true}
          />
        </div>

        {/* 3. Вручение приза */}
        <div>
          <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">3. Вручение приза</div>
          <div className="space-y-4">
            <VkMessage
              authorName={mockProject.name}
              text="Поздравляем! Вы выиграли приз: Подарок недели&#10;Ваш код: WIN-2025"
              date="14:40"
              authorAvatar={mockProject.avatar_url}
              blurredExtras={true}
            />
            
            <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-300/50 relative">
              <span className="px-2 relative -top-4 bg-[#edeef0]">Если ЛС закрыто</span>
            </div>
            
            <VkPost
              authorName="Мария Смирнова"
              authorAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
              date="сегодня в 14:30"
              highlightWord=""
              text="Спасибо за конкурс! Жду результаты ❤️"
              likes={12}
              comments={5}
              reposts={1}
              views={1.2}
              blurredExtras={true}
            >
              <VkComment
                isGroup
                authorName={mockProject.name}
                authorAvatar={mockProject.avatar_url}
                text="Напишите нам в личные сообщения, Мария, чтобы забрать приз!"
                date="только что"
                replyToName="Мария"
                blurredExtras={false}
              />
            </VkPost>
          </div>
        </div>
      </div>
    </div>
  );
};

const StartPostDemo: React.FC = () => {
  const mockProject = {
    name: 'Книжный Магазин',
    avatar_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=256&h=256&fit=crop'
  };

  return (
    <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg">
      <VkPost
        isGroup
        authorName={mockProject.name}
        authorAvatar={mockProject.avatar_url}
        date="25 февраля 2026 в 10:00"
        highlightWord=""
        text="📚 Конкурс! Разыгрываем 5 бестселлеров среди подписчиков.&#10;&#10;Правила:&#10;✓ Лайк этому посту&#10;✓ Репост к себе на стену&#10;✓ Подписка на сообщество&#10;&#10;Победителей выберем 28 февраля в 18:00!"
        likes={89}
        comments={23}
        reposts={12}
        views={4.2}
        images={[
          { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop' }
        ]}
        blurredExtras={true}
      />
    </div>
  );
};

const ResultPostDemo: React.FC = () => {
  const mockProject = {
    name: 'Спортивный Клуб',
    avatar_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=256&h=256&fit=crop'
  };

  return (
    <div className="space-y-4">
      <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg">
        <VkPost
          isGroup
          authorName={mockProject.name}
          authorAvatar={mockProject.avatar_url}
          date="после завершения"
          highlightWord=""
          text="🏆 Итоги конкурса на абонементы!&#10;&#10;Победители:&#10;1. Иван Петров (№42)&#10;2. Анна Кузнецова (№18)&#10;3. Дмитрий Сидоров (№93)&#10;&#10;Поздравляем! Ждём вас в клубе 💪"
          likes={156}
          comments={47}
          reposts={22}
          views={8.5}
          blurredExtras={true}
        />
      </div>

      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-sm text-gray-700">
        <strong>Переменная {'{winners_list}'}:</strong> Система автоматически подставит реальных победителей в формате «Номер. Имя (№участника)»
      </div>
    </div>
  );
};

const DirectMessageDemo: React.FC = () => {
  const mockProject = {
    name: 'Магазин Электроники',
    avatar_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=256&h=256&fit=crop'
  };

  return (
    <div className="space-y-4">
      <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg">
        <VkMessage
          authorName={mockProject.name}
          text="Поздравляем! 🎉&#10;&#10;Вы выиграли приз: Скидка 50% на любой товар&#10;Ваш промокод: WIN-2025&#10;&#10;Действителен до 31 марта."
          date="16:25"
          authorAvatar={mockProject.avatar_url}
          blurredExtras={true}
        />
      </div>

      <div className="p-3 bg-purple-50 border border-purple-200 rounded text-sm space-y-2">
        <p className="text-gray-700">
          <strong>Переменные в шаблоне:</strong>
        </p>
        <ul className="text-gray-600 text-xs space-y-1 ml-4">
          <li>• <code className="bg-gray-100 px-1 rounded">{'{promo_code}'}</code> → "WIN-2025"</li>
          <li>• <code className="bg-gray-100 px-1 rounded">{'{description}'}</code> → "Скидка 50% на любой товар"</li>
        </ul>
      </div>
    </div>
  );
};

const FallbackCommentDemo: React.FC = () => {
  const mockProject = {
    name: 'Кафе "Уют"',
    avatar_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=256&h=256&fit=crop'
  };

  return (
    <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg space-y-4">
      <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-300/50 relative">
        <span className="px-2 relative -top-4 bg-[#edeef0]">Если ЛС закрыто</span>
      </div>
      
      <VkPost
        authorName="Екатерина Волкова"
        authorAvatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop"
        date="вчера в 19:15"
        highlightWord=""
        text="Участвую в конкурсе! Очень хочу выиграть 🍰"
        likes={8}
        comments={2}
        reposts={0}
        views={0.5}
        blurredExtras={true}
      >
        <VkComment
          isGroup
          authorName={mockProject.name}
          authorAvatar={mockProject.avatar_url}
          text="Напишите нам в личные сообщения, Екатерина, чтобы забрать приз!"
          date="2 минуты назад"
          replyToName="Екатерина"
          blurredExtras={false}
        />
      </VkPost>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
        <strong>Когда используется:</strong> Если победителю нельзя отправить ЛС (закрыты личные сообщения), система найдёт его пост и напишет комментарий с призывом написать самому.
      </div>
    </div>
  );
};

const VariablesDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Доступные переменные:</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono text-xs border border-indigo-200 shrink-0">
              {'{winners_list}'}
            </code>
            <div>
              <p className="font-medium text-gray-700">Список победителей</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Пример: «1. Иван Петров (№42)<br />2. Анна Кузнецова (№18)»
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono text-xs border border-indigo-200 shrink-0">
              {'{promo_code}'}
            </code>
            <div>
              <p className="font-medium text-gray-700">Промокод победителя</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Пример: «WIN-2025» (из базы промокодов)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono text-xs border border-indigo-200 shrink-0">
              {'{description}'}
            </code>
            <div>
              <p className="font-medium text-gray-700">Описание приза</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Пример: «Скидка 50%» или «Подарочный набор»
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono text-xs border border-indigo-200 shrink-0">
              {'{user_name}'}
            </code>
            <div>
              <p className="font-medium text-gray-700">Имя победителя</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Пример: «Мария» (из профиля VK)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
        💡 <strong>Совет:</strong> В превью переменные заменены на примеры. При реальной публикации подставятся настоящие данные из базы.
      </div>
    </div>
  );
};

const ImagesHandlingDemo: React.FC = () => {
  const [imageCount, setImageCount] = useState<1 | 2 | 4>(1);

  const mockProject = {
    name: 'Фотостудия',
    avatar_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=256&h=256&fit=crop'
  };

  const images = {
    1: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop' }],
    2: [
      { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop' }
    ],
    4: [
      { url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=400&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=400&fit=crop' }
    ]
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setImageCount(1)}
          className={`px-3 py-1 text-xs rounded ${imageCount === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          1 фото
        </button>
        <button
          onClick={() => setImageCount(2)}
          className={`px-3 py-1 text-xs rounded ${imageCount === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          2 фото
        </button>
        <button
          onClick={() => setImageCount(4)}
          className={`px-3 py-1 text-xs rounded ${imageCount === 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          4 фото
        </button>
      </div>

      <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg">
        <VkPost
          isGroup
          authorName={mockProject.name}
          authorAvatar={mockProject.avatar_url}
          date="сегодня в 11:00"
          highlightWord=""
          text="Новая фотосессия! Смотрите наши работы 📸"
          likes={45}
          comments={8}
          reposts={3}
          views={2.1}
          images={images[imageCount]}
          blurredExtras={true}
        />
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <strong>Правило:</strong> {imageCount === 1 ? 'Одно фото → показывается на всю ширину' : `${imageCount} фото → сетка 2 колонки`}
      </div>
    </div>
  );
};

const BlurEffectDemo: React.FC = () => {
  const [showBlur, setShowBlur] = useState(true);

  const mockProject = {
    name: 'Спа-Салон',
    avatar_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=256&h=256&fit=crop'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowBlur(!showBlur)}
          className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          {showBlur ? 'Убрать размытие' : 'Включить размытие'}
        </button>
        <span className="text-sm text-gray-600">
          {showBlur ? 'Акцент на текст' : 'Все элементы чёткие'}
        </span>
      </div>

      <div style={{ backgroundColor: VK_COLORS.bg }} className="p-4 rounded-lg">
        <VkPost
          isGroup
          authorName={mockProject.name}
          authorAvatar={mockProject.avatar_url}
          date="15 февраля в 14:00"
          highlightWord=""
          text="Розыгрыш сертификата на массаж!&#10;&#10;Условия: лайк + репост"
          likes={67}
          comments={19}
          reposts={8}
          views={3.4}
          blurredExtras={showBlur}
        />
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
        <strong>Зачем размытие:</strong> Помогает сфокусироваться на главном — тексте и переменных. Лайки и комментарии в превью фиктивные, поэтому они размыты.
      </div>
    </div>
  );
};
