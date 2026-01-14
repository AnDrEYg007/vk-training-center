import React, { useMemo } from 'react';

/**
 * Вычисляет разницу между двумя строками на основе алгоритма LCS (Longest Common Subsequence).
 */
const computeDiff = (oldText: string, newText: string) => {
    // Разделяем текст на слова и пробелы, чтобы сохранить форматирование
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    const m = oldWords.length;
    const n = newWords.length;

    // Строим матрицу LCS
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (oldWords[i - 1] === newWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Восстанавливаем разницу, двигаясь по матрице
    const diff: { value: string; added?: boolean; removed?: boolean }[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
            diff.unshift({ value: oldWords[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ value: newWords[j - 1], added: true });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diff.unshift({ value: oldWords[i - 1], removed: true });
            i--;
        } else { break; }
    }
    
    // Объединяем последовательные одинаковые изменения для лучшего вида
    if (diff.length === 0) return [];
    const mergedDiff = [diff[0]];
    for (let k = 1; k < diff.length; k++) {
        const last = mergedDiff[mergedDiff.length - 1];
        const current = diff[k];
        if (last.added === current.added && last.removed === current.removed) {
            last.value += current.value;
        } else {
            mergedDiff.push(current);
        }
    }
    return mergedDiff;
};

/**
 * Компонент для рендеринга визуальной разницы между двумя текстами.
 */
export const DiffViewer: React.FC<{ oldText: string; newText: string; className?: string }> = ({ oldText, newText, className }) => {
    const diffs = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

    return (
        <div className={`w-full p-2 border border-gray-300 rounded-md bg-white text-sm whitespace-pre-wrap leading-normal custom-scrollbar ${className}`}>
            {diffs.map((part, index) => (
                <span key={index} className={
                    part.added ? "bg-green-100 text-green-800 rounded px-0.5" : part.removed ? "bg-red-100 text-red-800 rounded line-through px-0.5" : ""
                }>
                    {part.value}
                </span>
            ))}
        </div>
    );
};