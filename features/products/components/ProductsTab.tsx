
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Project, MarketItem } from '../../../shared/types';
import { useProductsManager } from '../hooks/useProductsManager';
import { useColumnManager, PRODUCT_COLUMNS } from '../hooks/useColumnManager';
import { useProductCategories } from '../hooks/useProductCategories';
import { ProductsHeader } from './ProductsHeader';
import { AlbumFilters } from './AlbumFilters';
import { ProductsTable } from './ProductsTable';
import { ProductsTableSkeleton } from './ProductsTableSkeleton';
import { ProductsModals } from './ProductsModals';
import { exportProductsToCsv } from '../utils/csvExporter';
import { exportProductsToXlsx } from '../utils/xlsxExporter';
import { parseFileToGrid } from '../utils/fileParser';
import { NewProductRow } from '../types';
import { UploadOptionsModal } from './modals/UploadOptionsModal';
import { UpdateFromFileModal } from './modals/UpdateFromFileModal';
import { FileImportMappingModal } from './modals/FileImportMappingModal';

/**
 * Основной компонент-контейнер для вкладки "Товары".
 */
export const ProductsTab: React.FC<{ 
    project: Project;
    permissionErrorMessage?: string | null;
}> = ({ 
    project, 
    permissionErrorMessage 
}) => {
    
    // Используем основной хук для управления данными и логикой товаров
    const { state, actions } = useProductsManager(project.id);
    
    const {
        items, isLoading, error, filteredItems,
        editedItems, pendingPhotos, selectedItemIds,
        validationErrors, albums, activeAlbumId, isSaving,
        isSelectionMode, searchQuery, aiSuggestionState,
        correctingDescriptionItemId, itemsToDelete,
        isCreatingAlbum, newAlbumTitle, isRefreshingCategories,
        fileGrid, isFileMappingModalOpen
    } = state;

    const hasPendingPhotos = Object.keys(pendingPhotos).length > 0;
    
    // Управление колонками таблицы
    const { state: columnState, actions: columnActions, refs: columnRefs } = useColumnManager(project.id, filteredItems, hasPendingPhotos);
    
    // Загрузка категорий (нужна для селекторов и маппинга файлов)
    const { allCategories, groupedCategories, areCategoriesLoading, loadCategories } = useProductCategories();

    // Локальное UI состояние для загрузки и обновления из файлов
    const [uploadOptions, setUploadOptions] = useState<{ isOpen: boolean; file: File | null }>({ isOpen: false, file: null });
    const [updateFromFileState, setUpdateFromFileState] = useState<{ isOpen: boolean; fileRows: NewProductRow[] | null; fileName: string }>({ isOpen: false, fileRows: null, fileName: '' });
    const [mappingMode, setMappingMode] = useState<'create' | 'update' | null>(null);

    const bulkEditButtonRef = useRef<HTMLButtonElement>(null);
    
    // Вычисляемые свойства
    const isDirty = Object.keys(editedItems).length > 0 || hasPendingPhotos || itemsToDelete.size > 0;
    const selectedItems = useMemo(() => items.filter(item => selectedItemIds.has(item.id)), [items, selectedItemIds]);
    const itemsWithoutAlbumCount = useMemo(() => items.filter(i => !i.album_ids || i.album_ids.length === 0).length, [items]);

    // Обработчики для файлов
    const handleFileUpload = (file: File) => {
        loadCategories();
        setUploadOptions({ isOpen: true, file });
    };

    const handleInitiateMapping = async (mode: 'create' | 'update') => {
        if (!uploadOptions.file) return;
        try {
            const grid = await parseFileToGrid(uploadOptions.file);
            actions.setFileGrid(grid);
            setMappingMode(mode);
            actions.setIsFileMappingModalOpen(true);
            setUploadOptions({ isOpen: false, file: null });
        } catch (err) {
            window.showAppToast?.(err instanceof Error ? err.message : 'Ошибка при обработке файла', 'error');
        }
    };

    const handleImportMappedRows = (rows: NewProductRow[]) => {
        const mode = mappingMode;
        actions.setIsFileMappingModalOpen(false);
        actions.setFileGrid(null);
        setMappingMode(null);

        if (mode === 'create') {
            actions.openCreateMultipleModal(rows);
        } else if (mode === 'update') {
            setUpdateFromFileState({ 
                isOpen: true, 
                fileRows: rows, 
                fileName: uploadOptions.file?.name || 'Файл импорта' 
            });
        }
    };

    // Функция рендеринга основного контента (таблица, скелетон или пустое состояние)
    const renderContent = () => {
        if (isLoading && items.length === 0 && !permissionErrorMessage) {
            return <ProductsTableSkeleton />;
        }

        if (error && !permissionErrorMessage) {
            return <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>;
        }

        if (items.length === 0 && !isLoading && !permissionErrorMessage) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                    <p>Товары не найдены.</p>
                    <p className="text-sm mt-1">Нажмите "Обновить всё", чтобы загрузить данные из VK.</p>
                </div>
            );
        }
        
        return (
            <ProductsTable 
                items={filteredItems}
                albums={albums}
                editedItems={editedItems}
                onItemChange={actions.handleItemChange}
                onSaveItem={actions.handleSaveItem}
                onCopyItem={actions.setItemToCopy}
                onPreviewImage={actions.setPreviewImage}
                isSavingAll={isSaving}
                tableRef={columnRefs.tableRef}
                isInitialized={columnState.isInitialized}
                columnWidths={columnState.columnWidths}
                handleMouseDown={columnActions.handleMouseDown}
                columns={PRODUCT_COLUMNS}
                visibleColumns={columnState.visibleColumns}
                pendingPhotos={pendingPhotos}
                onSelectNewPhoto={actions.handleSelectNewPhoto}
                onPhotoUrlChange={actions.onPhotoUrlChange}
                onClearNewPhoto={actions.onClearNewPhoto}
                isSelectionMode={isSelectionMode}
                selectedItemIds={selectedItemIds}
                onToggleItemSelection={actions.toggleItemSelection}
                onItemDoubleClick={actions.handleItemDoubleClick}
                aiSuggestionState={aiSuggestionState}
                onAiSuggestCategory={actions.handleAiSuggestCategory}
                itemsToDelete={itemsToDelete}
                onToggleItemDeletion={actions.toggleItemDeletion}
                onAiCorrectDescription={actions.handleSingleDescriptionCorrection}
                correctingDescriptionItemId={correctingDescriptionItemId}
                validationErrors={validationErrors}
            />
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            <ProductsHeader
                project={project}
                isLoading={isLoading}
                isDirty={isDirty}
                isSaving={isSaving}
                onRefreshAll={actions.handleRefreshAll}
                onSaveAll={() => actions.handleSaveAll()}
                isVisibilityDropdownOpen={columnState.isVisibilityDropdownOpen}
                toggleVisibilityDropdown={columnActions.toggleVisibilityDropdown}
                visibilityDropdownRef={columnRefs.visibilityDropdownRef}
                columns={PRODUCT_COLUMNS}
                visibleColumns={columnState.visibleColumns}
                onToggleColumnVisibility={columnActions.handleToggleColumnVisibility}
                onShowAllColumns={columnActions.handleShowAllColumns}
                onHideAllColumns={columnActions.handleHideAllColumns}
                isSelectionMode={isSelectionMode}
                selectedCount={selectedItemIds.size}
                onToggleSelectionMode={actions.toggleSelectionMode}
                onClearSelection={actions.clearSelection}
                onInitiateBulkDelete={actions.initiateBulkDelete}
                onBulkEditClick={() => actions.setBulkEditOpen(true)}
                bulkEditButtonRef={bulkEditButtonRef}
                onSelectAllVisible={actions.selectAllVisibleItems}
                searchQuery={searchQuery}
                setSearchQuery={actions.setSearchQuery}
                onOpenCreateSingleModal={() => actions.setIsCreateSingleModalOpen(true)}
                onOpenCreateMultipleModal={() => actions.openCreateMultipleModal(null)}
                onDownloadCsv={() => exportProductsToCsv(filteredItems, albums)}
                onDownloadXlsx={() => exportProductsToXlsx(filteredItems, albums)}
                onFileUpload={handleFileUpload}
                onRefreshCategories={actions.handleRefreshCategories}
                isRefreshingCategories={isRefreshingCategories}
            />

            {(items.length > 0 || isLoading) && (
                <AlbumFilters
                    albums={albums}
                    itemsCount={items.length}
                    itemsWithoutAlbumCount={itemsWithoutAlbumCount}
                    isLoading={isLoading}
                    activeAlbumId={activeAlbumId}
                    onSelectAlbum={actions.setActiveAlbumId}
                    isCreatingAlbum={isCreatingAlbum}
                    setIsCreatingAlbum={actions.setIsCreatingAlbum}
                    newAlbumTitle={newAlbumTitle}
                    setNewAlbumTitle={actions.setNewAlbumTitle}
                    handleCreateAlbum={actions.handleCreateAlbum}
                />
            )}

            <main className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </main>
            
            <ProductsModals 
                state={state} 
                actions={actions} 
                selectedItems={selectedItems} 
                bulkEditButtonRef={bulkEditButtonRef} 
                groupedCategories={groupedCategories} 
                areCategoriesLoading={areCategoriesLoading} 
                loadCategories={loadCategories} 
                projectId={project.id} 
            />

            {uploadOptions.isOpen && uploadOptions.file && (
                <UploadOptionsModal
                    isOpen={true} 
                    onClose={() => setUploadOptions({ isOpen: false, file: null })} 
                    fileName={uploadOptions.file.name}
                    onCreate={() => handleInitiateMapping('create')} 
                    onUpdate={() => handleInitiateMapping('update')}
                />
            )}

            {isFileMappingModalOpen && fileGrid && (
                <FileImportMappingModal
                    gridData={fileGrid}
                    onClose={() => { actions.setIsFileMappingModalOpen(false); actions.setFileGrid(null); setMappingMode(null); }}
                    onImport={handleImportMappedRows}
                    allAlbums={albums}
                    allCategories={allCategories}
                />
            )}

            {updateFromFileState.isOpen && updateFromFileState.fileRows && (
                <UpdateFromFileModal
                    isOpen={true} 
                    onClose={() => setUpdateFromFileState({ isOpen: false, fileRows: null, fileName: '' })} 
                    fileName={updateFromFileState.fileName}
                    fileRows={updateFromFileState.fileRows}
                    allItems={items} 
                    allAlbums={albums} 
                    allCategories={allCategories} 
                    onApplyUpdates={actions.handleBulkUpdateFromFile} 
                    onQueueNewItems={actions.openCreateMultipleModal}
                />
            )}
        </div>
    );
};
