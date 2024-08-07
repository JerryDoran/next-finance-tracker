'use server';

import prisma from '@/lib/prisma';
import {
  EditTransactionSchema,
  EditTransactionSchemaType,
} from '@/schema/edit-transaction-schema';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function editTransaction(form: EditTransactionSchemaType) {
  console.log(form);
  const parsedBody = EditTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { amount, date, id, type } = parsedBody.data;

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error('Bad request');
  }

  await prisma.$transaction([
    // Delete transaction from db
    prisma.transaction.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        amount,
        date,
      },
    }),
    // Update month history
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    // Update year history
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
