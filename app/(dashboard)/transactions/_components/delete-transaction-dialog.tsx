'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTransaction } from '../_actions/delete-transaction';

type DeleteTransactionDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
};

export default function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
}: DeleteTransactionDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      toast.success('Transaction successfully deleted', {
        id: transactionId,
      });

      // invalidate old query to refetch new data
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: transactionId,
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading('Deleting transaction...', {
                id: transactionId,
              });
              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
