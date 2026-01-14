
import React from 'react';

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

export const Icons = {
    Like: (props: any) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M16 4C18.8 4 21 6.1 21 8.8C21 13.9 14.5 18.2 12.6 19.6C12.4 19.7 12.2 19.8 12 19.8C11.8 19.8 11.6 19.7 11.4 19.6C9.5 18.2 3 13.9 3 8.8C3 6.1 5.2 4 8 4C9.8 4 11.2 5 12 6.3C12.8 5 14.2 4 16 4ZM12 8.3C11.5 6.6 10.1 5.5 8 5.5C6.1 5.5 4.5 7 4.5 8.8C4.5 12.4 9.1 15.9 12 18.1C14.9 15.9 19.5 12.4 19.5 8.8C19.5 7 17.9 5.5 16 5.5C13.9 5.5 12.5 6.6 12 8.3Z" fill="currentColor"/>
        </svg>
    ),
    Comment: (props: any) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
             <path d="M9 16.8L5.7 19.7C5.3 20.1 4.5 19.8 4.5 19.2V16.8C3.1 16.2 2 14.8 2 13C2 10.2 6.5 8 12 8C17.5 8 22 10.2 22 13C22 15.8 17.5 18 12 18C10.9 18 9.9 17.9 9 17.6V16.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Share: (props: any) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
             <path d="M12.9 5.4L20 11.5L12.9 17.6V13.8C6.6 13.8 3.5 18.2 2 21.7C2 13.8 6.4 9.2 12.9 9.2V5.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Eye: (props: any) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
             <path d="M12 4.5C7 4.5 2.7 7.6 1 12C2.7 16.4 7 19.5 12 19.5C17 19.5 21.3 16.4 23 12C21.3 7.6 17 4.5 12 4.5ZM12 17C9.2 17 7 14.8 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17ZM12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9Z" fill="currentColor"/>
        </svg>
    ),
    More: (props: any) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="6" cy="12" r="2" fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <circle cx="18" cy="12" r="2" fill="currentColor"/>
        </svg>
    ),
    Verified: (props: any) => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6C12 2.7 9.3 0 6 0ZM4.5 9L1.5 6L2.6 4.9L4.5 6.9L9.4 2L10.5 3.1L4.5 9Z" fill={VK_COLORS.verified}/>
        </svg>
    )
};

export const VkAvatar: React.FC<{ url?: string, text?: string, size?: number, blurred?: boolean }> = ({ url, text = '', size = 40, blurred }) => (
    <div 
        className={`rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-200 ${blurred ? 'blur-[2px]' : ''}`}
        style={{ width: size, height: size }}
    >
        {url ? (
            <img src={url} alt="" className="w-full h-full object-cover" />
        ) : (
            <span className="text-gray-500 font-bold" style={{ fontSize: size / 2.5 }}>{text.toUpperCase()}</span>
        )}
    </div>
);

export const VkButton: React.FC<{ icon: React.ReactNode, count?: number | string, active?: boolean, blurred?: boolean }> = ({ icon, count, active, blurred }) => (
    <div className={`flex items-center px-3 py-1.5 rounded-full transition-colors cursor-pointer ${active ? 'bg-red-50 text-[#ff3347]' : 'bg-[#f0f2f5] text-[#818c99] hover:bg-[#e5ebf1]'} ${blurred ? 'blur-[2px] opacity-70' : ''}`}>
        <div className="w-5 h-5 flex items-center justify-center">
            {icon}
        </div>
        {count && <span className="ml-1.5 text-[13px] font-medium leading-4">{count}</span>}
    </div>
);

export const VkPost: React.FC<{
    authorName: string;
    authorAvatar?: string;
    date: string;
    text: string;
    highlightWord: string;
    likes: number;
    comments: number;
    reposts: number;
    views: number;
    isGroup?: boolean;
    children?: React.ReactNode;
    images?: { url: string }[];
    blurredExtras?: boolean;
}> = ({ authorName, authorAvatar, date, text, highlightWord, likes, comments, reposts, views, isGroup, children, images, blurredExtras }) => {
    
    const renderText = (content: string) => {
        if (!highlightWord) return content;
        const safeHighlight = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const parts = content.split(new RegExp(`(${safeHighlight})`, 'gi'));
        return parts.map((part, i) => {
            if (part.toLowerCase() === highlightWord.toLowerCase()) {
                return <span key={i} className="bg-yellow-200 text-black px-0.5 rounded">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="bg-white rounded-xl border border-[#e1e3e6] mb-4 overflow-hidden shadow-[0_1px_0_0_#dce1e6]">
            <div className={`p-4 pb-2 flex justify-between items-start ${blurredExtras ? 'blur-[1.5px] opacity-80' : ''}`}>
                <div className="flex gap-3">
                    <VkAvatar text={authorName[0]} url={authorAvatar} />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-[15px] font-medium text-[#2a5885] leading-5">{authorName}</span>
                            {isGroup && <Icons.Verified className="w-3 h-3" />}
                        </div>
                        <span className="text-[13px] text-[#818c99] leading-4">{date}</span>
                    </div>
                </div>
                <button className="text-[#aeb7c2]">
                    <Icons.More />
                </button>
            </div>
            
            <div className="px-4 py-1 text-[15px] leading-6 text-black whitespace-pre-wrap font-sans">
                {renderText(text)}
            </div>

            {images && images.length > 0 && (
                 <div className="mt-2">
                    {images.length === 1 ? (
                         <img src={images[0].url} alt="" className="w-full h-auto object-cover max-h-[300px]" />
                    ) : (
                        <div className="grid grid-cols-2 gap-0.5">
                             {images.slice(0, 4).map((img, i) => (
                                <img key={i} src={img.url} alt="" className="w-full aspect-square object-cover" />
                             ))}
                        </div>
                    )}
                 </div>
            )}

            <div className={`px-4 py-3 flex items-center justify-between ${blurredExtras ? 'blur-[1.5px] opacity-80' : ''}`}>
                <div className="flex items-center gap-3">
                    <VkButton icon={<Icons.Like />} count={likes} />
                    <VkButton icon={<Icons.Comment />} count={comments} />
                    <VkButton icon={<Icons.Share />} count={reposts} />
                </div>
                <div className="flex items-center gap-1 text-[#818c99] text-xs">
                    <Icons.Eye className="w-3.5 h-3.5" />
                    <span>{views}K</span>
                </div>
            </div>
            {children && (
                <div className="border-t border-[#e1e3e6] bg-[#fafbfc]">
                    {children}
                </div>
            )}
        </div>
    );
};

export const VkComment: React.FC<{
    authorName: string;
    authorAvatar?: string;
    text: string;
    date: string;
    isGroup?: boolean;
    replyToName?: string;
    blurredExtras?: boolean;
}> = ({ authorName, authorAvatar, text, date, isGroup, replyToName, blurredExtras }) => {
    
    const renderText = (content: string) => {
        const parts = content.split(/(\{[^}]+\})/g);
        return parts.map((part, i) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                 return <span key={i} className="bg-indigo-100 text-indigo-800 px-1 rounded font-mono text-xs border border-indigo-200">{part}</span>
            }
            return part;
        });
    };

    return (
        <div className="px-4 py-3 flex gap-3">
             <VkAvatar text={authorName[0]} url={authorAvatar} size={32} blurred={blurredExtras} />
             <div className="flex-1">
                 <div className={`flex items-center gap-1 ${blurredExtras ? 'blur-[1px]' : ''}`}>
                    <span className="text-[13px] font-semibold text-[#2a5885]">{authorName}</span>
                    {isGroup && (
                        <div className="bg-[#2a5885] rounded-full p-[2px]">
                             <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 6L4.5 9L10.5 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    )}
                    {replyToName && (
                        <span className="text-[13px] text-[#818c99]">ответил <span className="text-[#2a5885]">{replyToName}</span></span>
                    )}
                 </div>
                 <div className="text-[13px] leading-5 text-black mt-0.5 whitespace-pre-wrap">
                     {renderText(text)}
                 </div>
                 <div className={`flex items-center gap-3 mt-1 ${blurredExtras ? 'blur-[1px] opacity-60' : ''}`}>
                     <span className="text-[12px] text-[#818c99]">{date}</span>
                     <span className="text-[12px] text-[#2a5885] font-medium cursor-pointer hover:underline">Ответить</span>
                     <div className="flex items-center gap-1 cursor-pointer text-[#818c99]">
                        <Icons.Like width="12" height="12" />
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const VkMessage: React.FC<{
    authorName?: string;
    text: string;
    date: string;
    authorAvatar?: string;
    blurredExtras?: boolean;
}> = ({ authorName = "Наше Сообщество", text, date, authorAvatar, blurredExtras }) => {
    const renderText = (content: string) => {
         const parts = content.split(/(\{[^}]+\})/g);
        return parts.map((part, i) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                 return <span key={i} className="bg-indigo-100 text-indigo-800 px-1 rounded font-mono text-xs">{part}</span>
            }
            return part;
        });
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-[#e1e3e6] shadow-[0_1px_0_0_#dce1e6]">
            <div className={`flex items-center justify-between border-b border-[#e1e3e6] pb-2 mb-2 ${blurredExtras ? 'blur-[1px] opacity-70' : ''}`}>
                <span className="text-[13px] text-[#818c99] font-medium">Сообщения сообщества</span>
                <span className="text-[13px] text-[#2a5885]">К диалогу</span>
            </div>
            <div className="flex gap-2">
                <VkAvatar text={authorName[0]} url={authorAvatar} size={32} blurred={blurredExtras} />
                <div className="max-w-[85%]">
                     <div className={`flex items-baseline gap-2 mb-1 ${blurredExtras ? 'blur-[1px] opacity-70' : ''}`}>
                        <span className="text-[13px] font-semibold text-[#2a5885]">{authorName}</span>
                        <span className="text-[11px] text-[#818c99]">{date}</span>
                     </div>
                     <div className="bg-[#f2f3f5] p-2.5 rounded-lg rounded-tl-none text-[13px] text-black leading-5 whitespace-pre-wrap">
                         {renderText(text)}
                     </div>
                </div>
            </div>
        </div>
    );
}
