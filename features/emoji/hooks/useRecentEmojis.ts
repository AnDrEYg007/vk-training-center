import { useCallback } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { EmojiData } from '../data/emojiData';

const MAX_RECENTS = 24; // 3 rows of 8

/**
 * A hook to manage a project-specific list of recently used emojis.
 * @param projectId The ID of the current project to scope the recents list.
 * @returns An object with the list of recent emojis and a function to add a new one.
 */
export const useRecentEmojis = (projectId: string) => {
    const storageKey = `recent-emojis-${projectId}`;
    const [recents, setRecents] = useLocalStorage<EmojiData[]>(storageKey, []);

    const addRecent = useCallback((emoji: EmojiData) => {
        setRecents(prevRecents => {
            // Remove the emoji if it already exists to move it to the front
            const filtered = prevRecents.filter(r => r.char !== emoji.char);
            // Add the new emoji to the beginning of the array
            const newRecents = [emoji, ...filtered];
            // Limit the number of recent emojis
            return newRecents.slice(0, MAX_RECENTS);
        });
    }, [setRecents]);

    return { recents, addRecent };
};