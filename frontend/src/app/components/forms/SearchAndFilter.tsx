'use client';

import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Search, ChevronDown } from 'lucide-react';

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  className?: string;
}

export function SearchAndFilter({ 
  searchValue, 
  onSearchChange, 
  filterValue, 
  onFilterChange,
  searchPlaceholder = "Pesquisar",
  filterOptions = [
    { label: 'Maior', value: 'Maior' },
    { label: 'Menor', value: 'Menor' },
    { label: 'Todos', value: 'Todos' }
  ],
  className = ''
}: SearchAndFilterProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 text-muted-foreground">
            <span >Filtrar por: {filterValue}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filterOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
