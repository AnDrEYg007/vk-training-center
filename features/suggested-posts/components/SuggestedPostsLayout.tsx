import React from 'react';
import { SuggestedPost, Project } from '../../../shared/types';
import { SuggestedPostCard } from './SuggestedPostCard';
import { AiEditor } from './AiEditor';

interface SuggestedPostsLayoutProps {
    project: Project;
    posts: SuggestedPost[];
    selectedPostId: string | null;
    correctedText: string;
    isCorrecting: boolean;
    onSelectPost: (post: SuggestedPost) => void;
    onCopyToClipboard: (text: string) => void;
}

export const SuggestedPostsLayout: React.FC<SuggestedPostsLayoutProps> = ({
    posts,
    project,
    selectedPostId,
    correctedText,
    isCorrecting,
    onSelectPost,
    onCopyToClipboard,
}) => {
    const hasResult = !!correctedText;

    return (
        <>
            {posts.map((post, index) => {
                const isSelected = post.id === selectedPostId;
                const animationDelay = `${index * 50}ms`;

                if (isSelected) {
                    return (
                        <div
                            key={post.id}
                            className="flex gap-4 items-stretch opacity-0 animate-fade-in-up"
                            style={{ animationDelay }}
                        >
                            <div className="w-1/2">
                                <SuggestedPostCard
                                    post={post}
                                    projectName={project.name}
                                    isSelected={true}
                                    isCorrecting={isCorrecting}
                                    onSelectForEditing={onSelectPost}
                                    stretchHeight={true}
                                    hasResult={hasResult}
                                />
                            </div>
                            <div className="w-1/2">
                                <AiEditor
                                    correctedText={correctedText}
                                    isCorrecting={isCorrecting}
                                    onCopyToClipboard={onCopyToClipboard}
                                />
                            </div>
                        </div>
                    );
                }
                return (
                    <div
                        key={post.id}
                        className="max-w-[calc(50%-0.5rem)] opacity-0 animate-fade-in-up"
                        style={{ animationDelay }}
                    >
                        <SuggestedPostCard
                            post={post}
                            projectName={project.name}
                            isSelected={false}
                            isCorrecting={isCorrecting}
                            onSelectForEditing={onSelectPost}
                            hasResult={false}
                        />
                    </div>
                );
            })}
        </>
    );
};
