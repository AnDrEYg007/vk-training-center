import React, { useState, useMemo, useEffect } from 'react';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { MarketAlbum } from '../../../../shared/types';
import { AlbumSelector } from '../AlbumSelector';

interface BulkAlbumEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItemsCount: number;
    albums: MarketAlbum[];
    onConfirm: (albumId: number | null) => void;
}

export const BulkAlbumEditModal: React.FC<BulkAlbumEditModalProps> = ({
    isOpen,
    onClose,
    selectedItemsCount,
    albums,
    onConfirm,
}) => {
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | 'none' | null>(null);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Сбрасываем состояние при каждом открытии
    useEffect(() => {
        if (isOpen) {
            setSelectedAlbumId(null);
        }
    }, [isOpen]);

    const isDirty = useMemo(() => selectedAlbumId !== null, [selectedAlbumId]);
    const isApplyDisabled = !isDirty;

    const handleOverlayClick = () => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (selectedAlbumId === 'none') {
            onConfirm(null);
        } else if (typeof selectedAlbumId === 'number') {
            onConfirm(selectedAlbumId);
        }
    };

    if (!isOpen) {
        return null;
    }

    const selectedAlbum = selectedAlbumId && selectedAlbumId !== 'none'
        ? albums.find(a => a.id === selectedAlbumId) || null
        : null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Массовое изменение подборки</h2>
                        <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>{selectedItemsCount}</strong> выбранным товарам.</p>
                    </header>
                    
                    <main className="p-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Новая подборка</label>
                            <AlbumSelector
                                value={selectedAlbum}
                                options={albums}
                                onChange={(album) => {
                                    setSelectedAlbumId(album ? album.id : 'none');
                                }}
                                onOpen={() => {}}
                                isLoading={false}
                            />
                        </div>
                    </main>

                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isApplyDisabled}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            Применить
                        </button>
                    </footer>
                </div>
            </div>
            {showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть без сохранения?"
                    message="Вы уверены, что хотите закрыть это окно? Все внесенные данные будут потеряны."
                    onConfirm={() => {
                        setShowCloseConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setShowCloseConfirm(false)}
                    confirmText="Да, закрыть"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[60]"
                />
            )}
        </>
    );
};