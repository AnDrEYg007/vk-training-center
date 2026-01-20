
import React from 'react';
import { GeneralContest } from '../types';
import { ConditionsBuilder } from './ConditionsBuilder';
import { PostMediaSection } from '../../../posts/components/modals/PostMediaSection';
import { RichTemplateEditor } from '../../reviews-contest/components/settings/controls/RichTemplateEditor'; // Переиспользуем
import { CustomDatePicker, CustomTimePicker } from '../../../posts/components/modals/PostDateTimePicker';
import { Project } from '../../../../shared/types';

interface SettingsTabProps {
    contest: GeneralContest;
    onChange: (field: keyof GeneralContest, value: any) => void;
    project: Project;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ contest, onChange, project }) => {
    
    return (
        <div className="space-y-8 p-6">
            {/* Секция 1: Основное */}
            <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Основные параметры</h3>
                <div className="flex items-center justify-between border border-gray-200 p-3 rounded-lg bg-gray-50">
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Активность механики</label>
                        <p className="text-xs text-gray-500 mt-1">Включите, чтобы запустить сбор, обработку участников и публикацию постов.</p>
                    </div>
                    <button
                        onClick={() => onChange('is_active', !contest.is_active)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${contest.is_active ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${contest.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-800 mb-1">Название конкурса (внутреннее)</label>
                    <input 
                        type="text" 
                        value={contest.title} 
                        onChange={e => onChange('title', e.target.value)}
                        className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Например: Ежемесячный розыгрыш пиццы"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-800 mb-1">Описание конкурса (опционально)</label>
                    <textarea
                        value={contest.description || ''}
                        onChange={e => onChange('description', e.target.value)}
                        className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[70px] resize-vertical"
                        placeholder="Краткое описание механики или приза"
                    />
                </div>
            </div>

            {/* Секция 2: Конкурсный пост */}
            <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Конкурсный пост (старт)</h3>
                
                {/* Тумблер выбора сценария */}
                <div className="flex bg-gray-100 p-1 rounded-lg gap-1 mb-4">
                    <button
                        type="button"
                        onClick={() => onChange('start_type', 'new_post')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            contest.start_type === 'new_post' || !contest.start_type
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Создать новый пост
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange('start_type', 'existing_post')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            contest.start_type === 'existing_post'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Выбрать существующий
                    </button>
                </div>

                {contest.start_type === 'existing_post' ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Режим существующего поста</p>
                                <p>Механика привяжется к уже опубликованному посту. Сбор участников начнется сразу после сохранения и активации.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Ссылка на пост ВКонтакте</label>
                            <input 
                                type="text"
                                value={contest.existing_post_link || ''}
                                onChange={e => onChange('existing_post_link', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="https://vk.com/wall-xxxxxx_yyyyyy"
                            />
                            <p className="text-xs text-gray-500 mt-1">Скопируйте ссылку на пост из браузера или мобильного приложения.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex gap-4 items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <span className="text-sm font-medium text-indigo-900">Публикация:</span>
                            <CustomDatePicker value={contest.start_date || ''} onChange={(v) => onChange('start_date', v)} />
                            <CustomTimePicker value={contest.start_time || (contest.start_date && contest.start_date.includes('T') ? contest.start_date.split('T')[1].substring(0, 5) : '12:00')} onChange={(v) => {
                                // Update start_time directly
                                onChange('start_time', v);
                                // Ensure start_date is date-only so API combiner uses the new time
                                if (contest.start_date && contest.start_date.includes('T')) {
                                    onChange('start_date', contest.start_date.split('T')[0]);
                                }
                            }} className="w-24" />
                        </div>

                        <RichTemplateEditor 
                            label="Текст поста" 
                            value={contest.post_text || ''}
                            onChange={(val) => onChange('post_text', val)}
                            project={project}
                            rows={6}
                        />
                        
                        <PostMediaSection 
                            mode="edit"
                            projectId={project.id}
                            editedImages={contest.post_media ? JSON.parse(typeof contest.post_media === 'string' ? contest.post_media : '[]') : []}
                            onImagesChange={(imgs) => onChange('post_media', JSON.stringify(typeof imgs === 'function' ? imgs([]) : imgs))}
                            onUploadStateChange={() => {}}
                            postAttachments={[]}
                            editedAttachments={[]}
                            onAttachmentsChange={() => {}}
                            collapsible={true}
                        />
                    </div>
                )}
            </div>

            {/* Секция 3: Условия */}
            <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Условия участия</h3>
                <ConditionsBuilder 
                    groups={contest.conditions_schema} 
                    onChange={(groups) => onChange('conditions_schema', groups)} 
                />
            </div>

            {/* Секция 4: Итоги */}
            <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Подведение итогов</h3>
                
                <div className="grid grid-cols-1 gap-4 items-start">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Когда?</label>
                            <div className="flex bg-gray-200 p-1 rounded-lg gap-1 w-full">
                                {[
                                    { id: 'duration', label: 'Через время' },
                                    { id: 'date', label: 'В точную дату' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => onChange('finish_type', opt.id)}
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 ${
                                            contest.finish_type === opt.id
                                                ? 'bg-white text-indigo-600 shadow-sm border border-indigo-200'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        type="button"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {contest.finish_type === 'duration' ? (
                            <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[120px]">
                                <div className="flex flex-wrap gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Через</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                min={0}
                                                value={contest.finish_duration_days ?? 0}
                                                onChange={e => onChange('finish_duration_days', Math.max(0, Number(e.target.value)))}
                                                className="w-20 border rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <span className="text-sm text-gray-600">дней</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">+ Часы</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                min={0}
                                                value={contest.finish_duration_hours ?? 0}
                                                onChange={e => onChange('finish_duration_hours', Math.max(0, Number(e.target.value)))}
                                                className="w-20 border rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <span className="text-sm text-gray-600">часов</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Пример: 7 дней и 0 часов → итоги через 7 дней после старта.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[120px]">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <CustomDatePicker value={contest.finish_date || ''} onChange={v => onChange('finish_date', v)} />
                                    <CustomTimePicker value={contest.finish_time || '12:00'} onChange={v => onChange('finish_time', v)} className="w-28" />
                                </div>
                            </div>
                        )}

                        {/* Включаем блок "Победители" внутрь секции "Когда?" */}
                        <div className="mt-3 w-full bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Победители</div>
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-700">Кол-во</label>
                                <input 
                                    type="number" 
                                    min={1}
                                    value={contest.winners_count}
                                    onChange={e => onChange('winners_count', Math.max(1, Number(e.target.value)))}
                                    className="w-24 border rounded p-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={contest.unique_winner} 
                                    onChange={e => onChange('unique_winner', e.target.checked)}
                                    className="rounded text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                />
                                <span className="text-sm text-gray-600">1 приз в 1 руки</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={contest.is_cyclic} 
                            onChange={e => onChange('is_cyclic', e.target.checked)}
                            className="rounded text-indigo-600 w-4 h-4 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                        />
                        <span className="text-sm font-medium text-gray-800">Перезапускать автоматически</span>
                    </label>
                    {contest.is_cyclic && (
                         <div className="mt-2 ml-6 flex items-center gap-2">
                            <span className="text-sm text-gray-600">Через</span>
                            <input 
                                type="number" 
                                value={contest.restart_delay_hours || 24} 
                                onChange={e => onChange('restart_delay_hours', Number(e.target.value))}
                                className="w-16 border rounded p-1 text-sm text-center outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <span className="text-sm text-gray-600">часов после итогов</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Секция 5: Шаблоны итогов */}
             <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Шаблоны сообщений</h3>
                <RichTemplateEditor 
                   label="Сообщение победителю (ЛС)" 
                   value={contest.template_dm}
                   onChange={(val) => onChange('template_dm', val)}
                   project={project}
                   rows={3}
                   specificVariables={[
                       { name: 'Промокод', value: '{promo_code}', description: 'Выигрышный код' },
                       { name: 'Приз', value: '{description}', description: 'Описание приза' }
                   ]}
                />
                <RichTemplateEditor 
                    label="Комментарий-фуллбэк (если ЛС закрыто)" 
                    value={contest.template_comment_fallback}
                    onChange={(val) => onChange('template_comment_fallback', val)}
                    project={project}
                    rows={3}
                    specificVariables={[
                        { name: 'Имя победителя', value: '{user_name}', description: 'Имя пользователя из VK' }
                    ]}
                />
             </div>

            {/* Секция 6: Пост итогов */}
            <div className="space-y-6 pb-6 last:pb-0">
                <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">Пост итогов</h3>
                <RichTemplateEditor 
                    label="Текст поста итогов" 
                    value={contest.template_result_post}
                    onChange={(val) => onChange('template_result_post', val)}
                    project={project}
                    rows={6}
                    specificVariables={[{ name: 'Победители', value: '{winners_list}', description: 'Список победителей' }]}
                />
                
                <PostMediaSection 
                    mode="edit"
                    projectId={project.id}
                    editedImages={contest.result_post_images || []}
                    onImagesChange={(imgs) => onChange('result_post_images', typeof imgs === 'function' ? imgs(contest.result_post_images || []) : imgs)}
                    onUploadStateChange={() => {}}
                    postAttachments={[]}
                    editedAttachments={[]}
                    onAttachmentsChange={() => {}}
                    collapsible={true}
                />
            </div>
        </div>
    );
};
