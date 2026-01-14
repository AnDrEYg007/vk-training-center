import React from 'react';
import { ColumnDefinition } from './ProjectTable';

interface ProjectTableSkeletonProps {
    columns: ColumnDefinition[];
    visibleColumns: Record<string, boolean>;
}

const SkeletonRow: React.FC<{ visibleCols: ColumnDefinition[] }> = ({ visibleCols }) => (
    <tr className="animate-pulse border-b border-white last:border-b-0">
        {visibleCols.map(col => (
            <td key={col.key} className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded"></div>
            </td>
        ))}
    </tr>
);

export const ProjectTableSkeleton: React.FC<ProjectTableSkeletonProps> = ({ columns, visibleColumns }) => {
    const visibleCols = columns.filter(c => visibleColumns[c.key]);

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        {visibleCols.map(col => (
                            <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonRow key={index} visibleCols={visibleCols} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};