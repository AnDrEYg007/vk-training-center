
import React, { useState, useEffect, useCallback } from 'react';
import { PromoCode, PromoCodeCreatePayload } from '../types';
import * as api from '../../../../services/api/automations.api';

export const usePromocodesManager = (projectId: string) => {
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
    const [clearAllConfirmation, setClearAllConfirmation] = useState(false); // Подтверждение полной очистки
    
    // Состояния для редактирования описания
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingDescription, setEditingDescription] = useState('');

    const loadPromocodes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getContestPromocodes(projectId);
            setPromocodes(data);
            setSelectedIds(new Set()); // Сбрасываем выделение при обновлении
        } catch (err) {
            console.error("Failed to load promocodes", err);
            setError("Не удалось загрузить список промокодов.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

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
            await api.addContestPromocodes(projectId, payloads);
            setInputCodes('');
            await loadPromocodes();
        } catch (err) {
            console.error("Failed to add codes", err);
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
        // Выбираем только невыданные промокоды для удаления
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
            await api.deleteContestPromocodesBulk(deleteConfirmation.ids);
            setPromocodes(prev => prev.filter(p => !deleteConfirmation.ids.includes(p.id)));
            setSelectedIds(new Set()); // Сбрасываем выделение
        } catch (err) {
             window.showAppToast?.("Не удалось удалить промокоды.", 'error');
        } finally {
            setIsSaving(false);
            setDeleteConfirmation(null);
        }
    };
    
    // --- Логика полной очистки (Админ) ---
    const confirmClearAll = async () => {
        setIsSaving(true);
        try {
            await api.clearContestPromocodes(projectId);
            setPromocodes([]);
            setSelectedIds(new Set());
            setClearAllConfirmation(false);
        } catch (err) {
            window.showAppToast?.("Не удалось очистить базу промокодов.", 'error');
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
            await api.updateContestPromocode(editingId, editingDescription);
            setPromocodes(prev => prev.map(p => p.id === editingId ? { ...p, description: editingDescription } : p));
            setEditingId(null);
        } catch (err) {
            window.showAppToast?.("Не удалось обновить описание.", 'error');
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
        }
    };
};
