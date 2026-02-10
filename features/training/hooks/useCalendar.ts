import { useMemo } from 'react';

// =====================================================================
// useCalendar: хук для генерации недель и дней календаря
// =====================================================================

export interface CalendarDay {
    date: Date;
    dayOfWeek: string;
    dayOfMonth: number;
    month: number;
    year: number;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
}

export const useCalendar = (startDate?: Date) => {
    const baseDate = startDate || new Date(2026, 1, 10); // 10 февраля 2026 (текущая дата для демо)

    // Генерация недели (7 дней, начиная с указанной даты)
    const weekDates = useMemo((): CalendarDay[] => {
        const week: CalendarDay[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const day = new Date(baseDate);
            day.setDate(baseDate.getDate() + i);
            day.setHours(0, 0, 0, 0);

            const dayTimestamp = day.getTime();
            const todayTimestamp = today.getTime();

            week.push({
                date: day,
                dayOfWeek: day.toLocaleDateString('ru-RU', { weekday: 'short' }),
                dayOfMonth: day.getDate(),
                month: day.getMonth(),
                year: day.getFullYear(),
                isToday: dayTimestamp === todayTimestamp,
                isPast: dayTimestamp < todayTimestamp,
                isFuture: dayTimestamp > todayTimestamp
            });
        }

        return week;
    }, [baseDate]);

    // Утилита: получить первый день недели для месяца
    const getFirstDayOfWeek = (date: Date): number => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay.getDay();
    };

    // Утилита: получить количество дней в месяце
    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Утилита: форматирование даты
    const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
        if (format === 'short') {
            return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        }
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
    };

    return {
        weekDates,
        baseDate,
        getFirstDayOfWeek,
        getDaysInMonth,
        formatDate
    };
};
