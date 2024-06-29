import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dateToUTCDate, getFormatterForCurrency } from '@/lib/utils';
import { UserSettings } from '@prisma/client';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { TransactionType } from '@/lib/types';
import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

type CategoriesStatsProps = {
  from: Date;
  to: Date;
  userSettings: UserSettings;
};

export default function CategoriesStats({
  from,
  to,
  userSettings,
}: CategoriesStatsProps) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='income'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='expense'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

type CategoriesCardProps = {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
};

function CategoriesCard({ formatter, type, data }: CategoriesCardProps) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === 'income' ? 'Income' : 'Expenses'} by category
        </CardTitle>
      </CardHeader>
      <div className='flex items-center justify-between gap-2'>
        {filteredData.length === 0 && (
          <div className='flex h-60 w-full flex-col items-center justify-center text-center'>
            No data for the selected period
            <p className='text-sm text-muted-foreground'>
              Try selecting a different period or try adding new{' '}
              {type === 'income' ? 'incomes' : 'expenses'}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div className='flex flex-col gap-2' key={item.category}>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 mt-1 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      className='h-[5px]'
                      value={percentage}
                      indicator={
                        type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
