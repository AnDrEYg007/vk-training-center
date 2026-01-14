
import React from 'react';
import { ContestSettings } from '../../types';
import { RichTemplateEditor } from './controls/RichTemplateEditor';
import { Project } from '../../../../../shared/types';
import { PostMediaSection } from '../../../../posts/components/modals/PostMediaSection';

interface TemplatesSectionProps {
    settings: ContestSettings;
    onChange: (field: keyof ContestSettings, value: any) => void;
    project: Project;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({ settings, onChange, project }) => {
    
    // Формирование пояснения для условий публикации
    const getFinishConditionText = () => {
        if (settings.finishCondition === 'count') return `автоматически, как только наберется ${settings.targetCount} участников`;
        if (settings.finishCondition === 'date') return `в указанный день недели (${settings.finishDayOfWeek}-й) в ${settings.finishTime}`;
        return `при выполнении условий (День недели + минимум ${settings.targetCount} участников)`;
    };

    return (
        <div className="space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
             <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Шаблоны сообщений</h3>
                <div className="space-y-5">
                    <RichTemplateEditor 
                        label="Шаблон комментария (Регистрация)" 
                        value={settings.templateComment}
                        onChange={(val) => onChange('templateComment', val)}
                        project={project}
                        specificVariables={[{ name: 'Номер', value: '{number}', description: 'Порядковый номер участника' }]}
                        rows={3}
                        helpText={`Это комментарий, который будет автоматически отправлен под публикацией пользователя, содержащей ключевое вхождение «${settings.keywords || '...'}».`}
                    />
                    
                    <RichTemplateEditor 
                        label="Сообщение победителю (ЛС)" 
                        value={settings.templateDm}
                        onChange={(val) => onChange('templateDm', val)}
                        project={project}
                        specificVariables={[
                            { name: 'Промокод', value: '{promo_code}', description: 'Выигрышный промокод' },
                            { name: 'Приз', value: '{description}', description: 'Описание приза из базы промокодов' },
                            { name: 'Имя', value: '{user_name}', description: 'Имя победителя' }
                        ]}
                        rows={5}
                        helpText="Это сообщение будет отправлено пользователю через личные сообщения сообщества от лица группы. Переменная {description} подставит описание, привязанное к выданному промокоду."
                    />
                    
                    <RichTemplateEditor 
                        label="Ошибка отправки (Комментарий)" 
                        value={settings.templateErrorComment}
                        onChange={(val) => onChange('templateErrorComment', val)}
                        project={project}
                        specificVariables={[{ name: 'Имя', value: '{user_name}', description: 'Имя победителя для упоминания' }]}
                        rows={3}
                        helpText="Это комментарий, который будет оставлен под публикацией победителя (под его отзывом), если мы не смогли отправить ему сообщение с призом в ЛС."
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Настройка поста с итогами</h3>
                <div className="space-y-4">
                    <RichTemplateEditor 
                        label="Текст поста" 
                        value={settings.templateWinnerPost}
                        onChange={(val) => onChange('templateWinnerPost', val)}
                        project={project}
                        specificVariables={[{ name: 'Список', value: '{winners_list}', description: 'Список победителей (Имя + Номер)' }]}
                        rows={8}
                        helpText={`Этот пост будет опубликован на стене сообщества ${getFinishConditionText()}.`}
                    />
                    
                    <div className="border border-gray-300 rounded-md bg-white p-3">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Медиавложения</label>
                         <PostMediaSection 
                            mode="edit"
                            projectId={project.id}
                            editedImages={settings.winnerPostImages}
                            onImagesChange={(newImages) => {
                                // PostMediaSection может вернуть callback, нам нужно обработать значение
                                if (typeof newImages === 'function') {
                                    onChange('winnerPostImages', newImages(settings.winnerPostImages));
                                } else {
                                    onChange('winnerPostImages', newImages);
                                }
                            }}
                            onUploadStateChange={() => {}} // TODO: Handle loading state
                            postAttachments={[]}
                            editedAttachments={[]}
                            onAttachmentsChange={() => {}}
                         />
                    </div>
                </div>
            </div>
        </div>
    );
};
