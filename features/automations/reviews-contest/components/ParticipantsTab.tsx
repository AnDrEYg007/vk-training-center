
import React from 'react';
import { ParticipantMock, ParticipantStatus } from '../types';

const MOCK_PARTICIPANTS: ParticipantMock[] = [
    { 
        id: '1', 
        vkPostId: 10001,
        authorName: 'Иван Иванов', 
        authorId: 101,
        authorUrl: '#',
        postLink: '#', 
        postTextShort: 'Отличные роллы, спасибо! #отзыв', 
        entryNumber: 1, 
        status: 'commented', 
        date: '2023-08-10 14:30',
        replyCommentText: 'Спасибо за отзыв!'
    },
    { 
        id: '2', 
        vkPostId: 10002,
        authorName: 'Мария Петрова', 
        authorId: 102,
        authorUrl: '#',
        postLink: '#', 
        postTextShort: 'Все вкусно, но доставка долгая. #отзыв', 
        entryNumber: 2, 
        status: 'commented', 
        date: '2023-08-10 15:00',
        replyCommentText: 'Спасибо за отзыв!'
    },
    { 
        id: '3', 
        vkPostId: 10003,
        authorName: 'Алексей Сидоров', 
        authorId: 103,
        authorUrl: '#',
        postLink: '#', 
        postTextShort: 'Пицца супер! #отзыв', 
        status: 'processing', 
        date: '2023-08-10 15:45' 
    },
    { 
        id: '4', 
        vkPostId: 10004,
        authorName: 'Елена Смирнова', 
        authorId: 104,
        authorUrl: '#',
        postLink: '#', 
        postTextShort: 'Не положили салфетки :( #отзыв', 
        status: 'error', 
        date: '2023-08-10 16:20' 
    },
];

export const ParticipantsTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden opacity-0 animate-fade-in-up">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="text-sm text-gray-500">Всего участников: <strong>{MOCK_PARTICIPANTS.length}</strong></div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50 text-gray-600">Экспорт</button>
                </div>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="px-4 py-3">Пользователь</th>
                        <th className="px-4 py-3">Текст поста</th>
                        <th className="px-4 py-3 w-24 text-center">Номер</th>
                        <th className="px-4 py-3 w-32">Статус</th>
                        <th className="px-4 py-3 w-40">Дата</th>
                        <th className="px-4 py-3 w-24"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {MOCK_PARTICIPANTS.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{p.authorName}</td>
                            <td className="px-4 py-3 text-gray-600 truncate max-w-xs">{p.postTextShort}</td>
                            <td className="px-4 py-3 text-center">
                                {p.entryNumber && p.entryNumber > 0 ? (
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{p.entryNumber}</span>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-3">
                                {p.status === 'commented' && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">Обработан</span>}
                                {p.status === 'processing' && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs animate-pulse">В очереди</span>}
                                {p.status === 'error' && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs">Ошибка</span>}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{p.date}</td>
                            <td className="px-4 py-3 text-right">
                                <a href={p.postLink} className="text-indigo-600 hover:underline">Пост</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
