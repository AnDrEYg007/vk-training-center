
import React, { useMemo } from 'react';
import { ContestSettings, PromoCode } from '../../types';
import { VK_COLORS, VkPost, VkComment, VkMessage } from './VkUiKit';
import { Project, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../../../shared/types';

interface ContestPreviewProps {
    settings: ContestSettings;
    project: Project;
    previewPromo: PromoCode | null;
    globalVarDefs: GlobalVariableDefinition[];
    projectGlobalVarValues: ProjectGlobalVariableValue[];
}

// Стоковое фото для пользователя (заглушка)
const USER_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export const ContestPreview: React.FC<ContestPreviewProps> = ({ 
    settings, project, previewPromo,
    globalVarDefs, projectGlobalVarValues
}) => {
    
    // Используем реальный промокод, если есть, или моки
    const promoCode = previewPromo?.code || 'WIN_X7Z';
    const description = previewPromo?.description || 'Сет роллов "Филадельфия"';
    const user = "Мария";
    
    // Получаем аватарку проекта. Если в базе она есть, она будет использована.
    // Если нет (старый проект), VkAvatar покажет первую букву.
    const projectAvatar = project.avatar_url;

    // Хелпер для подстановки глобальных переменных
    const substituteGlobals = useMemo(() => {
        const definitionsMap = new Map<string, string>(globalVarDefs.map(def => [def.placeholder_key, def.id]));
        const valuesMap = new Map<string, string>(projectGlobalVarValues.map(val => [val.definition_id, val.value]));

        return (text: string) => {
             return text.replace(/\{global_(\w+)\}/g, (match: string, key: string): string => {
                const defId = definitionsMap.get(key);
                if (defId) {
                     const val = valuesMap.get(defId);
                     if (val !== undefined) return val;
                }
                return ''; // Если значения нет, заменяем на пустоту, как на бэкенде
            });
        };
    }, [globalVarDefs, projectGlobalVarValues]);

    // Подготовка текста сообщения (с подстановкой переменных)
    const dmTextRaw = settings.templateDm
        .replace('{promo_code}', promoCode)
        .replace('{description}', description)
        .replace('{user_name}', user);
    const dmText = substituteGlobals(dmTextRaw);

    const commentTextRaw = settings.templateComment.replace('{number}', '42');
    const commentText = substituteGlobals(commentTextRaw);

    const errorCommentTextRaw = settings.templateErrorComment.replace('{user_name}', user);
    const errorCommentText = substituteGlobals(errorCommentTextRaw);

    const winnerPostTextRaw = settings.templateWinnerPost.replace('{winners_list}', `1. Мария Смирнова (№42)`);
    const winnerPostText = substituteGlobals(winnerPostTextRaw);

    return (
        <div 
            className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar p-6 border-l border-gray-200 bg-gray-100 flex flex-col" 
            style={{ backgroundColor: VK_COLORS.bg, minHeight: '100%' }}
        >
            <div className="max-w-[550px] w-full mx-auto space-y-8 mt-4 flex-grow">
                
                {/* 1. Сценарий: Участник пишет пост + Ответ системы */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">1. Пост участника и ваш ответ</div>
                    <VkPost
                        authorName="Мария Смирнова"
                        authorAvatar={USER_AVATAR}
                        date="сегодня в 14:30"
                        highlightWord={settings.keywords}
                        text={`Вчера заказали пиццу, очень понравилось! Тесто тонкое, начинки много.\n\n${settings.keywords}`}
                        likes={12}
                        comments={4}
                        reposts={1}
                        views={1.2}
                        blurredExtras={true} // Размываем лайки и автора, акцент на комментарии
                    >
                        <VkComment 
                            isGroup 
                            authorName={project.name} 
                            authorAvatar={projectAvatar} 
                            text={commentText}
                            date="сегодня в 14:35"
                            replyToName="Мария"
                        />
                    </VkPost>
                </div>

                {/* 2. Сценарий: Пост итогов */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">2. Объявление итогов</div>
                    <VkPost 
                        isGroup
                        authorName={project.name}
                        authorAvatar={projectAvatar} 
                        date="только что"
                        highlightWord=""
                        text={winnerPostText}
                        likes={45}
                        comments={12}
                        reposts={5}
                        views={3.5}
                        images={settings.winnerPostImages}
                        blurredExtras={true} // Размываем лайки, акцент на контенте
                    />
                </div>

                {/* 3. Сценарий: Вручение приза */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">3. Вручение приза</div>
                     <div className="space-y-4">
                        <div className="flex justify-end text-xs text-gray-400 mb-1 italic">
                            Пример с кодом: {promoCode}
                        </div>
                        <VkMessage 
                            authorName={project.name}
                            text={dmText}
                            date="14:40"
                            authorAvatar={projectAvatar} 
                            blurredExtras={true}
                        />
                        
                        <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-300/50 relative">
                            <span className="px-2 relative -top-4 bg-[#edeef0]">Если ЛС закрыто (Fallback):</span>
                        </div>
                        
                        {/* Повторяем пост из шага 1, но заблюренный + Комментарий ошибки */}
                        <VkPost
                            authorName="Мария Смирнова"
                            authorAvatar={USER_AVATAR}
                            date="сегодня в 14:30"
                            highlightWord={settings.keywords}
                            text={`Вчера заказали пиццу, очень понравилось! Тесто тонкое, начинки много.\n\n${settings.keywords}`}
                            likes={12} comments={5} reposts={1} views={1.2}
                            blurredExtras={true} // Размываем пост участника
                        >
                             <VkComment 
                                isGroup
                                authorName={project.name}
                                authorAvatar={projectAvatar} 
                                // Используем шаблон ОШИБКИ, но без блюра
                                text={errorCommentText}
                                date="только что"
                                replyToName="Мария"
                                blurredExtras={false} // Комментарий ошибки четкий
                            />
                        </VkPost>
                    </div>
                </div>
            </div>
        </div>
    );
};
