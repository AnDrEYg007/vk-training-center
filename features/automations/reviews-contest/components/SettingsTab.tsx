
import React from 'react';
import { ContestSettings, PromoCode } from '../types';
import { MainSettings } from './settings/MainSettings';
import { FinishConditions } from './settings/FinishConditions';
import { TemplatesSection } from './settings/TemplatesSection';
import { ContestPreview } from './preview/ContestPreview';
import { Project, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../../shared/types';

interface SettingsTabProps {
    settings: ContestSettings;
    onChange: (field: keyof ContestSettings, value: any) => void;
    project: Project;
    previewPromo: PromoCode | null;
    globalVarDefs: GlobalVariableDefinition[];
    projectGlobalVarValues: ProjectGlobalVariableValue[];
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
    settings, onChange, project, previewPromo,
    globalVarDefs, projectGlobalVarValues
}) => {
    return (
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden h-full">
            {/* ЛЕВАЯ КОЛОНКА: Настройки */}
            <div className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar p-6 border-r border-gray-200 bg-white">
                 <div className="max-w-2xl mx-auto space-y-8">
                    <MainSettings settings={settings} onChange={onChange} />
                    <FinishConditions settings={settings} onChange={onChange} />
                    <TemplatesSection settings={settings} onChange={onChange} project={project} />
                 </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА: Превью */}
            <ContestPreview 
                settings={settings} 
                project={project} 
                previewPromo={previewPromo}
                globalVarDefs={globalVarDefs}
                projectGlobalVarValues={projectGlobalVarValues}
            />
        </div>
    );
};
