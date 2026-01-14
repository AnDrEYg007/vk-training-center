
import React from 'react';
import { MarketAlbum } from '../../../../../shared/types';
import { GroupedCategory } from '../../../hooks/useProductCategories';
import { CategorySelector } from '../../CategorySelector';
import { AlbumSelector } from '../../AlbumSelector';

interface SelectorsSectionProps {
    selectedCategory: any | null;
    setSelectedCategory: (category: any) => void;
    selectedAlbum: MarketAlbum | null;
    setSelectedAlbum: (album: MarketAlbum | null) => void;
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    albums: MarketAlbum[];
    categoryError?: boolean;
}

export const SelectorsSection: React.FC<SelectorsSectionProps> = ({
    selectedCategory,
    setSelectedCategory,
    selectedAlbum,
    setSelectedAlbum,
    groupedCategories,
    areCategoriesLoading,
    loadCategories,
    albums,
    categoryError
}) => {
    return (
        <div className="flex-grow space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория <span className="text-red-500">*</span></label>
                <div className={`h-10 rounded-md ${categoryError ? 'ring-1 ring-red-500' : ''}`}>
                    <CategorySelector 
                        value={selectedCategory ? {id: selectedCategory.id, name: selectedCategory.name, section: {id: selectedCategory.section_id, name: selectedCategory.section_name}} : null}
                        options={groupedCategories} 
                        onChange={setSelectedCategory} 
                        onOpen={loadCategories} 
                        isLoading={areCategoriesLoading} 
                        className="h-full"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Подборка</label>
                <div className="h-10">
                    <AlbumSelector 
                        value={selectedAlbum} 
                        options={albums} 
                        onChange={setSelectedAlbum} 
                        onOpen={() => {}} 
                        isLoading={false} 
                        className="h-full"
                    />
                </div>
            </div>
        </div>
    );
};