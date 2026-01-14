import React, { useState, useEffect, useRef } from 'react';
import { GeneralContestsList } from './GeneralContestsList';
import { GeneralContestEditorPage } from './GeneralContestEditorPage';

interface GeneralContestsPageProps {
    projectId: string;
    setNavigationBlocker?: React.Dispatch<React.SetStateAction<(() => boolean) | null>>;
}

export const GeneralContestsPage: React.FC<GeneralContestsPageProps> = ({ 
    projectId, 
    setNavigationBlocker 
}) => {
    // State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [editingContestId, setEditingContestId] = useState<string | null>(null);

    // Ref to track project changes
    const prevProjectIdRef = useRef(projectId);

    // Effect: Handle Project Switching
    // When projectId changes (meaning the user confirmed the switch),
    // we reset the view mode to 'list'.
    useEffect(() => {
        if (prevProjectIdRef.current !== projectId) {
            setViewMode('list');
            setEditingContestId(null);
            prevProjectIdRef.current = projectId;
        }
    }, [projectId]);

    // Effect: Manage Navigation Blocker
    useEffect(() => {
        if (setNavigationBlocker) {
            if (viewMode === 'create') {
                // Return a blocker function that returns true (block navigation)
                setNavigationBlocker(() => () => true);
            } else {
                setNavigationBlocker(null);
            }
        }
        return () => {
            // Cleanup: remove blocker when component unmounts or mode changes
            if (setNavigationBlocker) setNavigationBlocker(null);
        };
    }, [viewMode, setNavigationBlocker]);

    const handleCreate = () => {
        setEditingContestId(null);
        setViewMode('create');
    };

    const handleEdit = (contestId: string) => {
        setEditingContestId(contestId);
        setViewMode('create');
    };

    const handleCloseEditor = () => {
        setViewMode('list');
        setEditingContestId(null);
        // Blocker will be cleared by the useEffect
    };

    // Render
    if (viewMode === 'create') {
        return (
            <GeneralContestEditorPage 
                projectId={projectId}
                contestId={editingContestId || undefined}
                onClose={handleCloseEditor}
            />
        );
    }

    return (
        <GeneralContestsList 
            projectId={projectId}
            onCreate={handleCreate}
            onEdit={handleEdit}
        />
    );
};
