'use client';

import { useState } from 'react';
import { UserSettings } from '@prisma/client';
import { startOfMonth } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';

type DateProps = {
  from: Date;
  to: Date;
};

export default function Overview({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [dateRange, setDateRange] = useState<DateProps>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className='container flex flex-wrap items-end justify-between gap-2 py-6'>
        <h2 className='text-3xl font-bold'>Overview</h2>
        <div className='flex items-center gap-3'>
          <DateRangePicker
            initialCompareFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              // we update the date range only if both dates are set
              if (!from || !to) return;
            }}
          />
        </div>
      </div>
    </>
  );
}
