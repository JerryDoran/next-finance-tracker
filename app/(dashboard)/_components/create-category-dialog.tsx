'use client';

import { TransactionType } from '@/lib/types';
import { useState } from 'react';

type CreateCategoryDialogProps = {
  type: TransactionType;
};

export default function CreateCategoryDialog({
  type,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return <div>CreateCategoryDialog</div>;
}
