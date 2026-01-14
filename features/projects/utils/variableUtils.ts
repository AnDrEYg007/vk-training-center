import { v4 as uuidv4 } from 'uuid';

export type VariableItem = { id: string; name: string; value: string };

/**
 * Парсит строку переменных из Google Sheets в массив объектов.
 * @param variablesStr - Строка в формате `(Имя1||Значение1), (Имя2||Значение2)`.
 * @returns Массив объектов VariableItem.
 */
export const parseVariablesString = (variablesStr: string): VariableItem[] => {
    if (!variablesStr || typeof variablesStr !== 'string' || variablesStr.trim() === '') return [];
    return variablesStr
        .replace(/^\s*\(\s*|\s*\)\s*$/g, '')
        .split(/\s*\)\s*,\s*\(\s*/)
        .map(pairString => {
            const parts = pairString.split('||');
            if (parts.length === 2) return { id: uuidv4(), name: parts[0].trim(), value: parts[1].trim() };
            return null;
        })
        .filter((v): v is VariableItem => v !== null);
};

/**
 * Сериализует массив объектов переменных обратно в строку для сохранения в Google Sheets.
 * @param variables - Массив объектов VariableItem.
 * @returns Строка в формате `(Имя1||Значение1), (Имя2||Значение2)`.
 */
export const serializeVariablesArray = (variables: VariableItem[]): string => {
    return variables
        .filter(v => v.name.trim() !== '' || v.value.trim() !== '')
        .map(v => `(${v.name.trim()}||${v.value.trim()})`)
        .join(', ');
};
