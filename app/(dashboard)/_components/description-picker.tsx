'use client';

import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Description } from '@prisma/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import CreateDescriptionDialog from './create-description-dialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type DescriptionPickerType = {
  type: TransactionType;
  onChange: (value: string) => void;
};

export default function DescriptionPicker({
  type,
  onChange,
}: DescriptionPickerType) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);

  const descriptionQuery = useQuery({
    queryKey: ['descriptions', type],
    queryFn: () =>
      fetch(`/api/descriptions?type=${type}`).then((res) => res.json()),
  });

  const selectedDescription = descriptionQuery.data?.find(
    (description: Description) => description.name === value
  );

  const handleSuccess = useCallback(
    (description: Description) => {
      setValue(description.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[280px] justify-between gap-2'
        >
          {selectedDescription ? (
            <DescriptionRow description={selectedDescription} />
          ) : (
            'Select description'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-0'>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder='Search description...' />
          <CreateDescriptionDialog
            type={type}
            successCallback={handleSuccess}
          />
          <CommandEmpty>
            <p>Description not found</p>
            <p className='text-xs text-muted-foreground'>
              Tip: Create a new description
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {descriptionQuery.data &&
                descriptionQuery.data.map((description: Description) => (
                  <CommandItem
                    key={description.name}
                    onSelect={() => {
                      setValue(description.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <DescriptionRow description={description} />
                    <Check
                      className={cn(
                        'ml-2 w-4 h-4 opacity-0',
                        value === description.name && 'opacity-100'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DescriptionRow({ description }: { description: Description }) {
  return (
    <div className='flex items-center gap-2'>
      {/* <span role='img'>{description.icon}</span> */}
      <span>{description.name}</span>
    </div>
  );
}
