
import { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ScheduledPost, PhotoAttachment, Attachment } from '../../../../shared/types';
import { AiPost } from '../types';
import * as api from '../../../../services/api/automations_ai.api';
import { useAIGenerator, ChatTurn } from '../../../posts/hooks/useAIGenerator';

interface UseAiPostFormProps {
    projectId: string;
    onSaveSuccess: () => void;
}

export type MediaMode = 'all' | 'subset';
export type MediaSubsetType = 'random' | 'order';

export const useAiPostForm = ({ projectId, onSaveSuccess }: UseAiPostFormProps) => {
    // ID поста (null если создание)
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Метаданные
    const [automationName, setAutomationName] = useState('');
    const [automationDescription, setAutomationDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Расписание
    const [recurrenceInterval, setRecurrenceInterval] = useState(1);
    const [recurrenceType, setRecurrenceType] = useState<'minutes' | 'hours' | 'days' | 'weeks' | 'months'>('days');
    const [recurrenceEndType, setRecurrenceEndType] = useState<'infinite' | 'count' | 'date'>('infinite');
    const [recurrenceEndCount, setRecurrenceEndCount] = useState(10);
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
    const [recurrenceFixedDay, setRecurrenceFixedDay] = useState<number | ''>('');
    const [recurrenceIsLastDay, setRecurrenceIsLastDay] = useState(false);
    
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1); // Завтра
        return d.toISOString().split('T')[0];
    });
    const [startTime, setStartTime] = useState('10:00');

    // Контент
    const [generatedText, setGeneratedText] = useState('');
    const [images, setImages] = useState<PhotoAttachment[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Настройки медиа (Новые поля)
    const [mediaMode, setMediaMode] = useState<MediaMode>('all');
    // ИЗМЕНЕНИЕ: Тип number | '' чтобы можно было стереть значение в инпуте
    const [mediaSubsetCount, setMediaSubsetCount] = useState<number | ''>(1);
    const [mediaSubsetType, setMediaSubsetType] = useState<MediaSubsetType>('random');
    
    // AI State
    const [selectedAiTurn, setSelectedAiTurn] = useState<ChatTurn | null>(null);
    const [refreshPresetsKey, setRefreshPresetsKey] = useState(0);

    // Интеграция с AI хуком
    const { 
        state: aiState, 
        actions: aiActions, 
        refs: aiRefs 
    } = useAIGenerator({ 
        projectId, 
        // Исправлено: теперь обновляем текст при вызове действия "Добавить в пост"
        onTextGenerated: (text) => setGeneratedText(prev => prev ? `${prev}\n\n${text}` : text), 
        refreshKey: refreshPresetsKey, 
        postText: generatedText 
    });

    const handleTurnSelectionInChat = (turn: ChatTurn | null) => {
        setSelectedAiTurn(turn);
        if (turn && turn.aiResponse) {
            setGeneratedText(turn.aiResponse);
        }
    };

    const isDirty = useMemo(() => {
        return generatedText !== '' || images.length > 0 || attachments.length > 0 || aiState.chatHistory.length > 0 || automationName !== '';
    }, [generatedText, images, attachments, aiState.chatHistory, automationName]);

    const resetFormState = useCallback(() => {
        setCurrentPostId(null);
        setAutomationName('');
        setAutomationDescription('');
        setIsActive(true);
        setGeneratedText(''); 
        setImages([]); 
        setAttachments([]); 
        setSelectedAiTurn(null);
        setRecurrenceInterval(1); 
        setRecurrenceType('days');
        setRecurrenceEndType('infinite');
        setRecurrenceEndCount(10);
        setRecurrenceEndDate('');
        setRecurrenceFixedDay('');
        setRecurrenceIsLastDay(false);
        
        // Сброс медиа настроек
        setMediaMode('all');
        setMediaSubsetCount(1);
        setMediaSubsetType('random');
        
        const d = new Date();
        d.setDate(d.getDate() + 1);
        setStartDate(d.toISOString().split('T')[0]);
        setStartTime('10:00');
        
        aiActions.handleClearHistory();
        aiActions.setUserPrompt('');
        aiActions.setUseCustomSystemPrompt(false);
        aiActions.setCustomSystemPrompt('');
        aiActions.selectProduct(null);
        aiActions.setAllCompanyFields(false);
        aiActions.setSelectedPreset(null);
    }, [aiActions]);

    const handleEditPost = useCallback((post: AiPost) => {
        setCurrentPostId(post.id);
        
        setAutomationName(post.title || "");
        setAutomationDescription(post.description || "");
        setIsActive(post.is_active !== false);

        setGeneratedText(post.text || "");
        
        try {
            const parsedImages = typeof post.images === 'string' ? JSON.parse(post.images) : post.images || [];
            setImages(parsedImages);
        } catch (e) { setImages([]); }
        
        try {
            const parsedAttachments = typeof post.attachments === 'string' ? JSON.parse(post.attachments) : post.attachments || [];
            setAttachments(parsedAttachments);
        } catch (e) { setAttachments([]); }
        
        setRecurrenceInterval(post.recurrence_interval || 1);
        setRecurrenceType((post.recurrence_type as any) || 'days');
        setRecurrenceEndType((post.recurrence_end_type as any) || 'infinite');
        setRecurrenceEndCount(post.recurrence_end_count || 10);
        setRecurrenceEndDate(post.recurrence_end_date || '');
        setRecurrenceFixedDay(post.recurrence_fixed_day || '');
        setRecurrenceIsLastDay(post.recurrence_is_last_day || false);
        
        if (post.publication_date) {
            const dateObj = new Date(post.publication_date);
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            setStartDate(`${y}-${m}-${d}`);
            
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            setStartTime(`${hours}:${minutes}`);
        }
        
        let aiParams: any = {};
        if (post.aiGenerationParams) {
            aiParams = post.aiGenerationParams;
        } else if ((post as any).ai_generation_params) {
            try {
                aiParams = JSON.parse((post as any).ai_generation_params);
            } catch (e) {}
        }
        
        // Восстанавливаем настройки медиа
        if (aiParams) {
             setMediaMode(aiParams.mediaMode || 'all');
             setMediaSubsetCount(aiParams.mediaSubsetCount || 1);
             setMediaSubsetType(aiParams.mediaSubsetType || 'random');
             
             aiActions.restoreContext(aiParams);
             
             const mockTurn: ChatTurn = {
                 id: uuidv4(),
                 systemPrompt: aiParams.systemPrompt || "",
                 userPrompt: aiParams.userPrompt || "",
                 aiResponse: post.text,
                 isLoading: false,
                 generationParams: aiParams
             };
             setSelectedAiTurn(mockTurn);
        }
    }, [aiActions]);

    const handleSavePost = async () => {
           if (!automationName.trim()) {
               window.showAppToast?.("Пожалуйста, введите название для этой автоматизации.", 'warning');
               return;
           }
           if (!selectedAiTurn) {
              window.showAppToast?.("Пожалуйста, протестируйте и выберите (кликните на кружок) успешный вариант в чате, который будет использоваться для генерации.", 'warning');
              return;
           }
           if (!generatedText) {
               window.showAppToast?.("Текст поста пуст. Выберите вариант из чата или введите вручную.", 'warning');
               return;
           }

        setIsSaving(true);
        const firstDate = new Date(`${startDate}T${startTime}:00`).toISOString();
        const postIdToUse = currentPostId || `new-post-${Date.now()}`;
        
        // Определение названия шаблона
        let systemPromptName = "Системный (По умолчанию)";
        if (aiState.useCustomSystemPrompt) {
            systemPromptName = aiState.selectedPreset ? aiState.selectedPreset.name : "Пользовательский";
        }

        const currentAiParams = {
            systemPrompt: aiState.useCustomSystemPrompt ? aiState.customSystemPrompt : aiState.defaultSystemPrompt,
            systemPromptName: systemPromptName,
            userPrompt: aiState.userPrompt,
            productId: aiState.selectedProduct ? String(aiState.selectedProduct.id) : undefined,
            productFields: Array.from(aiState.productFields) as string[],
            companyFields: Array.from(aiState.companyFields) as string[],
            // Сохраняем новые настройки медиа
            mediaMode,
            mediaSubsetCount: Number(mediaSubsetCount) || 1, // ИЗМЕНЕНИЕ: Гарантируем число при сохранении
            mediaSubsetType
        };

        const postData: ScheduledPost = {
            id: postIdToUse, 
            text: generatedText, 
            date: firstDate, 
            images, 
            attachments,
            is_cyclic: true, 
            recurrence_interval: recurrenceInterval, 
            recurrence_type: recurrenceType,
            recurrence_end_type: recurrenceEndType, 
            recurrence_end_count: recurrenceEndCount, 
            recurrence_end_date: recurrenceEndDate,
            recurrence_fixed_day: recurrenceFixedDay !== '' ? Number(recurrenceFixedDay) : undefined, 
            recurrence_is_last_day: recurrenceIsLastDay,
            aiGenerationParams: currentAiParams,
            title: automationName,
            description: automationDescription,
            is_active: isActive
        };

        try {
            await api.createAiPost(postData, projectId);
            window.showAppToast?.(currentPostId ? "AI пост успешно обновлен!" : "AI пост успешно создан!", 'success');
            onSaveSuccess();
            resetFormState();
        } catch (e) {
            window.showAppToast?.("Ошибка сохранения: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formState: {
            currentPostId,
            automationName,
            automationDescription,
            isActive,
            recurrenceInterval,
            recurrenceType,
            recurrenceEndType,
            recurrenceEndCount,
            recurrenceEndDate,
            recurrenceFixedDay,
            recurrenceIsLastDay,
            startDate,
            startTime,
            generatedText,
            images,
            attachments,
            isUploading,
            selectedAiTurn,
            isSaving,
            isDirty,
            // Новые поля
            mediaMode,
            mediaSubsetCount,
            mediaSubsetType
        },
        formSetters: {
            setAutomationName,
            setAutomationDescription,
            setIsActive,
            setRecurrenceInterval,
            setRecurrenceType,
            setRecurrenceEndType,
            setRecurrenceEndCount,
            setRecurrenceEndDate,
            setRecurrenceFixedDay,
            setRecurrenceIsLastDay,
            setStartDate,
            setStartTime,
            setGeneratedText,
            setImages,
            setAttachments,
            setIsUploading,
            setRefreshPresetsKey,
            // Новые сеттеры
            setMediaMode,
            setMediaSubsetCount,
            setMediaSubsetType
        },
        ai: {
            state: aiState,
            actions: aiActions,
            refs: aiRefs,
            handleTurnSelectionInChat
        },
        handleSavePost,
        handleEditPost,
        resetFormState
    };
};
