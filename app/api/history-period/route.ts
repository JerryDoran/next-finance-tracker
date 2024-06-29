import prisma from '@/lib/prisma';
import { z } from 'zod';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const periods = await getHistoryPeriods(user.id);

  return NextResponse.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ['year'],
    orderBy: [{ year: 'asc' }],
  });

  // create a new array of years
  const years = result.map((el) => el.year);
  if (years.length === 0) {
    // return current year
    return [new Date().getFullYear()];
  }

  return years;
}
