import React from 'react';
import { Attachment } from '../../../shared/types';

const AttachmentIcon: React.FC<{ type: Attachment['type'] }> = ({ type }) => {
    const icons = {
        video: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
        poll: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
        doc: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        audio: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
        link: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    };
    return icons[type] || null;
};

interface AttachmentsDisplayProps {
    // FIX: Widened the type for `mode` to include 'copy' to resolve the type error.
    mode: 'view' | 'edit' | 'copy';
    attachments: Attachment[];
    onRemoveAttachment: (id: string) => void;
}

export const AttachmentsDisplay: React.FC<AttachmentsDisplayProps> = ({ mode, attachments, onRemoveAttachment }) => {
    if (attachments.length === 0) return null;

    return (
        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Вложения</label>
             <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                {attachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between text-gray-600 group">
                         <div className="flex items-center overflow-hidden mr-2">
                            <div className="flex-shrink-0 w-5"><AttachmentIcon type={att.type} /></div>
                            <p className="ml-3 text-sm truncate" title={att.description}>{att.description}</p>
                        </div>
                         {(mode === 'edit' || mode === 'copy') && (
                            <button 
                                onClick={() => onRemoveAttachment(att.id)}
                                className="flex-shrink-0 bg-red-100 text-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-200 hover:text-red-700 transition-all"
                                aria-label="Remove attachment"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};