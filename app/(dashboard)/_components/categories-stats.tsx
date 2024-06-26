import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dateToUTCDate, getFormatterForCurrency } from '@/lib/utils';
import { UserSettings } from '@prisma/client';

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
  const statsQuery = useQuery({
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
      CategoriesStats
    </div>
  );
}
