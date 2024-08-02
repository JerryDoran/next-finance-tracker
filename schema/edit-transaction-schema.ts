import { Description } from '@radix-ui/react-toast';
import { z } from 'zod';

export const EditTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal('income'), z.literal('expense')]),
});

export type EditTransactionSchemaType = z.infer<typeof EditTransactionSchema>;
