import React, { useMemo } from 'react';
import { GeneralContest } from '../types';
import { Project } from '../../../../shared/types';
import { VK_COLORS, VkPost, VkComment, VkMessage } from '../../reviews-contest/components/preview/VkUiKit';

interface GeneralContestPreviewProps {
    contest: GeneralContest;
    project: Project;
}

export const GeneralContestPreview: React.FC<GeneralContestPreviewProps> = ({ contest, project }) => {
    const startImages = useMemo(() => {
        return (contest.start_post_images || []).map(img => ({ url: img.url }));
    }, [contest.start_post_images]);

    const resultImages = useMemo(() => {
        return (contest.result_post_images || []).map(img => ({ url: img.url }));
    }, [contest.result_post_images]);

    const startPostText = contest.start_post_text || 'Текст стартового поста...';
    const resultPostText = (contest.template_result_post || 'Поздравляем победителей!\n\n{winners_list}')
        .replace('{winners_list}', '1. Иван Петров (№42)');

    const dmText = (contest.template_dm || 'Поздравляем! Вы выиграли приз: {description}\nВаш код: {promo_code}')
        .replace('{promo_code}', 'WIN-2025')
        .replace('{description}', 'Подарок недели');

    const fallbackComment = (contest.template_comment_fallback || 'Напишите нам в личные сообщения, {user_name}, чтобы забрать приз!')
        .replace('{user_name}', 'Мария');

    const startDateLabel = contest.start_date ? contest.start_date : 'дата не выбрана';
    const startTimeLabel = contest.start_time || '12:00';

    return (
        <div 
            className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar p-6 border-l border-gray-200" 
            style={{ backgroundColor: VK_COLORS.bg, minHeight: '100%' }}
        >
            <div className="max-w-[550px] w-full mx-auto space-y-8 mt-4 flex-grow">
                
                {/* Стартовый пост */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">1. Старт конкурса</div>
                    <VkPost
                        isGroup
                        authorName={project.name}
                        authorAvatar={project.avatar_url}
                        date={`${startDateLabel} в ${startTimeLabel}`}
                        highlightWord=""
                        text={startPostText}
                        likes={36}
                        comments={12}
                        reposts={4}
                        views={1.8}
                        images={startImages}
                        blurredExtras={true}
                    />
                </div>

                {/* Итоги */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">2. Объявление итогов</div>
                    <VkPost 
                        isGroup
                        authorName={project.name}
                        authorAvatar={project.avatar_url} 
                        date="после завершения"
                        highlightWord=""
                        text={resultPostText}
                        likes={48}
                        comments={15}
                        reposts={6}
                        views={3.1}
                        images={resultImages}
                        blurredExtras={true}
                    />
                </div>

                {/* Вручение приза */}
                <div>
                    <div className="mb-2 text-xs font-bold text-[#818c99] uppercase tracking-wide ml-1">3. Вручение приза</div>
                    <div className="space-y-4">
                        <VkMessage 
                            authorName={project.name}
                            text={dmText}
                            date="14:40"
                            authorAvatar={project.avatar_url} 
                            blurredExtras={true}
                        />
                        
                        <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-300/50 relative">
                            <span className="px-2 relative -top-4 bg-[#edeef0]">Если ЛС закрыто</span>
                        </div>
                        
                        <VkPost
                            authorName="Мария Смирнова"
                            authorAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            date="сегодня в 14:30"
                            highlightWord=""
                            text="Спасибо за конкурс! Жду результаты ❤️"
                            likes={12} comments={5} reposts={1} views={1.2}
                            blurredExtras={true}
                        >
                             <VkComment 
                                isGroup
                                authorName={project.name}
                                authorAvatar={project.avatar_url} 
                                text={fallbackComment}
                                date="только что"
                                replyToName="Мария"
                                blurredExtras={false}
                            />
                        </VkPost>
                    </div>
                </div>
            </div>
        </div>
    );
};
