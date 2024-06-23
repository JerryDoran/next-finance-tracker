'use server';

import prisma from '@/lib/prisma';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/categories-schema';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function createCategory(form: CreateCategorySchemaType) {
  // validate the form data passed in

  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('Bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { name, icon, type } = parsedBody.data;

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });

  return category;
}
