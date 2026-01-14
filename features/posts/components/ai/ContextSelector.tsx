import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MarketItem } from '../../../../shared/types';
import { ContextField } from '../../hooks/useAIGenerator';

interface ContextSelectorProps {
    isOpen: boolean;
    onToggle: () => void;
    // Product specific
    selectedProduct: MarketItem | null;
    onSelectProduct: (product: MarketItem | null) => void;
    marketItems: MarketItem[];
    isLoadingItems: boolean;
    productFields: Set<ContextField>;
    onToggleProductField: (field: ContextField) => void;
    // Company specific
    companyContextData: Record<string, string>;
    isLoadingCompanyContext: boolean;
    companyFields: Set<ContextField>;
    onToggleCompanyField: (field: ContextField) => void;
    onSetAllCompanyFields: (enable: boolean) => void;
    // Common
    disabled?: boolean;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
    isOpen,
    onToggle,
    selectedProduct,
    onSelectProduct,
    marketItems,
    isLoadingItems,
    productFields,
    onToggleProductField,
    companyContextData,
    isLoadingCompanyContext,
    companyFields,
    onToggleCompanyField,
    onSetAllCompanyFields,
    disabled
}) => {
    const [activeTab, setActiveTab] = useState<'product' | 'company'>('product');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Refs and state for Portal positioning
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const filteredItems = useMemo(() => {
        if (!searchQuery) return marketItems.slice(0, 50); 
        const lowerQuery = searchQuery.toLowerCase();
        return marketItems.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) || 
            item.sku?.toLowerCase().includes(lowerQuery)
        ).slice(0, 20); 
    }, [marketItems, searchQuery]);

    const handleSelect = (item: MarketItem) => {
        onSelectProduct(item);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const formatPrice = (price: string) => {
        return (Number(price) / 100).toFixed(0) + ' ₽';
    };

    const updatePosition = useCallback(() => {
        if (inputWrapperRef.current) {
            const rect = inputWrapperRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4, // отступ 4px
                left: rect.left,
                width: rect.width
            });
        }
    }, []);

    // Обновляем позицию при открытии и скролле
    useEffect(() => {
        if (isDropdownOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isDropdownOpen, updatePosition]);
    
    // Закрытие дропдауна при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isDropdownOpen &&
                inputWrapperRef.current && !inputWrapperRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const renderProductSection = () => (
        <div className="space-y-2">
            {selectedProduct ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-indigo-50 border border-indigo-200 rounded-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                <img src={selectedProduct.thumb_photo} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate" title={selectedProduct.title}>{selectedProduct.title}</p>
                                <p className="text-xs text-gray-500">{formatPrice(selectedProduct.price.amount)}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onSelectProduct(null)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                            title="Удалить контекст"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    {/* Field Selection Checkboxes */}
                    <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Передать в нейросеть:</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={productFields.has('title')} onChange={() => onToggleProductField('title')} className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/>
                                <span className="text-xs text-gray-700">Название</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={productFields.has('description')} onChange={() => onToggleProductField('description')} className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/>
                                <span className="text-xs text-gray-700">Описание</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={productFields.has('price')} onChange={() => onToggleProductField('price')} className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/>
                                <span className="text-xs text-gray-700">Цена</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={productFields.has('old_price')} onChange={() => onToggleProductField('old_price')} className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/>
                                <span className="text-xs text-gray-700">Старая цена</span>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative" ref={inputWrapperRef}>
                    <input
                        type="text"
                        placeholder={isLoadingItems ? "Загрузка товаров..." : "Поиск товара (название, артикул)..."}
                        value={searchQuery}
                        onChange={(e) => { 
                            setSearchQuery(e.target.value); 
                            if (!isDropdownOpen) {
                                setIsDropdownOpen(true);
                                setTimeout(updatePosition, 0);
                            }
                        }}
                        onFocus={() => { 
                            setIsDropdownOpen(true);
                            setTimeout(updatePosition, 0);
                        }}
                        disabled={isLoadingItems}
                        className="w-full border rounded px-3 py-2 text-xs border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {isDropdownOpen && createPortal(
                        <div
                            ref={dropdownRef}
                            className="fixed z-[100] bg-white border border-gray-200 rounded-md shadow-xl max-h-48 overflow-y-auto custom-scrollbar ring-1 ring-black ring-opacity-5"
                            style={{
                                top: `${position.top}px`,
                                left: `${position.left}px`,
                                width: `${position.width}px`
                            }}
                        >
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 flex items-center gap-2 border-b border-gray-100 last:border-0 transition-colors bg-white"
                                    >
                                        <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            <img src={item.thumb_photo} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-grow">
                                            <p className="font-medium text-gray-800 truncate">{item.title}</p>
                                            <p className="text-gray-500">{formatPrice(item.price.amount)} {item.sku ? `• Арт: ${item.sku}` : ''}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-xs text-gray-500 text-center bg-white">
                                    {isLoadingItems ? 'Загрузка...' : 'Ничего не найдено'}
                                </div>
                            )}
                        </div>,
                        document.body
                    )}
                </div>
            )}
        </div>
    );

    const renderCompanySection = () => {
        const allKeys = Object.keys(companyContextData);
        const areAllSelected = allKeys.length > 0 && allKeys.every(k => companyFields.has(k));
        const hasAny = allKeys.length > 0;

        return (
            <div className="space-y-2">
                {hasAny && (
                    <div className="flex justify-end px-1">
                        <button
                            type="button"
                            onClick={() => onSetAllCompanyFields(!areAllSelected)}
                            className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            {areAllSelected ? 'Снять выбор' : 'Выбрать все'}
                        </button>
                    </div>
                )}
                <div className="bg-gray-50 p-2 rounded-md border border-gray-200 max-h-60 overflow-y-auto custom-scrollbar">
                    {isLoadingCompanyContext ? (
                        <div className="flex justify-center py-2"><div className="loader h-4 w-4 border-gray-400 border-t-indigo-500"></div></div>
                    ) : Object.keys(companyContextData).length === 0 ? (
                        <div className="text-center py-2 text-xs text-gray-500">
                            <p>Контекст не настроен.</p>
                            <p className="mt-1">
                                Перейдите в "Управление базой проектов" &rarr; "Контекст проекта", чтобы добавить данные.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {Object.entries(companyContextData).map(([name, value]) => {
                                const isChecked = companyFields.has(name);
                                return (
                                    <div 
                                        key={name}
                                        onClick={() => onToggleCompanyField(name)} 
                                        className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs transition-all ${
                                            isChecked
                                            ? 'bg-indigo-50 border-indigo-200'
                                            : 'bg-white border-gray-200 hover:border-indigo-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked} 
                                                readOnly 
                                                className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-0 cursor-pointer"
                                            />
                                            <span className={`font-medium truncate ${isChecked ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                {name}
                                            </span>
                                        </div>
                                        <span className="text-gray-500 truncate ml-4 max-w-[50%]" title={value}>
                                            {value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const summaryText = useMemo(() => {
        const parts = [];
        if (selectedProduct) parts.push(`Товар`);
        if (companyFields.size > 0) parts.push(`Компания (${companyFields.size})`);
        return parts.join(' + ');
    }, [selectedProduct, companyFields.size]);


    return (
        <div className="w-full">
            {/* Header / Toggle */}
            <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center space-x-3">
                    <button 
                        onClick={onToggle}
                        disabled={disabled}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOpen ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOpen ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                    <span 
                        className="text-xs font-medium text-gray-700 cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={!disabled ? onToggle : undefined}
                    >
                        Добавить контекст
                    </span>
                </div>
                
                {!isOpen && summaryText && (
                     <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-[150px] border border-indigo-200">
                        {summaryText}
                    </span>
                )}
            </div>

            {/* Body */}
            {isOpen && (
                <div className="animate-fade-in-up space-y-3">
                    {/* Separate Buttons for Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('product')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-2 ${
                                activeTab === 'product' 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200' 
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Товар 
                            {selectedProduct && <span className="ml-1 text-[9px] px-1.5 py-px rounded-full bg-indigo-200 text-indigo-800">1</span>}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('company')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-2 ${
                                activeTab === 'company' 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200' 
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Контекст компании 
                            {companyFields.size > 0 && <span className="ml-1 text-[9px] px-1.5 py-px rounded-full bg-indigo-200 text-indigo-800">{companyFields.size}</span>}
                        </button>
                    </div>

                    <div className="mt-2">
                        {activeTab === 'product' && renderProductSection()}
                        {activeTab === 'company' && renderCompanySection()}
                    </div>
                </div>
            )}
        </div>
    );
};
