
import React from 'react';
import { ListStats } from '../../../../../services/api/lists.api';
import { StatsPeriod, StatsGroupBy, FilterCanWrite } from '../../types';
import { MailingChartSection } from './sections/MailingChartSection';
import { 
    QualityCard, MailingStatusCard, LifetimeCard, LastContactCard, 
    GeoCard, DemographicsCard, PlatformsCard, OnlineCard, AgeCard, BirthdayCard 
} from './sections/UserStatsCards';

interface UserStatsViewProps {
    stats: ListStats;
    isLoading?: boolean;
    listType?: string;
    statsPeriod?: StatsPeriod;
    statsGroupBy?: StatsGroupBy;
    onParamsChange?: (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string, filterCanWrite?: FilterCanWrite) => void;
    filterCanWrite?: FilterCanWrite;
}

export const UserStatsView: React.FC<UserStatsViewProps> = (props) => {
    const { stats, isLoading, listType, statsPeriod, statsGroupBy, filterCanWrite, onParamsChange } = props;

    return (
        <div className={`flex flex-col gap-4 mb-4 transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
             
            {/* ГРАФИК (Только для Mailing) */}
            {listType === 'mailing' && (
                 <MailingChartSection 
                    stats={stats}
                    statsPeriod={statsPeriod || 'all'}
                    statsGroupBy={statsGroupBy || 'month'}
                    filterCanWrite={filterCanWrite || 'all'}
                    onParamsChange={onParamsChange}
                 />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <QualityCard stats={stats} />
                
                {stats.mailing_stats && <MailingStatusCard stats={stats} />}
                
                {(stats.lifetime_stats || listType === 'mailing') && <LifetimeCard stats={stats} />}
                
                {stats.last_contact_stats && <LastContactCard stats={stats} />}

                <GeoCard stats={stats} />
                <DemographicsCard stats={stats} />
                <PlatformsCard stats={stats} />
                <OnlineCard stats={stats} />
                
                <AgeCard stats={stats} className="md:col-span-2 xl:col-span-2" />
                <BirthdayCard stats={stats} className="md:col-span-2 xl:col-span-2" />
            </div>
        </div>
    );
};
