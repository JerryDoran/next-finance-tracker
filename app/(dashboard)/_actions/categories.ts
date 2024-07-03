'use server';

import prisma from '@/lib/prisma';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
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

export async function deleteCategory(form: DeleteCategorySchemaType) {
  // validate the form data passed in
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('Bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
