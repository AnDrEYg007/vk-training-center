
import React, { useState, useRef, useEffect, useCallback, MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../../../services/api';
import { AiPromptPreset, MarketItem } from '../../../shared/types';

export interface ChatTurn {
    id: string;
    systemPrompt: string;
    userPrompt: string;
    aiResponse: string | null;
    isLoading: boolean;
    replyToId?: string;
    contextSnapshot?: {
        items: { type: 'product' | 'company', name: string, details: string, photo?: string }[];
    };
    // New: Store generation parameters for cyclic regeneration
    generationParams?: {
        systemPrompt: string;
        userPrompt: string;
        productId?: string;
        productFields?: string[];
        companyFields?: string[];
    }
}

export type ContextField = 'title' | 'description' | 'price' | 'old_price' | string;

interface UseAIGeneratorProps {
    projectId: string;
    onTextGenerated: (text: string) => void;
    refreshKey: number;
    postText: string;
}

export const useAIGenerator = ({ projectId, onTextGenerated, refreshKey, postText }: UseAIGeneratorProps) => {
    // UI State
    const [height, setHeight] = useState(800); 
    const [isResizing, setIsResizing] = useState(false);
    
    // Chat State
    const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
    const [userPrompt, setUserPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [highlightedTurnId, setHighlightedTurnId] = useState<string | null>(null);
    const [replyToTurn, setReplyToTurn] = useState<ChatTurn | null>(null);
    
    // Multi-Generation Selection State
    const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null);

    // System Prompt State
    const [useCustomSystemPrompt, setUseCustomSystemPrompt] = useState(false);
    const [customSystemPrompt, setCustomSystemPrompt] = useState('');
    const [defaultSystemPrompt, setDefaultSystemPrompt] = useState('');
    const [isLoadingDefaultPrompt, setIsLoadingDefaultPrompt] = useState(false);

    // Presets State
    const [aiPresets, setAiPresets] = useState<AiPromptPreset[]>([]);
    const [isLoadingPresets, setIsLoadingPresets] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<AiPromptPreset | null>(null);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [isCreatingPreset, setIsCreatingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [canSave, setCanSave] = useState(false);

    // Context State
    const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);
    
    // Product Context
    const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
    const [isLoadingMarketItems, setIsLoadingMarketItems] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<MarketItem | null>(null);
    const [productFields, setProductFields] = useState<Set<ContextField>>(new Set(['title', 'price']));

    // Company Context
    const [companyContextData, setCompanyContextData] = useState<Record<string, string>>({});
    const [isLoadingCompanyContext, setIsLoadingCompanyContext] = useState(false);
    const [companyFields, setCompanyFields] = useState<Set<ContextField>>(new Set());

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const turnRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            setIsLoadingDefaultPrompt(true);
            try {
                const prompt = await api.getDefaultSystemPrompt();
                setDefaultSystemPrompt(prompt);
            } catch (e) {
                console.error("Failed to load default prompt", e);
            } finally {
                setIsLoadingDefaultPrompt(false);
            }

            setIsLoadingPresets(true);
            try {
                const presets = await api.getAiPresets(projectId);
                setAiPresets(presets);
            } catch (e) {
                console.error("Failed to load presets", e);
            } finally {
                setIsLoadingPresets(false);
            }
        };
        loadData();
    }, [projectId, refreshKey]);
    
    // Load context data when panel opens
    useEffect(() => {
        if (isContextPanelOpen) {
            setIsLoadingMarketItems(true);
            api.getMarketData(projectId).then(data => {
                setMarketItems(data.items);
            }).catch(e => console.error("Failed to load market items", e))
            .finally(() => setIsLoadingMarketItems(false));

            setIsLoadingCompanyContext(true);
            api.getProjectSpecificContext(projectId).then(data => {
                setCompanyContextData(data.values);
            }).catch(e => console.error("Failed to load project context", e))
            .finally(() => setIsLoadingCompanyContext(false));
        }
    }, [isContextPanelOpen, projectId]);

    useEffect(() => {
        const hasChanges = selectedPreset 
            ? (selectedPreset.prompt !== customSystemPrompt || selectedPreset.name !== newPresetName && isCreatingPreset)
            : !!customSystemPrompt.trim();
        setCanSave(hasChanges);
    }, [customSystemPrompt, selectedPreset, newPresetName, isCreatingPreset]);

    // ЭФФЕКТ ДЛЯ АВТОМАТИЧЕСКОГО ВЫБОРА ШАБЛОНА
    // Если текст инструкции совпадает с одним из загруженных пресетов, а пресет не выбран - выбираем его.
    // Это нужно для корректного отображения состояния при редактировании сохраненных AI-постов.
    useEffect(() => {
        if (useCustomSystemPrompt && !selectedPreset && customSystemPrompt && aiPresets.length > 0) {
            const matchingPreset = aiPresets.find(p => p.prompt.trim() === customSystemPrompt.trim());
            if (matchingPreset) {
                setSelectedPreset(matchingPreset);
            }
        }
    }, [aiPresets, customSystemPrompt, useCustomSystemPrompt, selectedPreset]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isGenerating]);
    
    const toggleTurnSelection = useCallback((turnId: string) => {
        setSelectedTurnId(prev => prev === turnId ? null : turnId);
    }, []);


    const handleGenerateText = useCallback(async (
        overridePrompt?: string | any, 
        overrideSystemPrompt?: string,
        shouldClear: boolean = true // Добавлен флаг очистки поля, по умолчанию true (как в чате)
    ) => {
        const validOverridePrompt = typeof overridePrompt === 'string' ? overridePrompt : undefined;
        const promptToUse = validOverridePrompt || userPrompt;
        
        if (!promptToUse || typeof promptToUse !== 'string' || !promptToUse.trim()) return;

        const currentSystemPrompt = overrideSystemPrompt || (useCustomSystemPrompt ? customSystemPrompt : defaultSystemPrompt);
        
        // Build Context String
        const contextItems: { type: 'product' | 'company', name: string, details: string, photo?: string }[] = [];
        let contextString = "";

        // 1. Product Context
        if (selectedProduct) {
            const parts = [];
            if (productFields.has('title')) parts.push(`Название: ${selectedProduct.title}`);
            if (productFields.has('price')) {
                const priceInRub = (Number(selectedProduct.price.amount) / 100).toFixed(0);
                parts.push(`Цена: ${priceInRub} руб.`);
            }
            if (productFields.has('old_price') && selectedProduct.price.old_amount) {
                const oldPriceInRub = (Number(selectedProduct.price.old_amount) / 100).toFixed(0);
                parts.push(`Старая цена: ${oldPriceInRub} руб.`);
            }
            if (productFields.has('description')) parts.push(`Описание: ${selectedProduct.description}`);
            
            if (parts.length > 0) {
                const details = parts.join('\n');
                contextString += `\n[КОНТЕКСТ ТОВАРА]\n${details}\n`;
                contextItems.push({ 
                    type: 'product', 
                    name: selectedProduct.title, 
                    details: parts.join(', '), 
                    photo: selectedProduct.thumb_photo 
                });
            }
        }

        // 2. Company Context
        const companyParts: string[] = [];
        companyFields.forEach(fieldKey => {
            if (companyContextData[fieldKey]) {
                companyParts.push(`${fieldKey}: ${companyContextData[fieldKey]}`);
                 contextItems.push({
                    type: 'company',
                    name: fieldKey,
                    details: companyContextData[fieldKey]
                });
            }
        });
        
        if (companyParts.length > 0) {
            contextString += `\n[КОНТЕКСТ КОМПАНИИ]\n${companyParts.join('\n')}\n`;
        }
        
        // 3. Previous turn context (if replying)
        let replyContext = "";
        if (replyToTurn && replyToTurn.aiResponse) {
             replyContext = `\n[КОНТЕКСТ ПРЕДЫДУЩЕГО СООБЩЕНИЯ]\nВ ответ на это сообщение: "${replyToTurn.aiResponse}"\n`;
        }
        
        const finalPrompt = contextString + replyContext + promptToUse;

        const newTurn: ChatTurn = {
            id: uuidv4(),
            systemPrompt: currentSystemPrompt,
            userPrompt: promptToUse, 
            aiResponse: null,
            isLoading: true,
            replyToId: replyToTurn?.id,
            contextSnapshot: { items: contextItems },
            // Capture generation parameters for cyclic regeneration
            generationParams: {
                systemPrompt: currentSystemPrompt,
                userPrompt: promptToUse,
                productId: selectedProduct ? String(selectedProduct.id) : undefined,
                productFields: Array.from(productFields),
                companyFields: Array.from(companyFields)
            }
        };

        setChatHistory(prev => [...prev, newTurn]);
        
        // Очищаем поле только если shouldClear === true
        if (shouldClear) {
            setUserPrompt('');
        }
        
        setReplyToTurn(null); 
        setIsGenerating(true);

        try {
            const text = await api.generatePostText(finalPrompt, currentSystemPrompt);
            setChatHistory(prev => prev.map(turn => 
                turn.id === newTurn.id ? { ...turn, aiResponse: text, isLoading: false } : turn
            ));
        } catch (error) {
            console.error("Generation failed", error);
            setChatHistory(prev => prev.map(turn => 
                turn.id === newTurn.id ? { ...turn, aiResponse: "Произошла ошибка при генерации.", isLoading: false } : turn
            ));
        } finally {
            setIsGenerating(false);
        }
    }, [userPrompt, useCustomSystemPrompt, customSystemPrompt, defaultSystemPrompt, replyToTurn, selectedProduct, productFields, companyFields, companyContextData]);

    const handleQuickAction = async (action: 'rewrite' | 'fix_errors' | 'shorten' | 'expand' | 'add_emoji' | 'remove_emoji') => {
        let textToProcess = postText;
        let contextPrefix = "";

        if (replyToTurn && replyToTurn.aiResponse) {
            textToProcess = replyToTurn.aiResponse;
            contextPrefix = `[Действие "${action}" применено к сообщению из чата]\n`;
        } else if (!textToProcess) {
            return;
        }

        const newTurn: ChatTurn = {
            id: uuidv4(),
            systemPrompt: `Quick Action: ${action}`,
            userPrompt: `${contextPrefix}${textToProcess.substring(0, 100)}${textToProcess.length > 100 ? '...' : ''}`,
            aiResponse: null,
            isLoading: true
        };
        
        setChatHistory(prev => [...prev, newTurn]);
        setIsGenerating(true);
        setReplyToTurn(null);

        try {
            const result = await api.processPostTextWithAI(textToProcess, action, projectId);
            setChatHistory(prev => prev.map(turn => 
                turn.id === newTurn.id ? { ...turn, aiResponse: result, isLoading: false } : turn
            ));
        } catch (error) {
            setChatHistory(prev => prev.map(turn => 
                turn.id === newTurn.id ? { ...turn, aiResponse: "Ошибка обработки.", isLoading: false } : turn
            ));
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleRegenerate = (turn: ChatTurn) => {
        // ВАЖНО: Передаем false в третьем аргументе (shouldClear),
        // чтобы не очищать текущее поле ввода пользователя при регенерации старого сообщения.
        handleGenerateText(turn.userPrompt, turn.systemPrompt, false);
    };

    const handleSelectPreset = (preset: AiPromptPreset) => {
        setSelectedPreset(preset);
        setCustomSystemPrompt(preset.prompt);
    };

    const handleSavePreset = async () => {
        if (selectedPreset) {
            setShowUpdateConfirm(true);
        } else {
             setIsCreatingPreset(true);
             setNewPresetName("Новый шаблон");
        }
    };
    
    const handleInitiateSaveAsNew = () => {
         setIsCreatingPreset(true);
         setNewPresetName(selectedPreset ? `${selectedPreset.name} (Копия)` : "Новый шаблон");
         setSelectedPreset(null);
    };

    const handleCreatePreset = async () => {
        if (!newPresetName.trim()) return;
        setIsCreatingPreset(false);
        setIsLoadingPresets(true);
        try {
            const newPreset = await api.createAiPreset(projectId, { name: newPresetName, prompt: customSystemPrompt });
            setAiPresets(prev => [...prev, newPreset]);
            setSelectedPreset(newPreset);
        } catch (e) {
            console.error(e);
            window.showAppToast?.("Не удалось создать шаблон", 'error');
        } finally {
            setIsLoadingPresets(false);
        }
    };
    
    const handleCancelCreatePreset = () => {
        setIsCreatingPreset(false);
    };

    const handleUpdatePreset = async () => {
        if (!selectedPreset) return;
        setShowUpdateConfirm(false);
        setIsLoadingPresets(true);
        try {
            const updated = await api.updateAiPreset(selectedPreset.id, { name: selectedPreset.name, prompt: customSystemPrompt });
            setAiPresets(prev => prev.map(p => p.id === updated.id ? updated : p));
            setSelectedPreset(updated);
        } catch (e) {
            console.error(e);
            window.showAppToast?.("Не удалось обновить шаблон", 'error');
        } finally {
            setIsLoadingPresets(false);
        }
    };

    const handleClearHistory = () => {
        setChatHistory([]);
    };
    
    const handleAddToPost = (text: string) => {
        onTextGenerated(text);
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newHeight = Math.min(Math.max(300, e.clientY - (chatContainerRef.current?.getBoundingClientRect().top || 0) + 100), 1500);
            setHeight(newHeight);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);
    
    const handleJumpToTurn = (turnId: string) => {
        setHighlightedTurnId(turnId);
        const element = turnRefs.current[turnId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setHighlightedTurnId(null), 2000);
        }
    };
    
    const getRepliedTurnText = (turnId: string) => {
        const turn = chatHistory.find(t => t.id === turnId);
        return turn?.aiResponse || "Сообщение не найдено";
    };
    
    const handleSystemPromptToggle = (expanded: boolean) => {
        if (expanded && height < 500) {
            setHeight(500);
        }
    };

    const toggleContextPanel = () => setIsContextPanelOpen(!isContextPanelOpen);
    
    const toggleProductField = (field: ContextField) => {
        setProductFields(prev => {
            const next = new Set(prev);
            if (next.has(field)) next.delete(field);
            else next.add(field);
            return next;
        });
    };
    
    const toggleCompanyField = (field: ContextField) => {
        setCompanyFields(prev => {
            const next = new Set(prev);
            if (next.has(field)) next.delete(field);
            else next.add(field);
            return next;
        });
    };
    
    const setAllCompanyFields = (enable: boolean) => {
        if (enable) {
            setCompanyFields(new Set(Object.keys(companyContextData)));
        } else {
            setCompanyFields(new Set());
        }
    };
    
    // Restore state from saved parameters
    const restoreContext = async (params: any) => {
        if (!params) return;

        // ВАЖНО: Сбрасываем выбранный пресет при восстановлении, 
        // но useEffect для авто-синхронизации сработает, если текст совпадет.
        setSelectedPreset(null);
        
        // 1. Prompts
        if (params.userPrompt) setUserPrompt(params.userPrompt);
        if (params.systemPrompt) {
            setCustomSystemPrompt(params.systemPrompt);
            setUseCustomSystemPrompt(true);
            
            // Если пресеты уже загружены, попробуем сразу найти совпадение
            if (aiPresets.length > 0) {
                 const matchingPreset = aiPresets.find(p => p.prompt.trim() === params.systemPrompt.trim());
                 if (matchingPreset) {
                     setSelectedPreset(matchingPreset);
                 }
            }
        }
        
        // 2. Context Fields
        if (params.productFields) {
            setProductFields(new Set(params.productFields));
        }
        if (params.companyFields) {
            setCompanyFields(new Set(params.companyFields));
            // Ensure company data is loaded
            if (!companyContextData || Object.keys(companyContextData).length === 0) {
                setIsLoadingCompanyContext(true);
                try {
                    const data = await api.getProjectSpecificContext(projectId);
                    setCompanyContextData(data.values);
                } catch (e) {
                    console.error("Failed to restore company context", e);
                } finally {
                    setIsLoadingCompanyContext(false);
                }
            }
        }
        
        // 3. Product Context (Async fetch)
        if (params.productId) {
            setIsLoadingMarketItems(true);
            try {
                // Try to get from list first if available, otherwise fetch single
                let items = marketItems;
                if (items.length === 0) {
                    const data = await api.getMarketData(projectId);
                    items = data.items;
                    setMarketItems(items);
                }
                
                // Match by ID. Backend stores as `-ownerId_itemId` or string, but frontend usually deals with int ID in MarketItem.
                // We need to match somewhat loosely or precisely depending on storage.
                // Assuming backend stored what frontend sent: `String(selectedProduct.id)`
                
                const targetIdStr = String(params.productId);
                // Try exact string match first
                let found = items.find(i => String(i.id) === targetIdStr);
                
                // If not found, try matching ending (e.g. stored `123` matches item.id `123`)
                if (!found) {
                     const cleanId = targetIdStr.includes('_') ? targetIdStr.split('_')[1] : targetIdStr;
                     found = items.find(i => String(i.id) === cleanId);
                }
                
                if (found) {
                    setSelectedProduct(found);
                }
            } catch (e) {
                console.error("Failed to restore product context", e);
            } finally {
                setIsLoadingMarketItems(false);
            }
        }
        
        // Open panel to show restored state
        setIsContextPanelOpen(true);
    };

    return {
        state: {
            height,
            chatHistory,
            userPrompt,
            isGenerating,
            highlightedTurnId,
            replyToTurn,
            useCustomSystemPrompt,
            customSystemPrompt,
            defaultSystemPrompt,
            isLoadingDefaultPrompt,
            aiPresets,
            isLoadingPresets,
            selectedPreset,
            showUpdateConfirm,
            isCreatingPreset,
            newPresetName,
            canSave,
            isContextPanelOpen,
            marketItems,
            isLoadingMarketItems,
            selectedProduct,
            productFields,
            companyContextData,
            isLoadingCompanyContext,
            companyFields,
            selectedTurnId 
        },
        actions: {
            setHeight,
            setUserPrompt,
            setReplyToTurn,
            setUseCustomSystemPrompt,
            setCustomSystemPrompt,
            handleGenerateText,
            handleQuickAction,
            handleRegenerate,
            handleSelectPreset,
            handleSavePreset,
            handleInitiateSaveAsNew,
            handleCreatePreset,
            handleCancelCreatePreset,
            handleUpdatePreset,
            setShowUpdateConfirm,
            setNewPresetName,
            handleClearHistory,
            handleAddToPost,
            handleResizeStart: handleMouseDown,
            handleJumpToTurn,
            getRepliedTurnText,
            handleSystemPromptToggle,
            toggleContextPanel,
            selectProduct: setSelectedProduct,
            toggleProductField,
            toggleCompanyField,
            setAllCompanyFields,
            toggleTurnSelection,
            restoreContext,
            setSelectedPreset // Expose this setter for external resets
        },
        refs: {
            chatContainerRef,
            turnRefs
        }
    };
};
