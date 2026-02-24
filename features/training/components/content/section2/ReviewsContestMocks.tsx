import React from 'react';

// =====================================================================
// VK COLORS (из реального VkUiKit)
// =====================================================================
export const VK_COLORS = {
    bg: '#edeef0',
    link: '#2a5885',
    text: '#000000',
    textSecondary: '#818c99',
    icon: '#99a2ad',
    iconActive: '#ff3347',
    buttonBg: '#e5ebf1',
    buttonText: '#2a5885',
    verified: '#0077FF',
};

// =====================================================================
// Status Badge (6 вариантов из PostsTab)
// =====================================================================
interface StatusBadgeProps {
    status: 'new' | 'processing' | 'commented' | 'error' | 'winner' | 'used';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        new: 'text-gray-600 bg-gray-100 border-gray-200',
        processing: 'text-blue-600 bg-blue-50 border-blue-100 animate-pulse',
        commented: 'text-green-600 bg-green-50 border-green-100',
        error: 'text-red-600 bg-red-50 border-red-100',
        winner: 'text-amber-700 bg-amber-100 border-amber-200 font-bold',
        used: 'text-gray-400 bg-gray-50 border-gray-200'
    };

    const labels = {
        new: 'Новый',
        processing: 'Обработка',
        commented: 'Зарегистрирован',
        error: 'Ошибка',
        winner: 'Победитель',
        used: 'Использован'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// =====================================================================
// Toggle Switch (из MainSettings)
// =====================================================================
interface ToggleSwitchProps {
    isActive: boolean;
    onChange: (value: boolean) => void;
    label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onChange, label }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button 
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
            onClick={() => onChange(!isActive)}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

// =====================================================================
// Segmented Control (из FinishConditions)
// =====================================================================
interface SegmentedControlProps {
    value: 'count' | 'date' | 'mixed';
    onChange: (value: 'count' | 'date' | 'mixed') => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ value, onChange }) => {
    const options = [
        { value: 'count' as const, label: '🎉 По количеству', emoji: '🎉' },
        { value: 'date' as const, label: '📅 В определенный день', emoji: '📅' },
        { value: 'mixed' as const, label: '⚖️ День + Количество', emoji: '⚖️' }
    ];

    return (
        <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        value === option.value
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

// =====================================================================
// VK Avatar (заглушка)
// =====================================================================
interface VkAvatarProps {
    url?: string;
    text?: string;
    size?: number;
    blurred?: boolean;
}

export const VkAvatar: React.FC<VkAvatarProps> = ({ url, text, size = 40, blurred }) => (
    <div 
        className={`rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-200 ${blurred ? 'blur-[1px]' : ''}`}
        style={{ width: size, height: size }}
    >
        {url ? (
            <img src={url} alt="" className="w-full h-full object-cover" />
        ) : (
            <span className="text-gray-600 font-semibold" style={{ fontSize: size / 2 }}>
                {text?.[0] || '?'}
            </span>
        )}
    </div>
);

// =====================================================================
// VK Post (упрощенная версия)
// =====================================================================
interface VkPostProps {
    authorName: string;
    authorAvatar?: string;
    date: string;
    text: string;
    highlightWord?: string;
    isGroup?: boolean;
    children?: React.ReactNode;
    blurredExtras?: boolean;
}

export const VkPost: React.FC<VkPostProps> = ({ 
    authorName, 
    authorAvatar, 
    date, 
    text, 
    highlightWord, 
    isGroup, 
    children,
    blurredExtras 
}) => {
    const highlightText = (text: string, word?: string) => {
        if (!word) return text;
        const parts = text.split(new RegExp(`(${word})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === word.toLowerCase() 
                ? <span key={i} className="bg-yellow-100 font-semibold">{part}</span>
                : part
        );
    };

    return (
        <div className="bg-white border border-[#e1e3e6] rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 flex items-center gap-3 ${blurredExtras ? 'blur-[1px]' : ''}`}>
                <VkAvatar url={authorAvatar} text={authorName} size={40} />
                <div>
                    <p className="font-semibold text-[#2a5885] text-sm">{authorName}</p>
                    <p className="text-xs text-[#818c99]">{date}</p>
                </div>
            </div>

            {/* Text */}
            <div className="px-4 py-1 text-[15px] leading-6 text-black whitespace-pre-wrap">
                {highlightText(text, highlightWord)}
            </div>

            {/* Actions */}
            <div className={`px-4 py-3 flex items-center gap-4 text-xs text-[#818c99] ${blurredExtras ? 'blur-[1.5px]' : ''}`}>
                <span>❤️ 12</span>
                <span>💬 4</span>
                <span>↗️ 1</span>
                <span>👁 1.2K</span>
            </div>

            {/* Comments */}
            {children && (
                <div className="border-t border-[#e1e3e6] bg-[#fafbfc]">
                    {children}
                </div>
            )}
        </div>
    );
};

// =====================================================================
// VK Comment
// =====================================================================
interface VkCommentProps {
    authorName: string;
    authorAvatar?: string;
    text: string;
    date: string;
    isGroup?: boolean;
    replyToName?: string;
    blurredExtras?: boolean;
}

export const VkComment: React.FC<VkCommentProps> = ({ 
    authorName, 
    authorAvatar, 
    text, 
    date, 
    isGroup, 
    replyToName,
    blurredExtras 
}) => {
    const highlightVariables = (text: string) => {
        const parts = text.split(/(\{\w+\})/g);
        return parts.map((part, i) => 
            part.match(/\{\w+\}/) 
                ? <span key={i} className="bg-indigo-100 text-indigo-800 font-semibold px-1 rounded">{part}</span>
                : part
        );
    };

    return (
        <div className="px-4 py-3 flex gap-3">
            <VkAvatar url={authorAvatar} text={authorName} size={32} blurred={blurredExtras} />
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold text-[#2a5885]">{authorName}</span>
                    {isGroup && <span className="ml-1 text-[#0077FF] text-xs">✓</span>}
                    {replyToName && <span className="text-[#818c99]"> ответил {replyToName}</span>}
                </p>
                <p className="text-sm text-black mt-1">{highlightVariables(text)}</p>
                <div className={`flex items-center gap-3 mt-1 text-xs text-[#818c99] ${blurredExtras ? 'blur-[1px]' : ''}`}>
                    <span>{date}</span>
                    <span className="text-[#2a5885] hover:underline cursor-pointer">Ответить</span>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// VK Message (ЛС сообщения)
// =====================================================================
interface VkMessageProps {
    authorName: string;
    text: string;
    date: string;
    authorAvatar?: string;
    blurredExtras?: boolean;
}

export const VkMessage: React.FC<VkMessageProps> = ({ 
    authorName, 
    text, 
    date, 
    authorAvatar,
    blurredExtras 
}) => {
    const highlightVariables = (text: string) => {
        const parts = text.split(/(\{\w+\})/g);
        return parts.map((part, i) => 
            part.match(/\{\w+\}/) 
                ? <span key={i} className="bg-indigo-100 text-indigo-800 font-semibold px-1 rounded">{part}</span>
                : part
        );
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-[#e1e3e6] shadow-[0_1px_0_0_#dce1e6]">
            <div className={`flex items-center justify-between border-b border-[#e1e3e6] pb-2 mb-2 ${blurredExtras ? 'blur-[1px]' : ''}`}>
                <p className="text-xs font-semibold text-[#818c99]">Сообщения сообщества</p>
                <a href="#" className="text-xs text-[#2a5885] hover:underline">К диалогу →</a>
            </div>
            <div className="bg-[#e5ebf1] rounded-2xl rounded-tl-sm px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                    <VkAvatar url={authorAvatar} text={authorName} size={20} />
                    <span className="font-semibold text-sm text-[#2a5885]">{authorName}</span>
                </div>
                <p className="text-sm text-black whitespace-pre-wrap">{highlightVariables(text)}</p>
                <p className="text-xs text-[#818c99] mt-1">{date}</p>
            </div>
        </div>
    );
};

// =====================================================================
// Rich Template Editor (упрощенная версия)
// =====================================================================
interface RichTemplateEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    helpText?: string;
    specificVariables?: { name: string; value: string }[];
}

export const RichTemplateEditor: React.FC<RichTemplateEditorProps> = ({ 
    label, 
    value, 
    onChange, 
    helpText,
    specificVariables 
}) => {
    const [showVariables, setShowVariables] = React.useState(false);

    return (
        <div className="group">
            <div className="border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
                {/* Header */}
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex gap-1">
                        {specificVariables && specificVariables.map(v => (
                            <button
                                key={v.value}
                                onClick={() => onChange(value + v.value)}
                                className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors border border-indigo-200"
                                title={v.name}
                            >
                                {v.value}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowVariables(!showVariables)}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            title="Глобальные переменные"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent custom-scrollbar rounded-b-md resize-none"
                    rows={3}
                    style={{ fontFamily: 'monospace' }}
                />
            </div>

            {/* Help text */}
            {helpText && (
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}
        </div>
    );
};

// =====================================================================
// Participants Table Mock
// =====================================================================
interface ParticipantMock {
    id: number;
    photo: string;
    author: string;
    text: string;
    status: 'new' | 'processing' | 'commented' | 'error' | 'winner' | 'used';
    date: string;
}

export const ParticipantsTableMock: React.FC<{ data: ParticipantMock[] }> = ({ data }) => (
    <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                    <th className="px-4 py-3 font-medium text-gray-700 w-12">№</th>
                    <th className="px-4 py-3 font-medium text-gray-700 w-16">Фото</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Автор</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Текст поста</th>
                    <th className="px-4 py-3 font-medium text-gray-700 w-32">Статус</th>
                    <th className="px-4 py-3 font-medium text-gray-700 w-32">Дата</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">{item.id}</td>
                        <td className="px-4 py-3">
                            <VkAvatar url={item.photo} text={item.author} size={32} />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.author}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.text}</td>
                        <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{item.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// =====================================================================
// Winners Table Mock
// =====================================================================
interface WinnerMock {
    date: string;
    winner: string;
    prize: string;
    promo: string;
    status: 'sent' | 'error';
}

export const WinnersTableMock: React.FC<{ data: WinnerMock[] }> = ({ data }) => (
    <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
            <thead className="bg-amber-50 border-b border-amber-200">
                <tr>
                    <th className="px-4 py-3 font-medium text-amber-900">Дата розыгрыша</th>
                    <th className="px-4 py-3 font-medium text-amber-900">Победитель</th>
                    <th className="px-4 py-3 font-medium text-amber-900">Приз</th>
                    <th className="px-4 py-3 font-medium text-amber-900">Промокод</th>
                    <th className="px-4 py-3 font-medium text-amber-900">Статус доставки</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {data.map((item, idx) => (
                    <tr key={idx} className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.winner}</td>
                        <td className="px-4 py-3 text-gray-600">{item.prize}</td>
                        <td className="px-4 py-3 font-mono text-sm text-indigo-700 font-semibold">{item.promo}</td>
                        <td className="px-4 py-3">
                            {item.status === 'sent' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Вручено (ЛС)
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Вручено (Коммент)
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// =====================================================================
// Terminal Logs Mock
// =====================================================================
interface LogEntryMock {
    time: string;
    level: 'INFO' | 'SUCCESS' | 'ERROR';
    message: string;
}

export const TerminalLogsMock: React.FC<{ logs: LogEntryMock[] }> = ({ logs }) => {
    const levelColors = {
        INFO: 'text-blue-400',
        SUCCESS: 'text-green-400',
        ERROR: 'text-red-400'
    };

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden font-mono text-sm">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="font-semibold text-gray-400">System Logs</span>
                <button className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Clear</button>
            </div>

            {/* Logs */}
            <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                        <span className="text-gray-500">[{log.time}]</span>
                        <span className={`font-semibold ${levelColors[log.level]}`}>[{log.level}]</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
