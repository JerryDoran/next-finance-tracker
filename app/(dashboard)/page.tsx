import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { Angry, SmilePlus } from 'lucide-react';
import { redirect } from 'next/navigation';
import CreateTransactionDialog from './_components/create-transaction-dialog';
import Overview from './_components/overview';
import History from './_components/history';

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect('/wizard');
  }
  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
          {/* <p className='text-3xl font-bold'>Hello, {user.firstName}</p> */}
          <p className='text-3xl font-bold'>Hello, Maestro 👋</p>
          <div className='flex items-center gap-3'>
            <CreateTransactionDialog
              trigger={
                <Button
                  variant='outline'
                  className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 transition'
                >
                  New income
                  <SmilePlus className='h-5 w-5 ml-2' />
                </Button>
              }
              type='income'
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant='outline'
                  className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 transition'
                >
                  New expense
                  <Angry className='h-5 w-5 ml-2' />
                </Button>
              }
              type='expense'
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}
