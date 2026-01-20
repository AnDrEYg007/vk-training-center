import { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NewProductRow, BulkPriceUpdatePayload } from '../../types';
import { MarketCategory, MarketAlbum } from '../../../shared/types';

interface UseCreateMultipleProductsProps {
    onSave: (productsData: NewProductRow[]) => Promise<{ successfulTempIds: string[], failed: { tempId: string, error: string }[] }>;
    onClose: () => void;
    initialRows?: NewProductRow[] | null;
}

export const useCreateMultipleProducts = ({ onSave, onClose, initialRows }: UseCreateMultipleProductsProps) => {
    // Инициализируем пустые строки или начальные данные
    const [rows, setRows] = useState<NewProductRow[]>(() => 
        initialRows && initialRows.length > 0
            ? initialRows
            : [
                { tempId: uuidv4(), price: '', old_price: '', useDefaultImage: true },
                { tempId: uuidv4(), price: '', old_price: '', useDefaultImage: true }
            ]
    );
    
    // Локальные состояния
    const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [activeDescriptionRowId, setActiveDescriptionRowId] = useState<string | null>(null);
    
    // Selection State
    const [selectedTempIds, setSelectedTempIds] = useState<Set<string>>(new Set());

    // Состояние ошибок
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
    
    // Состояния сохранения
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [validRowsToSave, setValidRowsToSave] = useState<NewProductRow[]>([]);

    // Bulk & Paste Modals State
    const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
    const [activeBulkModal, setActiveBulkModal] = useState<'category' | 'album' | 'price' | null>(null);
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

    const isDirty = useMemo(() => {
        if (initialRows && initialRows.length > 0) return true;
        if (rows.length !== 2) return true; 
        return rows.some(row => 
            (row.title && row.title.trim() !== '') ||
            (row.description && row.description.trim() !== '') ||
            (row.price && row.price !== '') ||
            (row.old_price && row.old_price !== '') ||
            row.sku || row.category || row.photoFile || row.photoPreview
        );
    }, [rows, initialRows]);

    const handleAddRow = () => {
        setRows(prev => [...prev, { tempId: uuidv4(), price: '', old_price: '', useDefaultImage: true }]);
    };

    const handleCopyRow = (tempId: string) => {
        setRows(prev => {
            const index = prev.findIndex(row => row.tempId === tempId);
            if (index === -1) return prev;
            const sourceRow = prev[index];
            const newRow: NewProductRow = {
                ...sourceRow,
                tempId: uuidv4(),
                category: sourceRow.category ? { ...sourceRow.category } : undefined,
                album_ids: sourceRow.album_ids ? [...sourceRow.album_ids] : [],
            };
            const newRows = [...prev];
            newRows.splice(index + 1, 0, newRow);
            return newRows;
        });
    };

    const handleRowChange = (tempId: string, field: keyof NewProductRow, value: any) => {
        setRows(prev => prev.map(row => row.tempId === tempId ? { ...row, [field]: value } : row));
        if (errors[tempId]) {
             setErrors(prev => {
                const rowErrors = prev[tempId] || [];
                let newRowErrors = rowErrors.filter(e => e !== field);
                if ((field === 'photoPreview' || field === 'photoFile' || field === 'useDefaultImage') && rowErrors.includes('photo')) {
                     newRowErrors = newRowErrors.filter(e => e !== 'photo');
                }
                if (newRowErrors.length === rowErrors.length) return prev;
                return { ...prev, [tempId]: newRowErrors };
             });
        }
        if (serverErrors[tempId]) {
            setServerErrors(prev => {
                const newServerErrors = { ...prev };
                delete newServerErrors[tempId];
                return newServerErrors;
            });
        }
    };

    const handleRemoveRow = (tempId: string) => {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter(row => row.tempId !== tempId));
        if (selectedTempIds.has(tempId)) {
            setSelectedTempIds(prev => {
                const next = new Set(prev);
                next.delete(tempId);
                return next;
            });
        }
    };
    
    const toggleSelection = (tempId: string) => {
        setSelectedTempIds(prev => {
            const next = new Set(prev);
            if (next.has(tempId)) next.delete(tempId);
            else next.add(tempId);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedTempIds.size === rows.length) setSelectedTempIds(new Set());
        else setSelectedTempIds(new Set(rows.map(r => r.tempId)));
    };
    
    const clearSelection = () => setSelectedTempIds(new Set());

    const handleBulkEditSelect = useCallback((field: string) => {
        setIsBulkEditOpen(false);
        setTimeout(() => {
            switch (field) {
                case 'Категорию': setActiveBulkModal('category'); break;
                case 'Подборку': setActiveBulkModal('album'); break;
                case 'Цену': setActiveBulkModal('price'); break;
            }
        }, 100);
    }, []);

    const handleBulkCategoryUpdate = (categoryObj: MarketCategory | any[]) => {
        if (Array.isArray(categoryObj)) return;
        setRows(prev => prev.map(row => {
            if (selectedTempIds.has(row.tempId)) {
                return { ...row, category: { id: categoryObj.id, name: categoryObj.name, section_id: categoryObj.section_id, section_name: categoryObj.section_name } };
            }
            return row;
        }));
        setActiveBulkModal(null);
    };

    const handleBulkAlbumUpdate = (albumId: number | null) => {
        setRows(prev => prev.map(row => {
            if (selectedTempIds.has(row.tempId)) {
                return { ...row, album_ids: albumId ? [albumId] : [] };
            }
            return row;
        }));
        setActiveBulkModal(null);
    };
    
    const handleBulkPriceUpdate = (payload: BulkPriceUpdatePayload) => {
        setRows(prev => prev.map(row => {
            if (!selectedTempIds.has(row.tempId)) return row;
            let currentPrice = parseFloat(row.price.replace(',', '.')) || 0;
            let newPrice = currentPrice;
            switch (payload.mode) {
                case 'set': newPrice = payload.setValue ? payload.setValue / 100 : 0; break;
                case 'round':
                    const target = payload.roundTarget || 0;
                    const direction = payload.roundDirection || 'up';
                    const base = Math.floor(currentPrice / 10) * 10;
                    const targetInDecade = base + target;
                    newPrice = direction === 'up' ? (targetInDecade >= currentPrice ? targetInDecade : targetInDecade + 10) : (targetInDecade <= currentPrice ? targetInDecade : targetInDecade - 10);
                    break;
                case 'change':
                    const changeVal = payload.changeValue || 0;
                    if (payload.changeType === 'amount') {
                        newPrice = payload.changeAction === 'increase' ? currentPrice + (changeVal/100) : Math.max(0, currentPrice - (changeVal/100));
                    } else {
                         const factor = 1 + (payload.changeAction === 'increase' ? changeVal : -changeVal) / 100;
                         newPrice = Math.round(currentPrice * factor);
                    }
                    break;
            }
            return { ...row, price: String(newPrice) };
        }));
        setActiveBulkModal(null);
    };

    const handleImportFromPaste = (newRows: NewProductRow[]) => {
        // Умная вставка: если есть пустые строки в начале, заполняем их.
        // Но проще всего просто добавить в конец или заменить все пустые.
        setRows(currentRows => {
            // Фильтруем текущие строки, оставляя только те, где есть данные
            const filledRows = currentRows.filter(r => (r.title && r.title.trim()) || (r.price && r.price.trim()) || r.photoPreview);
            // Добавляем новые
            return [...filledRows, ...newRows];
        });
        setIsPasteModalOpen(false);
    };

    const handleUrlInputChange = (tempId: string, value: string) => setUrlInputs(prev => ({ ...prev, [tempId]: value }));

    const handleUrlBlur = (tempId: string) => {
        const url = urlInputs[tempId];
        if (!url || !url.trim()) return;
        const img = new Image();
        img.onload = () => {
            handleRowChange(tempId, 'photoPreview', url);
            handleRowChange(tempId, 'photoUrl', url);
            handleRowChange(tempId, 'useDefaultImage', false);
            handleUrlInputChange(tempId, '');
        };
        img.src = url;
    };

    const handleClearPhoto = (tempId: string) => {
        handleRowChange(tempId, 'photoPreview', undefined);
        handleRowChange(tempId, 'photoUrl', undefined);
        handleRowChange(tempId, 'photoFile', undefined);
    };

    const handleSaveClick = () => {
        const validRows: NewProductRow[] = [];
        const newErrors: Record<string, string[]> = {};
        let hasErrors = false;
        const rowsWithData = rows.filter(row => (row.title && row.title.trim() !== '') || (row.price && row.price !== '') || (row.description && row.description.trim() !== '') || row.category || row.photoPreview || row.useDefaultImage);
        const targetRows = rowsWithData.length > 0 ? rowsWithData : (rows.length > 0 ? [rows[0]] : []);
        targetRows.forEach((row) => {
            const rowErrors: string[] = [];
            if (!row.photoPreview && !row.useDefaultImage) rowErrors.push("photo");
            if (!row.title?.trim() || row.title.trim().length < 4) rowErrors.push("title");
            if (!row.description?.trim() || row.description.trim().length < 10) rowErrors.push("description");
            if (!row.price?.trim()) rowErrors.push("price");
            if (!row.category) rowErrors.push("category");
            if (rowErrors.length > 0) { newErrors[row.tempId] = rowErrors; hasErrors = true; }
            else {
                const priceVal = parseFloat(row.price!.replace(',', '.'));
                const oldPriceVal = row.old_price ? parseFloat(row.old_price.replace(',', '.')) : undefined;
                validRows.push({ ...row, price: String(Math.round(priceVal * 100)), old_price: oldPriceVal ? String(Math.round(oldPriceVal * 100)) : undefined });
            }
        });
        setErrors(newErrors);
        if (hasErrors) return;
        if (validRows.length === 0) { window.showAppToast?.("Заполните хотя бы один товар.", 'warning'); return; }
        setValidRowsToSave(validRows);
        setShowConfirmSave(true);
    };
    
    const handleConfirmSave = async () => {
        setShowConfirmSave(false);
        setIsSubmitting(true);
        setServerErrors({});
        try {
            const result = await onSave(validRowsToSave);
            if (result.successfulTempIds.length > 0) setRows(prev => prev.filter(row => !result.successfulTempIds.includes(row.tempId)));
            if (result.failed.length > 0) {
                const newServerErrors: Record<string, string> = {};
                result.failed.forEach(fail => { newServerErrors[fail.tempId] = fail.error; });
                setServerErrors(newServerErrors);
                window.showAppToast?.(`Загружено: ${result.successfulTempIds.length}. Ошибок: ${result.failed.length}.`, 'warning');
            } else {
                window.showAppToast?.(`Успешно загружено ${result.successfulTempIds.length} товаров.`, 'success');
                onClose();
            }
        } catch (e) { window.showAppToast?.("Критическая ошибка при сохранении.", 'error'); }
        finally { setIsSubmitting(false); }
    };

    // FIX: Added missing handleCloseRequest function to handle closing the modal with a dirty check
    const handleCloseRequest = useCallback(() => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    }, [isDirty, onClose]);

    return {
        rows,
        urlInputs,
        showCloseConfirm,
        activeDescriptionRowId,
        isDirty,
        activeDescriptionText: activeDescriptionRowId ? (rows.find(r => r.tempId === activeDescriptionRowId)?.description || '') : '',
        errors,
        serverErrors,
        isSubmitting,
        showConfirmSave,
        validRowsToSave,
        selectedTempIds,
        isBulkEditOpen,
        activeBulkModal,
        isPasteModalOpen,
        actions: {
            setShowCloseConfirm,
            setActiveDescriptionRowId,
            handleAddRow,
            handleCopyRow,
            handleRowChange,
            handleRemoveRow,
            handleUrlInputChange,
            handleUrlBlur,
            handleClearPhoto,
            handleSave: handleSaveClick,
            handleConfirmSave,
            setShowConfirmSave,
            handleCloseRequest,
            toggleSelection,
            toggleSelectAll,
            clearSelection,
            setIsBulkEditOpen,
            setActiveBulkModal,
            handleBulkEditSelect,
            handleBulkCategoryUpdate,
            handleBulkAlbumUpdate,
            handleBulkPriceUpdate,
            setIsPasteModalOpen,
            handleImportFromPaste
        }
    };
};
// end hook