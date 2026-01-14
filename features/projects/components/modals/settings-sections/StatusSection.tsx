import React from 'react';
import { Project } from '../../../../../shared/types';

interface StatusSectionProps {
    formData: Project;
    handleSetFormData: (value: React.SetStateAction<Project>) => void;
    isSaving: boolean;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ formData, handleSetFormData, isSaving }) => {
    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div>
                <h3 className="text-base font-medium text-gray-800">Статус проекта</h3>
                <p className="text-sm text-gray-500">Отключенные проекты перемещаются в конец списка.</p>
            </div>
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={() => handleSetFormData(prev => ({ ...prev, disabled: !prev.disabled }))}
                    disabled={isSaving}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-70 ${!formData.disabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${!formData.disabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-900 w-20">{!formData.disabled ? 'Активен' : 'Отключен'}</span>
            </div>
        </div>
    );
};
