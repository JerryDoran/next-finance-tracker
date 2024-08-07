'use client';

import { ReactNode, useCallback, useState } from 'react';
import { TransactionType } from '@/lib/types';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn, dateToUTCDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { EditTransactionSchemaType } from '@/schema/edit-transaction-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTransaction } from '../_actions/edit-transaction';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CategoryPicker from '../../_components/category-picker';
import DescriptionPicker from '../../_components/description-picker';
import { EditTransactionSchema } from '@/schema/edit-transaction-schema';
import { Transaction } from '@prisma/client';

type EditTransactionDialogProps = {
  trigger: ReactNode;
  type: TransactionType;
  transaction: Transaction;
};

export default function EditTransactionDialog({
  trigger,
  type,
  transaction,
}: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<EditTransactionSchemaType>({
    resolver: zodResolver(EditTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  // const handleCategoryChange = useCallback(
  //   (value: string) => {
  //     form.setValue('category', value);
  //   },
  //   [form]
  // );

  // const handleDescriptionChange = useCallback(
  //   (value: string) => {
  //     form.setValue('description', value);
  //   },
  //   [form]
  // );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      toast.success('Transaction successfully edited  🎉', {
        id: 'create-transaction',
      });

      form.reset({
        type,

        amount: 0,
        date: new Date(),
      });

      // After creating a transaction, we need to invalidate the overview query
      // which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ['overview'],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: EditTransactionSchemaType) => {
      toast.loading('Editing transaction...', {
        id: 'edit-transaction',
      });

      console.log(values);

      mutate({
        ...values,
        date: dateToUTCDate(values.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit{' '}
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {type}
            </span>{' '}
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            {/* <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue='' {...field} />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-1'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <DescriptionPicker
                      type={type}
                      onChange={handleDescriptionChange}
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Select a description for this transaction (required)
                  </FormDescription>
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type='number' {...field} />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between gap-2'>
              {/* <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-2'>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Select a category for this transaction (required)
                    </FormDescription>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-2'>
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-[200px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='text-xs'>
                      Select a date for this transaction (required)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className='flex gap-2'>
          <DialogClose>
            <Button
              type='button'
              variant='secondary'
              className='w-full'
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          {/* form.handleSubmit(onSubmit) goes in onClick */}
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            {!isPending && 'Edit'}
            {isPending && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
