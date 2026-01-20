import React, { useState, useEffect } from 'react';
import { MarketAlbum, MarketItem } from '../../../../shared/types';
import { GroupedCategory } from '../../hooks/useProductCategories';
import { ProjectSettingsModal } from '../../../projects/components/modals/ProjectSettingsModal';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

import { useCreateSingleProduct } from '../../hooks/useCreateSingleProduct';
import { PhotoUploadSection } from './create-single/PhotoUploadSection';
import { SelectorsSection } from './create-single/SelectorsSection';
import { DescriptionSection } from './create-single/DescriptionSection';
import { PricingSection } from './create-single/PricingSection';

interface CreateSingleProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: any) => void;
    albums: MarketAlbum[];
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    projectId: string;
    initialData?: MarketItem | null; // Новый проп
}

export const CreateSingleProductModal: React.FC<CreateSingleProductModalProps> = ({
    isOpen, onClose, onSave, albums, groupedCategories, areCategoriesLoading, loadCategories, projectId, initialData
}) => {
    const [variablesReloadKey, setVariablesReloadKey] = useState(false);
    
    const { formState, uiState, actions } = useCreateSingleProduct({ onClose, onSave, projectId, initialData });
    const { errors } = uiState;

    // Предзагружаем категории, если мы в режиме копирования, чтобы useEffect ниже сработал корректно
    useEffect(() => {
        if (isOpen && initialData) {
            loadCategories();
        }
    }, [isOpen, initialData, loadCategories]);

    // Заполняем сложные поля (категория, альбом) после загрузки данных
    useEffect(() => {
        if (initialData) {
            if (initialData.album_ids && initialData.album_ids.length > 0 && albums.length > 0) {
                const album = albums.find(a => a.id === initialData.album_ids[0]);
                if (album) {
                    formState.setSelectedAlbum(album);
                }
            }
            if (initialData.category && groupedCategories.length > 0) {
                 const allCategories = groupedCategories.flatMap(g => g.categories);
                 const category = allCategories.find(c => c.id === initialData.category.id);
                 if (category) {
                    formState.setSelectedCategory(category);
                 }
            }
        }
    }, [initialData, albums, groupedCategories, formState.setSelectedAlbum, formState.setSelectedCategory]);


    const onProjectSettingsSave = async (updatedProject: any) => {
        await actions.handleSaveProjectSettings(updatedProject);
        setVariablesReloadKey(prev => !prev);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={actions.handleCloseRequest}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Копировать товар' : 'Создать новый товар'}</h2>
                        <button onClick={actions.handleCloseRequest} disabled={uiState.isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50" title="Закрыть">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    <main className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                        
                        <div className="flex items-start gap-4">
                            <PhotoUploadSection 
                                photoPreview={formState.photoPreview}
                                photoUrl={formState.photoUrl}
                                setPhotoUrl={formState.setPhotoUrl}
                                onFileChange={actions.handleFileChange}
                                onUrlBlur={actions.handleUrlBlur}
                                onClearPhoto={actions.handleClearPhoto}
                                fileInputRef={uiState.fileInputRef}
                                hasError={errors.includes('photo')}                                useDefaultImage={formState.useDefaultImage}
                                setUseDefaultImage={formState.setUseDefaultImage}                            />
                            <SelectorsSection 
                                selectedCategory={formState.selectedCategory}
                                setSelectedCategory={formState.setSelectedCategory}
                                selectedAlbum={formState.selectedAlbum}
                                setSelectedAlbum={formState.setSelectedAlbum}
                                groupedCategories={groupedCategories}
                                areCategoriesLoading={areCategoriesLoading}
                                loadCategories={loadCategories}
                                albums={albums}
                                categoryError={errors.includes('category')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Название <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={formState.name} 
                                onChange={e => formState.setName(e.target.value)} 
                                className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    errors.includes('name') 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'focus:ring-indigo-500'
                                }`}
                                placeholder="Например: Пицца Пепперони (минимум 4 символа)" 
                            />
                        </div>

                        <DescriptionSection 
                            description={formState.description}
                            setDescription={formState.setDescription}
                            projectId={projectId}
                            onOpenProjectSettings={() => uiState.setIsProjectSettingsOpen(true)}
                            forceVariablesReload={variablesReloadKey}
                            hasError={errors.includes('description')}
                        />

                        <PricingSection 
                            price={formState.price}
                            setPrice={formState.setPrice}
                            oldPrice={formState.oldPrice}
                            setOldPrice={formState.setOldPrice}
                            sku={formState.sku}
                            setSku={formState.setSku}
                            priceError={errors.includes('price')}
                        />
                        
                    </main>
                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                        <button type="button" onClick={actions.handleCloseRequest} disabled={uiState.isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                        <button 
                            type="button" 
                            onClick={actions.handleSave} 
                            disabled={uiState.isSaving}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 w-24 flex justify-center items-center"
                        >
                            {uiState.isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Создать'}
                        </button>
                    </footer>
                </div>
            </div>
            
            {uiState.isProjectSettingsOpen && uiState.currentProject && (
                <ProjectSettingsModal
                    project={uiState.currentProject}
                    uniqueTeams={uiState.uniqueTeams}
                    onClose={() => uiState.setIsProjectSettingsOpen(false)}
                    onSave={onProjectSettingsSave}
                    initialOpenSection="variables"
                    zIndex="z-[60]"
                />
            )}

            {uiState.showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть без сохранения?"
                    message="Вы уверены, что хотите закрыть это окно? Все введенные данные будут потеряны."
                    onConfirm={actions.confirmClose}
                    onCancel={() => uiState.setShowCloseConfirm(false)}
                    confirmText="Да, закрыть"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[60]"
                />
            )}
        </>
    );
};