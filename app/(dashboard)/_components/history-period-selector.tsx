'use client';

import { GetHistoryPeriodsResponseType } from '@/app/api/history-period/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, TimeFrame } from '@/lib/types';

import { useQuery } from '@tanstack/react-query';

type HistoryPeriodSelectorProps = {
  period: Period;
  setPeriod: (period: Period) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
};

export default function HistoryPeriodSelector({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: HistoryPeriodSelectorProps) {
  const { isFetching, data } = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ['overview', 'history', 'periods'],
    queryFn: () => fetch('/api/history-period/').then((res) => res.json()),
  });

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value='year'>Year</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className='flex flex-wrap items-center gap-2'>
        <SkeletonWrapper isLoading={isFetching}>
          <YearsSelector
            period={period}
            setPeriod={setPeriod}
            years={data || []}
          />
        </SkeletonWrapper>
        {timeFrame === 'month' && (
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

type YearsSelectorProps = {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
};

function YearsSelector({ period, setPeriod, years }: YearsSelectorProps) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type MonthSelectorProps = {
  period: Period;
  setPeriod: (period: Period) => void;
};

function MonthSelector({ period, setPeriod }: MonthSelectorProps) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthString = new Date(period.year, month, 1).toLocaleString(
            'default',
            { month: 'long' }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthString}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
