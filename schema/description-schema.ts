import { z } from 'zod';

export const CreateDescriptionSchema = z.object({
  name: z.string().min(3).max(40),
  type: z.enum(['income', 'expense']),
});

export type CreateDescriptionSchemaType = z.infer<
  typeof CreateDescriptionSchema
>;
