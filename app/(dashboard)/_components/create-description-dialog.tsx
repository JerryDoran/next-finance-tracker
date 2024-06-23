'use client';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusSquare } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Description } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import {
  CreateDescriptionSchema,
  CreateDescriptionSchemaType,
} from '@/schema/description-schema';
import { createDescription } from '../_actions/descriptions';

type CreateDescriptionDialogProps = {
  type: TransactionType;
  successCallback: (description: Description) => void;
};

export default function CreateDescriptionDialog({
  type,
  successCallback,
}: CreateDescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateDescriptionSchemaType>({
    resolver: zodResolver(CreateDescriptionSchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: createDescription,
    onSuccess: async (data: Description) => {
      form.reset({
        name: '',
        type,
      });

      toast.success(`Description ${data.name} created successfully 🎉`, {
        id: 'create-description',
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['descriptions'],
      });

      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error('Something went wrong', {
        id: 'create-description',
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateDescriptionSchemaType) => {
      toast.loading('Creating description...', {
        id: 'create-description',
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
        >
          <PlusSquare className='mr-2 h-4 w-4' />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {type}
            </span>
          </DialogTitle>
          <DialogDescription>
            Descriptions are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Description' {...field} />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    This is how your description will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
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
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && 'Create'}
            {isPending && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
