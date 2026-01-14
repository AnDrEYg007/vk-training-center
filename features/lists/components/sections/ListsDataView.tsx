
import React from 'react';
import { ListType } from '../../types';
import { SystemListSubscriber, SystemListPost, SystemListInteraction } from '../../../../shared/types';
import { MembersTable } from '../MembersTable';
import { PostsTable } from '../PostsTable';
import { InteractionTable } from '../InteractionTable';

interface ListsDataViewProps {
    activeList: ListType;
    isListLoaded: boolean;
    isLoadingList: boolean;
    items: SystemListSubscriber[];
    posts: SystemListPost[];
    interactions: SystemListInteraction[];
    projectId: string;
    vkGroupId: string;
    onLoadMore: () => void;
}

export const ListsDataView: React.FC<ListsDataViewProps> = ({
    activeList,
    isListLoaded,
    isLoadingList,
    items,
    posts,
    interactions,
    projectId,
    vkGroupId,
    onLoadMore
}) => {
    
    if (!isListLoaded) {
        return (
            <div className="h-40 flex items-center justify-center">
                <div className="loader h-8 w-8 border-4 border-t-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="pb-4">
            {activeList === 'posts' || activeList === 'reviews_posts' ? (
                <PostsTable 
                    items={posts} 
                    isLoading={false} 
                    onLoadMore={onLoadMore}
                    isFetchingMore={isLoadingList}
                />
            ) : ['likes', 'comments', 'reposts'].includes(activeList) ? (
                <InteractionTable 
                    items={interactions} 
                    isLoading={false} 
                    projectId={projectId} 
                    vkGroupId={vkGroupId}
                    listType={activeList as any} 
                    onLoadMore={onLoadMore}
                    isFetchingMore={isLoadingList}
                />
            ) : (
                <MembersTable 
                    items={items} 
                    isLoading={false} 
                    listType={activeList} 
                    onLoadMore={onLoadMore}
                    isFetchingMore={isLoadingList}
                />
            )}
        </div>
    );
};
