// FIX: Import React to make React types like ReactNode and RefObject available.
import React, { useState, useLayoutEffect, useRef, useCallback, useMemo } from 'react';

// Определяем тип для одного действия
export interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  condition?: boolean; // Условие, при котором действие отображается
}

const GAP_WIDTH = 4; // Соответствует `space-x-1` в Tailwind
const MORE_BUTTON_WIDTH = 24; // p-1 (4+4) + w-4 (16)

/**
 * Хук для адаптивного отображения действий.
 * @param allActions - Полный массив всех возможных действий.
 * @param containerRef - Ref на flex-контейнер, в котором будут отображаться действия.
 * @returns Объект с видимыми, скрытыми и всеми доступными для отображения действиями.
 */
export const useResponsiveActions = (
  allActions: ActionItem[], 
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [visibleActions, setVisibleActions] = useState<ActionItem[]>([]);
  const [hiddenActions, setHiddenActions] = useState<ActionItem[]>([]);
  const actionWidths = useRef<Map<string, number>>(new Map());

  // Фильтруем действия, которые должны отображаться в принципе
  const availableActions = useMemo(() => allActions.filter(action => action.condition !== false), [allActions]);

  const measureAndCalculate = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    
    // Измеряем ширину каждой иконки-кнопки, если еще не измерили
    containerRef.current.querySelectorAll<HTMLElement>('[data-action-id]').forEach(el => {
      const actionId = el.dataset.actionId;
      if (actionId && !actionWidths.current.has(actionId)) {
        // offsetWidth включает padding и border, что нам и нужно для кнопки
        actionWidths.current.set(actionId, el.offsetWidth);
      }
    });

    let currentWidth = 0;
    const newVisible: ActionItem[] = [];
    const newHidden: ActionItem[] = [];

    // Распределяем действия на видимые и скрытые
    for (const action of availableActions) {
      const width = actionWidths.current.get(action.id) || 24; // Ширина по умолчанию
      // Добавляем отступ для всех кнопок, кроме первой
      const widthWithGap = newVisible.length > 0 ? width + GAP_WIDTH : width;

      if (currentWidth + widthWithGap <= containerWidth) {
        currentWidth += widthWithGap;
        newVisible.push(action);
      } else {
        newHidden.push(action);
      }
    }
    
    // Если есть скрытые элементы, проверяем, нужно ли освободить место для кнопки "..."
    if (newHidden.length > 0) {
        // Рассчитываем, сколько места нужно для кнопки "..." с учетом отступа
        let spaceForMoreButton = MORE_BUTTON_WIDTH + (newVisible.length > 0 ? GAP_WIDTH : 0);
        
        // Убираем видимые кнопки с конца, пока не освободится место
        while (currentWidth + spaceForMoreButton > containerWidth && newVisible.length > 0) {
            const lastVisible = newVisible.pop()!;
            newHidden.unshift(lastVisible); // Возвращаем ее в начало скрытых
            
            const lastVisibleWidth = actionWidths.current.get(lastVisible.id) || 24;
            // Пересчитываем использованную ширину, убирая кнопку и ее отступ
            const widthWithGap = newVisible.length > 0 ? lastVisibleWidth + GAP_WIDTH : lastVisibleWidth;
            currentWidth -= widthWithGap;
        }
    }

    setVisibleActions(newVisible);
    setHiddenActions(newHidden);

  }, [availableActions, containerRef]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    // Первоначальный расчет происходит, как только availableActions стабилизируются
    measureAndCalculate();

    const observer = new ResizeObserver(measureAndCalculate);
    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [measureAndCalculate, containerRef]);
  
  return { visibleActions, hiddenActions, availableActions };
};