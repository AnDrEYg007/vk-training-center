
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MarketItem, MarketAlbum, MarketCategory } from '../../../shared/types';
import { NewProductRow, MatchKey, RowMatchResult } from '../types';
import { calculateRowMatches } from '../utils/updateProcessor';

interface UseUpdateFileLogicProps {
    isOpen: boolean;
    fileRows: NewProductRow[]; // Теперь принимаем строки напрямую
    allItems: MarketItem[];
    allAlbums: MarketAlbum[];
    allCategories: MarketCategory[];
    onClose: () => void;
    onApplyUpdates: (updates: Record<number, Partial<MarketItem>>) => void;
    onQueueNewItems: (newRows: NewProductRow[]) => void;
}

export const useUpdateFileLogic = ({
    isOpen,
    fileRows: initialFileRows,
    allItems,
    allAlbums,
    allCategories,
    onClose,
    onApplyUpdates,
    onQueueNewItems,
}: UseUpdateFileLogicProps) => {
    // 1. State Declarations
    const [fileRows, setFileRows] = useState<NewProductRow[]>(initialFileRows);
    
    // Configuration
    const [matchKey, setMatchKey] = useState<MatchKey>('vk_id');
    const [fieldsToUpdate, setFieldsToUpdate] = useState<Set<keyof MarketItem | 'album_ids' | 'old_price'>>(new Set(['price', 'old_price', 'title', 'description', 'sku', 'album_ids', 'category']));
    
    // Results
    const [matches, setMatches] = useState<RowMatchResult[]>([]);
    const [activeTab, setActiveTab] = useState<'updates' | 'unchanged' | 'not_found' | 'ambiguous'>('updates');
    
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [resolutions, setResolutions] = useState<Map<string, number>>(new Map());
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    // Синхронизация локальных строк при изменении пропсов (важно при повторном открытии)
    useEffect(() => {
        if (isOpen) {
            setFileRows(initialFileRows);
            setResolutions(new Map());
            setValidationErrors({});
            // Пытаемся угадать лучший ключ сопоставления на основе данных
            if (initialFileRows.length > 0) {
                const first = initialFileRows[0];
                if (first.vk_id) setMatchKey('vk_id');
                else if (first.vk_link) setMatchKey('vk_link');
                else if (first.sku) setMatchKey('sku');
                else setMatchKey('title');
            }
        }
    }, [isOpen, initialFileRows]);

    // Calculating matches
    useEffect(() => {
        if (fileRows.length > 0) {
            const result = calculateRowMatches(fileRows, allItems, matchKey, fieldsToUpdate, allAlbums, allCategories);
            setMatches(result);
        }
    }, [fileRows, allItems, matchKey, fieldsToUpdate, allAlbums, allCategories]);

    // 3. Memoized Values
    const { changedMatches, unchangedMatches, notFoundMatches, ambiguousMatches, itemsToUpdateCount } = useMemo(() => {
        const changed: RowMatchResult[] = [];
        const unchanged: RowMatchResult[] = [];
        const notFound: RowMatchResult[] = [];
        const ambiguous: RowMatchResult[] = [];

        matches.forEach(m => {
            if (m.matchType === 'exact') {
                if (Object.keys(m.willUpdate).length > 0) {
                    changed.push(m);
                } else {
                    unchanged.push(m);
                }
            } else if (m.matchType === 'ambiguous') {
                ambiguous.push(m);
            } else {
                notFound.push(m);
            }
        });
        return { 
            changedMatches: changed, 
            unchangedMatches: unchanged, 
            notFoundMatches: notFound, 
            ambiguousMatches: ambiguous,
            itemsToUpdateCount: changed.length + resolutions.size
        };
    }, [matches, resolutions]);

    // 4. Callbacks
    const toggleField = useCallback((field: keyof MarketItem | 'album_ids' | 'old_price') => {
        setFieldsToUpdate(prev => {
            const newSet = new Set(prev);
            if (newSet.has(field)) newSet.delete(field);
            else newSet.add(field);
            return newSet;
        });
    }, []);

    const handleApply = useCallback(() => {
        const updates: Record<number, Partial<MarketItem>> = {};
        const itemsToValidate = new Map<string, { fileRow: NewProductRow; systemItem: MarketItem }>();
        const newValidationErrors: Record<string, string[]> = {};
        let hasErrors = false;
    
        changedMatches.forEach(match => {
            if (match.matchedItem) {
                itemsToValidate.set(match.fileRow.tempId, { fileRow: match.fileRow, systemItem: match.matchedItem });
            }
        });
    
        resolutions.forEach((systemItemId, fileRowTempId) => {
            const fileRow = fileRows.find(r => r.tempId === fileRowTempId);
            const selectedSystemItem = allItems.find(i => i.id === systemItemId);
            if (fileRow && selectedSystemItem) {
                itemsToValidate.set(fileRow.tempId, { fileRow, systemItem: selectedSystemItem });
            }
        });
        
        itemsToValidate.forEach(({ fileRow, systemItem }, tempId) => {
            const [recalculatedMatch] = calculateRowMatches([fileRow], [systemItem], matchKey, fieldsToUpdate, allAlbums, allCategories);
            const changes = recalculatedMatch ? recalculatedMatch.willUpdate : {};
            
            if (Object.keys(changes).length === 0) return; 

            const rowErrors: string[] = [];

            if (changes.hasOwnProperty('title') && (!fileRow.title || fileRow.title.trim().length < 4)) {
                rowErrors.push('title');
            }
            if (changes.hasOwnProperty('description') && (!fileRow.description || fileRow.description.trim().length < 10)) {
                rowErrors.push('description');
            }
            if (changes.hasOwnProperty('price') && (!fileRow.price || String(fileRow.price).trim() === '')) {
                rowErrors.push('price');
            }
            if (changes.hasOwnProperty('category') && !fileRow.category) {
                rowErrors.push('category');
            }

            if (rowErrors.length > 0) {
                newValidationErrors[tempId] = rowErrors;
                hasErrors = true;
            } else {
                updates[systemItem.id] = { ...(updates[systemItem.id] || {}), ...changes };
            }
        });

        setValidationErrors(newValidationErrors);

        if (hasErrors) {
            window.showAppToast?.('Пожалуйста, исправьте ошибки в подсвеченных полях.', 'warning');
            return;
        }

        const totalUpdateCount = Object.keys(updates).length;
    
        if (totalUpdateCount > 0) {
            onApplyUpdates(updates);
            onClose();
        } else {
            window.showAppToast?.("Нет изменений для применения.", 'info');
        }
    }, [changedMatches, resolutions, fileRows, allItems, matchKey, fieldsToUpdate, allAlbums, allCategories, onApplyUpdates, onClose]);
    

    const handleCloseRequest = useCallback(() => {
        setShowCloseConfirm(true);
    }, []);

    const handleQueueNewItems = useCallback(() => {
        if (notFoundMatches.length > 0) {
            const rowsToQueue = notFoundMatches.map(match => match.fileRow);
            onQueueNewItems(rowsToQueue);
        }
        onClose();
    }, [notFoundMatches, onQueueNewItems, onClose]);

    const handleResolveConflict = useCallback((fileRowTempId: string, systemItemId: number | null) => {
        setResolutions(prev => {
            const newResolutions = new Map(prev);
            if (systemItemId === null || newResolutions.get(fileRowTempId) === systemItemId) {
                newResolutions.delete(fileRowTempId);
            } else {
                newResolutions.set(fileRowTempId, systemItemId);
            }
            return newResolutions;
        });
    }, []);

    const handleCellChange = useCallback((fileRowTempId: string, field: keyof NewProductRow, value: any) => {
        setFileRows(prevRows => 
            prevRows.map(row => 
                row.tempId === fileRowTempId ? { ...row, [field]: value } : row
            )
        );
        setValidationErrors(prev => {
            if (prev[fileRowTempId]?.includes(field as string)) {
                const newErrors = { ...prev };
                newErrors[fileRowTempId] = newErrors[fileRowTempId].filter(f => f !== field);
                if (newErrors[fileRowTempId].length === 0) {
                    delete newErrors[fileRowTempId];
                }
                return newErrors;
            }
            return prev;
        });
    }, []);


    return {
        state: {
            fileRows,
            matchKey,
            fieldsToUpdate,
            activeTab,
            showCloseConfirm,
            changedMatches,
            unchangedMatches,
            notFoundMatches,
            ambiguousMatches,
            matchesTotal: matches.length,
            itemsToUpdateCount,
            resolutions,
            validationErrors,
        },
        actions: {
            setMatchKey,
            setFieldsToUpdate,
            setActiveTab,
            setShowCloseConfirm,
            toggleField,
            handleApply,
            handleCloseRequest,
            handleQueueNewItems,
            handleResolveConflict,
            handleCellChange,
        }
    };
}
