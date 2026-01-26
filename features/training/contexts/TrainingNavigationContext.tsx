import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { TocItem, toc } from '../data/tocData';

// ═══════════════════════════════════════════════════════════════════════════════
// Контекст навигации для Центра обучения
// Позволяет компонентам контента переключаться на другие разделы
// ═══════════════════════════════════════════════════════════════════════════════

interface NavItem {
    path: string;
    title: string;
}

interface TrainingNavigationContextType {
    navigateTo: (path: string) => void;
    findTopicByPath: (path: string) => TocItem | null;
    getPrevNext: (currentPath: string) => { prev: NavItem | null; next: NavItem | null };
}

const TrainingNavigationContext = createContext<TrainingNavigationContextType | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// Хелпер: поиск топика по path в дереве
// ═══════════════════════════════════════════════════════════════════════════════
const findTopicInTree = (items: TocItem[], targetPath: string): TocItem | null => {
    for (const item of items) {
        if (item.path === targetPath) {
            return item;
        }
        if (item.children) {
            const found = findTopicInTree(item.children, targetPath);
            if (found) return found;
        }
    }
    return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Хелпер: получить плоский список всех разделов (для навигации prev/next)
// ═══════════════════════════════════════════════════════════════════════════════
const flattenToc = (items: TocItem[]): NavItem[] => {
    const result: NavItem[] = [];
    for (const item of items) {
        result.push({ path: item.path, title: item.title });
        if (item.children) {
            result.push(...flattenToc(item.children));
        }
    }
    return result;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Провайдер контекста
// ═══════════════════════════════════════════════════════════════════════════════
interface TrainingNavigationProviderProps {
    children: React.ReactNode;
    onSelectTopic: (topic: TocItem) => void;
}

export const TrainingNavigationProvider: React.FC<TrainingNavigationProviderProps> = ({ 
    children, 
    onSelectTopic 
}) => {
    // Плоский список всех разделов (мемоизированный)
    const flatList = useMemo(() => flattenToc(toc), []);

    const findTopicByPath = useCallback((path: string): TocItem | null => {
        return findTopicInTree(toc, path);
    }, []);

    const navigateTo = useCallback((path: string) => {
        const topic = findTopicByPath(path);
        if (topic) {
            onSelectTopic(topic);
        } else {
            console.warn(`[TrainingNavigation] Topic not found: ${path}`);
        }
    }, [findTopicByPath, onSelectTopic]);

    const getPrevNext = useCallback((currentPath: string): { prev: NavItem | null; next: NavItem | null } => {
        const currentIndex = flatList.findIndex(item => item.path === currentPath);
        if (currentIndex === -1) {
            return { prev: null, next: null };
        }
        return {
            prev: currentIndex > 0 ? flatList[currentIndex - 1] : null,
            next: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null
        };
    }, [flatList]);

    return (
        <TrainingNavigationContext.Provider value={{ navigateTo, findTopicByPath, getPrevNext }}>
            {children}
        </TrainingNavigationContext.Provider>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Хук для использования навигации
// ═══════════════════════════════════════════════════════════════════════════════
export const useTrainingNavigation = (): TrainingNavigationContextType => {
    const context = useContext(TrainingNavigationContext);
    if (!context) {
        // Возвращаем заглушку если контекст недоступен
        return {
            navigateTo: (path) => console.warn(`Navigation not available, tried to navigate to: ${path}`),
            findTopicByPath: () => null,
            getPrevNext: () => ({ prev: null, next: null })
        };
    }
    return context;
};
