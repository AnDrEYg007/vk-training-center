# 📊 Анализ раздела 2 Центра обучения

**Дата:** 30 января 2026  
**Задача:** Сравнить обучающий контент с реальным кодом приложения

> **📖 Инструкции:** Этот анализ основан на правилах из [training_center.instructions.md](../../.github/instructions/training_center.instructions.md)  
> **🚫 Главное правило:** НЕ ФАНТАЗИРОВАТЬ! Описывать только реальный функционал из кода.

---

## 🔍 Проанализированные файлы

### Реальное приложение:
1. **`features/projects/components/Sidebar.tsx`** (448 строк)
2. **`features/projects/components/ProjectListItem.tsx`** (138 строк)
3. **`features/schedule/components/ScheduleHeader.tsx`** (271 строка)

### Центр обучения:
1. **Раздел 2.1.1** — Сайдбар проектов (5 компонентов)
2. **Раздел 2.1.2** — Шапка календаря (7 компонентов)

---

## ❌ ПРОБЛЕМЫ В РАЗДЕЛЕ 2.1.1 "Сайдбар проектов"

### 1. **SidebarNavOverview.tsx** — НУЖЕН ПОЛНЫЙ ПЕРЕСМОТР

#### ❌ Что НЕ ТАК в обучении:
- Нет описания **секции текущего пользователя** внизу сайдбара (аватар, имя, роль, кнопка выхода)
- Нет информации о **версии бэкенда** (отображается под пользователем)
- Не упоминается **VK-авторизация** и интеграция с VK API
- Нет кнопки **"Глобальное обновление"** для всех проектов
- Не описан функционал **массового обновления через polling**
- Отсутствует информация о **секции "Отключенные проекты"**
- Нет упоминания кнопки **показать/скрыть отключенные проекты**
- Не описан **динамический текст** для кнопки массового обновления (зависит от activeView)

#### ✅ Что ЕСТЬ в реальном Sidebar.tsx:
```tsx
// 1. СЕКЦИЯ ПОЛЬЗОВАТЕЛЯ (строки 399-448)
{user && (
  <div className="border-t border-gray-200 p-3 bg-gray-50">
    <div className="flex items-center gap-3">
      {/* Аватар VK/обычный */}
      {/* Имя и роль (VK пользователь / Администратор) */}
      {/* Кнопка выхода */}
    </div>
    {/* Версия бэкенда */}
    <div className="mt-2 pt-2 border-t border-gray-200">
      <p>Backend: {backendVersion}</p>
    </div>
  </div>
)}

// 2. КНОПКА ГЛОБАЛЬНОГО ОБНОВЛЕНИЯ (строки 273-294)
<button
  onClick={() => setShowMassUpdateConfirm(true)}
  disabled={isMassUpdating || isLoadingCounts}
  title={`Запустить глобальное обновление ${massUpdateTargetText} для всех проектов`}
>
  {isMassUpdating ? (
    <>
      <div className="loader h-4 w-4"></div>
      {massUpdateProgress && <span>{massUpdateProgress}</span>}
    </>
  ) : (
    <svg>...</svg> // Иконка серверного обновления
  )}
</button>

// 3. ОТКЛЮЧЕННЫЕ ПРОЕКТЫ (строки 365-382)
{filteredDisabledProjects.length > 0 && (
  <div className="flex justify-between items-center">
    <h4>Отключенные</h4>
    <button onClick={() => setShowDisabled(prev => !prev)}>
      {showDisabled ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  </div>
)}
{!isLoadingCounts && showDisabled && renderProjectList(filteredDisabledProjects, ...)}

// 4. ДИНАМИЧЕСКИЙ ТЕКСТ ДЛЯ МАССОВОГО ОБНОВЛЕНИЯ (строки 265-269)
const massUpdateTargetText = activeView === 'suggested' 
  ? 'предложенных постов' 
  : activeView === 'products'
    ? 'товаров'
    : 'расписания (отложенные + опубликованные)';

// 5. МАССОВОЕ ОБНОВЛЕНИЕ ЧЕРЕЗ POLLING (строки 169-223)
const handleConfirmMassUpdate = async () => {
  // 1. Запуск задачи на сервере
  const { taskId } = await api.bulkRefreshProjects(activeView);
  
  // 2. Polling статуса
  await pollTask(taskId, (progress) => {
    const percent = Math.round((progress.loaded! / progress.total) * 100);
    setMassUpdateProgress(`${percent}%`);
    
    // Парсинг текущего проекта из сообщения [PID:123]
    if (progress.message && progress.message.includes('[PID:')) {
      const match = progress.message.match(/\[PID:([^\]]+)\]/);
      if (match) {
        setProcessingProjectId(match[1]);
      }
    }
  });
}

// 6. VK ПОЛЬЗОВАТЕЛЬ ИЗ БД (строки 86-98)
useEffect(() => {
  setVkUserData(null);
  if (user?.vk_user_id) {
    fetch('http://127.0.0.1:8000/api/vk-test/users/current')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && user?.vk_user_id) {
          setVkUserData(data);
        }
      })
  }
}, [user]);
```

---

### 2. **ProjectListItems.tsx** — НУЖНА КОРРЕКТИРОВКА

#### ❌ Что НЕ ТАК:
- Не описаны **статусы конкурса** (зеленая галочка, желтый восклицательный знак)
- Отсутствует логика **отображения промокодов** (`contestStatus.promoCount < 5`)
- Нет информации о **синей точке обновления** (`hasUpdate`)
- Не упоминается **анимация fade-in-up** при загрузке списка
- Отсутствует описание **gradient-фона** для неактивных проектов с цветовыми индикаторами

#### ✅ Что ЕСТЬ в реальном ProjectListItem.tsx:
```tsx
// 1. СТАТУСЫ КОНКУРСА (строки 102-128)
contestStatus !== undefined ? (
  contestStatus.isActive ? (
    contestStatus.promoCount < 5 ? (
      <div className="flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-600">
        ! {/* Предупреждение: мало промокодов */}
      </div>
    ) : (
      <div className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-600">
        <CheckIcon /> {/* Конкурс активен */}
      </div>
    )
  ) : (
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div> {/* Конкурс отключен */}
  )
)

// 2. СИНЯЯ ТОЧКА ОБНОВЛЕНИЯ (строка 107)
hasUpdate && !isRefreshing ? (
  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" 
       title="Доступны обновления">
  </div>
)

// 3. АНИМАЦИЯ FADE-IN-UP (строка 56)
<div
  className={`relative overflow-hidden opacity-0 animate-fade-in-up`}
  style={{ animationDelay: `${animationIndex * 30}ms` }}
>

// 4. GRADIENT-ФОН ДЛЯ СЧЕТЧИКОВ (строки 22-32)
const getPostCountColorClasses = (count: number, isActive: boolean, isDisabled: boolean): string => {
  if (isActive) {
    if (isDisabled) return 'bg-gray-300 text-gray-800';
    if (count === 0) return 'bg-red-200 text-red-800';
    if (count > 0 && count < 5) return 'bg-orange-200 text-orange-800';
    if (count > 10) return 'bg-green-200 text-green-800';
    return 'bg-indigo-200 text-indigo-800';
  }
  
  // Для НЕАКТИВНЫХ проектов — gradient!
  if (count === 0) return 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium';
  if (count > 0 && count < 5) return 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium';
  if (count > 10) return 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium';
  return 'bg-gray-300 text-gray-700';
};
```

---

### 3. **FiltersAndSearch.tsx** — ДОПОЛНИТЬ

#### ❌ Чего НЕ ХВАТАЕТ:
- Фильтры по контенту **отображаются только для вкладок с постами** (`activeView === 'schedule' || activeView === 'suggested'`)
- Не описан **динамический заголовок** ("Отложенные посты" / "Предложенные посты")
- Отсутствует информация о **стилях для каждого фильтра** (gradient-цвета)

#### ✅ В реальном Sidebar:
```tsx
// УСЛОВНОЕ ОТОБРАЖЕНИЕ ФИЛЬТРА (строки 328-345)
{(activeView === 'schedule' || activeView === 'suggested') && (
  <div>
    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {activeView === 'schedule' ? 'Отложенные посты' : 'Предложенные посты'}
    </h4>
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => setContentFilter('all')} 
              className={getPostFilterButtonClasses('all')}>
        Все
      </button>
      {/* ... остальные кнопки */}
    </div>
  </div>
)}

// СТИЛИ ДЛЯ ФИЛЬТРОВ (строки 228-235)
const contentFilterStyles: Record<ContentFilter, string> = {
  all: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
  empty: 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 hover:to-red-300',
  not_empty: 'bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 hover:to-blue-300',
  lt5: 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 hover:to-orange-300',
  '5-10': 'bg-gray-300 text-gray-800 hover:bg-gray-400',
  gt10: 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 hover:to-green-300',
};
```

---

## ❌ ПРОБЛЕМЫ В РАЗДЕЛЕ 2.1.2 "Шапка календаря"

### 1. **CalendarHeaderOverview.tsx** — КРИТИЧЕСКИЕ ПРОПУСКИ

#### ❌ Что НЕ ТАК:
- Отсутствует **компонент поиска** (`<ScheduleSearch />`) в левой группе
- Нет **выпадающего меню обновления** с анимацией раскрытия
- Не описаны **отдельные кнопки обновления**: Опубликованные, Отложенные, Системные, Истории, Теги, Заметки, Всё
- Отсутствует информация о **кнопках управления тегами** (Управление тегами, Показать/Скрыть теги)
- Нет описания **transition-анимаций** для раскрытия дропдаунов

#### ✅ Что ЕСТЬ в реальном ScheduleHeader.tsx:
```tsx
// 1. ПОИСК (строка 210)
<ScheduleSearch posts={posts} onSelectPost={onSelectSearchPost} />

// 2. ВЫПАДАЮЩЕЕ МЕНЮ ОБНОВЛЕНИЯ (строки 213-236)
<div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
  isRefreshDropdownOpen ? 'max-w-4xl opacity-100 ml-2' : 'max-w-0 opacity-0'
}`}>
  <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm">
    <button onClick={() => { handleRefreshPublished(project.id); setIsRefreshDropdownOpen(false); }}>
      Опубликованные {loadingStates.isRefreshingPublished && <div className="loader"></div>}
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={() => { handleRefreshScheduled(project.id); setIsRefreshDropdownOpen(false); }}>
      Отложенные
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={() => { onRefreshSystem(); setIsRefreshDropdownOpen(false); }}>
      Системные
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={handleRefreshStoriesClick}>
      Истории
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={handleRetagProject}>
      Теги
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={() => { onRefreshNotes(); setIsRefreshDropdownOpen(false); }}>
      Заметки
    </button>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={() => { onRefreshAll(); setIsRefreshDropdownOpen(false); }}>
      Всё
    </button>
  </div>
</div>

// 3. КНОПКИ УПРАВЛЕНИЯ ТЕГАМИ (строки 185-197)
<button onClick={onOpenTagsModal} title="Управление тегами">
  <TagIcon />
</button>
<button onClick={onToggleTagVisibility} 
        title={tagVisibility === 'visible' ? "Скрыть теги" : "Показать теги"}>
  {tagVisibility === 'visible' ? <EyeOffIcon /> : <EyeIcon />}
</button>

// 4. ОБРАБОТКА КЛИКА ВНЕ DROPDOWN (строки 70-78)
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (refreshDropdownRef.current && !refreshDropdownRef.current.contains(event.target as Node)) {
      setIsRefreshDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

---

### 2. **RefreshButton.tsx** — ПЕРЕПУТАН ФУНКЦИОНАЛ

#### ❌ Проблема:
- В обучении описана **ОДНА** кнопка "Обновить"
- В реальности это **ВЫПАДАЮЩИЙ DROPDOWN** с 8 кнопками внутри

#### ✅ Реальная структура:
1. **Главная кнопка** — открывает dropdown
2. **Dropdown с 8 опциями:**
   - Опубликованные
   - Отложенные
   - Системные
   - Истории
   - Теги
   - Заметки
   - Всё
3. **Анимация:** `max-w-0 opacity-0` → `max-w-4xl opacity-100 ml-2`

---

### 3. **BulkActions.tsx** — УПУЩЕНЫ ДЕТАЛИ

#### ❌ Что НЕ ТАК:
- Не описана **анимация раскрытия** блока с действиями
- Отсутствует **вертикальный разделитель** (`<div className="h-5 w-px bg-gray-200"></div>`)
- Нет информации о **disabled-состоянии** кнопки "Удалить" когда `totalSelected === 0`
- Не упоминается **условное отображение** через `max-w-0 opacity-0` / `max-w-lg opacity-100`

#### ✅ Реальная реализация:
```tsx
// АНИМАЦИЯ РАСКРЫТИЯ (строки 242-252)
<div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
  isSelectionMode && totalSelected > 0 ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0'
}`}>
  <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm">
    <span className="px-3 py-1 text-sm font-medium text-gray-700">
      Выбрано: {totalSelected}
    </span>
    <div className="h-5 w-px bg-gray-200"></div>
    <button onClick={onClearSelection}>Снять выделение</button>
    <button onClick={onInitiateBulkDelete} disabled={totalSelected === 0}>
      Удалить
    </button>
  </div>
</div>
```

---

## 📝 ИТОГОВЫЕ РЕКОМЕНДАЦИИ

### Раздел 2.1.1 (Сайдбар):
1. ✏️ **Переписать** `SidebarNavOverview.tsx` — добавить секцию пользователя, версию бэкенда, VK-интеграцию
2. ✏️ **Дополнить** `ProjectListItems.tsx` — статусы конкурса, синяя точка, анимации
3. ✏️ **Обновить** `FiltersAndSearch.tsx` — условное отображение, gradient-стили

### Раздел 2.1.2 (Шапка календаря):
1. ✏️ **Переписать** `CalendarHeaderOverview.tsx` — добавить ScheduleSearch, выпадающий dropdown
2. ✏️ **Переделать** `RefreshButton.tsx` — это не кнопка, а dropdown с 8 опциями
3. ✏️ **Дополнить** `BulkActions.tsx` — анимации, разделители, disabled-состояния
4. ➕ **Создать новый** `TagManagementButtons.tsx` — управление тегами и их видимостью

---

## 🎯 ПРИОРИТЕТЫ

### ВЫСОКИЙ:
- [ ] SidebarNavOverview.tsx
- [ ] CalendarHeaderOverview.tsx
- [ ] RefreshButton.tsx

### СРЕДНИЙ:
- [ ] ProjectListItems.tsx
- [ ] BulkActions.tsx
- [ ] TagManagementButtons.tsx (новый)

### НИЗКИЙ:
- [ ] FiltersAndSearch.tsx
- [ ] DateNavigation.tsx
- [ ] ViewModes.tsx

---

**Следующий шаг:** Начать переписывать компоненты по приоритету (сначала ВЫСОКИЙ).
