// FIX: Import 'React' namespace to resolve type errors for React.ChangeEvent and React.MouseEvent.
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { MarketAlbum, Project, MarketItem } from '../../../shared/types';
import { useProjects } from '../../../contexts/ProjectsContext';

interface UseCreateSingleProductProps {
    onClose: () => void;
    onSave: (productData: any) => Promise<void> | void;
    projectId: string;
    initialData?: MarketItem | null; // Новый проп для копирования
}

export const useCreateSingleProduct = ({ onClose, onSave, projectId, initialData }: UseCreateSingleProductProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [sku, setSku] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState<MarketAlbum | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    
    const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
    const { projects, handleUpdateProjectSettings } = useProjects();

    const currentProject = useMemo(() => projects.find(p => p.id === projectId) || null, [projects, projectId]);
    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        projects.forEach(p => { if (p.team) teams.add(p.team); });
        return Array.from(teams).sort();
    }, [projects]);

    // Эффект для заполнения формы при копировании
    useEffect(() => {
        if (initialData) {
            setName('NEW ' + initialData.title);
            setDescription(initialData.description);
            setPrice(String(Number(initialData.price.amount) / 100));
            setOldPrice(initialData.price.old_amount ? String(Number(initialData.price.old_amount) / 100) : '');
            setSku(initialData.sku || '');
            setPhotoPreview(initialData.thumb_photo);
            
            // Категория и альбом требуют дополнительной логики поиска, которая должна быть в компоненте
            // Мы передадим их ID, а компонент найдет объекты
        }
    }, [initialData]);

    const isDirty = useMemo(() => {
        if (initialData) return true; // В режиме копирования форма всегда "грязная"
        return !!(
            name.trim() || 
            description.trim() || 
            price.trim() || 
            oldPrice.trim() || 
            sku.trim() || 
            selectedAlbum || 
            selectedCategory || 
            photoFile || 
            photoUrl.trim() ||
            photoPreview
        );
    }, [name, description, price, oldPrice, sku, selectedAlbum, selectedCategory, photoFile, photoUrl, photoPreview, initialData]);

    const handleCloseRequest = useCallback(() => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    }, [isDirty, onClose]);

    const confirmClose = useCallback(() => {
        setShowCloseConfirm(false);
        onClose();
    }, [onClose]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            setPhotoUrl('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrors(prev => prev.filter(e => e !== 'photo'));
        }
    }, []);

    const handleUrlBlur = useCallback(() => {
        if (!photoUrl.trim()) return;
        
        const img = new Image();
        img.onload = () => {
            setPhotoPreview(photoUrl);
            setPhotoFile(null);
            setErrors(prev => prev.filter(e => e !== 'photo'));
        };
        img.onerror = () => {
            window.showAppToast?.("Не удалось загрузить изображение по этой ссылке.", 'error');
            setPhotoPreview(null);
        };
        img.src = photoUrl;
    }, [photoUrl]);

    const handleClearPhoto = useCallback(() => {
        setPhotoFile(null);
        setPhotoUrl('');
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const updateName = (val: string) => { setName(val); if(val.trim().length >= 4) setErrors(prev => prev.filter(e => e !== 'name')); };
    const updateDescription = (val: string) => { setDescription(val); if(val.trim().length >= 10) setErrors(prev => prev.filter(e => e !== 'description')); };
    const updatePrice = (val: string) => { setPrice(val); if(val.trim()) setErrors(prev => prev.filter(e => e !== 'price')); };
    const updateCategory = (val: any) => { setSelectedCategory(val); if(val) setErrors(prev => prev.filter(e => e !== 'category')); };


    const handleSave = useCallback(async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const newErrors: string[] = [];

        if (!name.trim() || name.trim().length < 4) newErrors.push("name");
        if (!description.trim() || description.trim().length < 10) newErrors.push("description");
        if (!price.trim()) newErrors.push("price");
        if (!selectedCategory) newErrors.push("category");
        if (!photoFile && !photoPreview) newErrors.push("photo"); // Изменено на photoPreview

        setErrors(newErrors);

        if (newErrors.length > 0) {
            return;
        }

        setIsSaving(true);
        
        const productData = {
            name,
            description,
            price: Math.round(parseFloat(price) * 100),
            old_price: oldPrice ? Math.round(parseFloat(oldPrice) * 100) : undefined,
            sku,
            albumId: selectedAlbum?.id,
            categoryId: selectedCategory?.id,
            photoFile,
            photoUrl: photoUrl.trim() || (photoPreview && !photoFile ? photoPreview : undefined), // Используем превью как URL, если нет файла
        };

        try {
            await onSave(productData);
        } catch (err) {
            console.error("Error in handleSave:", err);
            const msg = err instanceof Error ? err.message : "Неизвестная ошибка";
            window.showAppToast?.(`Ошибка при создании товара: ${msg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [name, description, price, oldPrice, sku, selectedAlbum, selectedCategory, photoFile, photoUrl, photoPreview, onSave]);

    const handleSaveProjectSettings = useCallback(async (updatedProject: Project) => {
        try {
            await handleUpdateProjectSettings(updatedProject);
            setIsProjectSettingsOpen(false);
        } catch (error) {
            console.error("Failed to save project settings", error);
        }
    }, [handleUpdateProjectSettings]);

    const actions = useMemo(() => ({
        handleCloseRequest,
        confirmClose,
        handleFileChange,
        handleUrlBlur,
        handleClearPhoto,
        handleSave,
        handleSaveProjectSettings
    }), [handleCloseRequest, confirmClose, handleFileChange, handleUrlBlur, handleClearPhoto, handleSave, handleSaveProjectSettings]);

    return {
        formState: {
            name, setName: updateName,
            description, setDescription: updateDescription,
            price, setPrice: updatePrice,
            oldPrice, setOldPrice,
            sku, setSku,
            selectedAlbum, setSelectedAlbum,
            selectedCategory, setSelectedCategory: updateCategory,
            photoFile, photoUrl, setPhotoUrl, photoPreview,
        },
        uiState: {
            showCloseConfirm, setShowCloseConfirm,
            isProjectSettingsOpen, setIsProjectSettingsOpen,
            currentProject, uniqueTeams,
            fileInputRef,
            isSaving,
            errors
        },
        actions
    };
};