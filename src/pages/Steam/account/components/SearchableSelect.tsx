import { useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { cn } from '@/common/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export const SearchableSelect = ({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Sin resultados',
  className,
}: Props) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value]
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setSearch(''); }}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className={cn('w-full justify-between font-normal', className)}>
          <span className={selectedLabel ? '' : 'text-muted-foreground'}>{selectedLabel ?? placeholder}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-(--radix-dropdown-menu-trigger-width) p-1"
        onCloseAutoFocus={(event: Event) => {
          event.preventDefault();
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <div className="p-1 pb-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(event) => event.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-56 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            filteredOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onValueChange(option.value)}
                className={cn(
                  'cursor-pointer rounded-md',
                  value === option.value && 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};