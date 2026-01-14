import React, { useState, useMemo } from 'react';
import { emojiCategories, EmojiData } from '../data/emojiData';
import { useRecentEmojis } from '../hooks/useRecentEmojis';

interface EmojiPickerProps {
    projectId: string;
    onSelectEmoji: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ projectId, onSelectEmoji }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { recents, addRecent } = useRecentEmojis(projectId);
    const [activeCategory, setActiveCategory] = useState(recents.length > 0 ? 'Недавние' : emojiCategories[0].name);

    const handleSelect = (emoji: EmojiData) => {
        onSelectEmoji(emoji.char);
        addRecent(emoji);
    };

    const handleCategoryClick = (name: string) => {
        setActiveCategory(name);
    };

    const filteredEmojis = useMemo(() => {
        if (!searchQuery) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();
        return emojiCategories
            .flatMap(category => category.emojis)
            .filter(emoji => 
                emoji.name.toLowerCase().includes(lowerCaseQuery) ||
                emoji.keywords.some(kw => kw.toLowerCase().includes(lowerCaseQuery))
            );
    }, [searchQuery]);

    const displayedContent = useMemo(() => {
        if (activeCategory === 'Недавние') {
            return {
                name: 'Недавно использованные',
                emojis: recents,
            };
        }
        return emojiCategories.find(cat => cat.name === activeCategory);
    }, [activeCategory, recents]);

    const CategoryButton: React.FC<{ name: string, icon: string, isActive: boolean, onClick: (name: string) => void, disabled?: boolean }> = ({ name, icon, isActive, onClick, disabled }) => (
        <button
            title={name}
            onClick={() => onClick(name)}
            disabled={disabled}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {icon}
        </button>
    );

    const EmojiButton: React.FC<{ emoji: EmojiData }> = ({ emoji }) => (
         <button
            key={emoji.char}
            onClick={() => handleSelect(emoji)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-2xl hover:bg-gray-200 transition-colors"
            title={emoji.name}
        >
            {emoji.char}
        </button>
    );

    return (
        <div className="w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col animate-fade-in-up">
            <div className="p-3 border-b">
                <input
                    type="text"
                    placeholder="Поиск эмодзи..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="p-2 border-b grid grid-cols-7 gap-1">
                <CategoryButton name="Недавние" icon="🕒" isActive={activeCategory === 'Недавние'} onClick={handleCategoryClick} disabled={recents.length === 0} />
                {emojiCategories.map(cat => <CategoryButton key={cat.name} name={cat.name} icon={cat.icon} isActive={activeCategory === cat.name} onClick={handleCategoryClick} />)}
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-3">
                {searchQuery ? (
                    filteredEmojis.length > 0 ? (
                        <div className="grid grid-cols-8 gap-1">
                            {filteredEmojis.map(emoji => <EmojiButton key={emoji.char} emoji={emoji} />)}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-gray-500 mt-4">Эмодзи не найдены</p>
                    )
                ) : (
                    displayedContent && displayedContent.emojis.length > 0 && (
                        <div key={displayedContent.name}>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                                {displayedContent.name}
                            </h3>
                            <div className="grid grid-cols-8 gap-1">
                                {displayedContent.emojis.map(emoji => <EmojiButton key={emoji.char} emoji={emoji} />)}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};