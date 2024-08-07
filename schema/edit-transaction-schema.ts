import { z } from 'zod';

export const EditTransactionSchema = z.object({
  id: z.string(),
  amount: z.coerce.number().positive().multipleOf(0.01),
  date: z.coerce.date(),
  type: z.union([z.literal('income'), z.literal('expense')]),
});

export type EditTransactionSchemaType = z.infer<typeof EditTransactionSchema>;
