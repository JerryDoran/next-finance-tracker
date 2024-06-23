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

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get('type');

  // 'nullable' allows the user to call this api without passing in a type parameter
  const validator = z.enum(['expense', 'income']).nullable();
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;

  const descriptions = await prisma.description.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filters if it is defined
    },
    orderBy: {
      name: 'asc',
    },
  });

  return NextResponse.json(descriptions);
}
