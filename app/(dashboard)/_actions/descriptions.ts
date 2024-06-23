'use server';

import prisma from '@/lib/prisma';
import {
  CreateDescriptionSchema,
  CreateDescriptionSchemaType,
} from '@/schema/description-schema';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function createDescription(form: CreateDescriptionSchemaType) {
  // validate the form data passed in

  const parsedBody = CreateDescriptionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('Bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { name, type } = parsedBody.data;

  const description = await prisma.description.create({
    data: {
      userId: user.id,
      name,
      type,
    },
  });

  return description;
}
