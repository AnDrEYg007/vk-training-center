import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../../shared/components/ToastProvider';
import { PromoCode, PromoCodeCreatePayload } from '../../reviews-contest/types';
import * as api from '../../../../services/api/automations_general.api';

// Управление промокодами для универсальных конкурсов (по contestId)
export const useGeneralPromocodesManager = (contestId?: string) => {
    const toast = useToast();
    const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Состояния для формы загрузки
    const [inputCodes, setInputCodes] = useState('');

    // Состояния для выделения
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    
    // Состояния для удаления
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ count: number; ids: string[] } | null>(null);
    const [clearAllConfirmation, setClearAllConfirmation] = useState(false);
    
    // Состояния для редактирования описания
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingDescription, setEditingDescription] = useState('');

    const loadPromocodes = useCallback(async () => {
        if (!contestId) {
            setPromocodes([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await api.getGeneralContestPromocodes(contestId);
            setPromocodes(data);
            setSelectedIds(new Set());
        } catch (err) {
            console.error("Failed to load general contest promocodes", err);
            setError("Не удалось загрузить список промокодов.");
        } finally {
            setIsLoading(false);
        }
    }, [contestId]);

    useEffect(() => {
        loadPromocodes();
    }, [loadPromocodes]);

    const handlePasteCodes = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData.getData('text');
        
        if (clipboardData.includes('\t')) {
            e.preventDefault();
            const lines = clipboardData.split(/\r\n|\n|\r/);
            const formattedText = lines.map(line => {
                if (!line.trim()) return '';
                const parts = line.split('\t').map(part => part.trim()).filter(Boolean);
                if (parts.length >= 2) {
                    return `${parts[0]} | ${parts[1]}`;
                } else if (parts.length === 1) {
                    return parts[0]; 
                }
                return '';
            }).filter(Boolean).join('\n');

            setInputCodes(prev => {
                const prefix = prev && !prev.endsWith('\n') ? '\n' : '';
                return prev + prefix + formattedText;
            });
        }
    };
    
    const handleAddCodes = async () => {
        if (!inputCodes.trim()) return;
        if (!contestId) {
            setError('Сначала сохраните конкурс, затем добавляйте промокоды.');
            return;
        }
        
        setIsSaving(true);
        setError(null);
        
        const lines = inputCodes.split(/\r\n|\n|\r/).filter(l => l.trim());
        const payloads: PromoCodeCreatePayload[] = [];
        
        lines.forEach(line => {
            const parts = line.split('|').map(p => p.trim());
            const code = parts[0];
            const description = parts.length > 1 ? parts[1] : undefined;
            
            if (code) {
                payloads.push({ code, description });
            }
        });
        
        if (payloads.length === 0) {
            setIsSaving(false);
            return;
        }

        try {
            await api.addGeneralContestPromocodes(contestId, payloads);
            setInputCodes('');
            await loadPromocodes();
        } catch (err) {
            console.error("Failed to add general contest codes", err);
            toast.error("Не удалось добавить промокоды. Попробуйте снова.");
            setError("Не удалось добавить промокоды. Попробуйте снова.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Логика выделения ---
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleAll = () => {
        const availableCodes = promocodes.filter(p => !p.is_issued);
        if (selectedIds.size === availableCodes.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(availableCodes.map(p => p.id)));
        }
    };

    // --- Логика удаления ---
    const initiateDelete = (ids: string[]) => {
        if (ids.length === 0) return;
        setDeleteConfirmation({ count: ids.length, ids });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;
        setIsSaving(true);
        try {
            await api.deleteGeneralContestPromocodesBulk(deleteConfirmation.ids);
            setPromocodes(prev => prev.filter(p => !deleteConfirmation.ids.includes(p.id)));
            setSelectedIds(new Set());
        } catch (err) {
             toast.error("Не удалось удалить промокоды.");
        } finally {
            setIsSaving(false);
            setDeleteConfirmation(null);
        }
    };
    
    // --- Логика полной очистки ---
    const confirmClearAll = async () => {
        if (!contestId) return;
        setIsSaving(true);
        try {
            await api.clearGeneralContestPromocodes(contestId);
            setPromocodes([]);
            setSelectedIds(new Set());
            setClearAllConfirmation(false);
        } catch (err) {
            toast.error("Не удалось очистить базу промокодов.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Логика редактирования ---
    const startEditing = (promo: PromoCode) => {
        setEditingId(promo.id);
        setEditingDescription(promo.description || '');
    };

    const saveEditing = async () => {
        if (!editingId) return;
        try {
            await api.updateGeneralContestPromocode(editingId, editingDescription);
            setPromocodes(prev => prev.map(p => p.id === editingId ? { ...p, description: editingDescription } : p));
            setEditingId(null);
        } catch (err) {
            toast.error("Не удалось обновить описание.");
        }
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingDescription('');
    };

    return {
        state: {
            promocodes,
            isLoading,
            isSaving,
            error,
            inputCodes,
            selectedIds,
            deleteConfirmation,
            clearAllConfirmation,
            editingId,
            editingDescription,
        },
        actions: {
            setInputCodes,
            handlePasteCodes,
            handleAddCodes,
            toggleSelection,
            toggleAll,
            initiateDelete,
            confirmDelete,
            setDeleteConfirmation,
            setClearAllConfirmation,
            confirmClearAll,
            startEditing,
            saveEditing,
            cancelEditing,
            setEditingDescription,
            reload: loadPromocodes,
        }
    };
};
