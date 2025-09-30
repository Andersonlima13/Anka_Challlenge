'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

export interface AdvisorData {
  id: string;
  name: string;
  annualGoal: string;
  annualCaptured: string;
  semiannualPace: number;
  monthlyGoal: string;
  monthlyCaptured: string;
  monthlyPace: number;
}

interface AdvisorsTableProps {
  data: AdvisorData[];
  className?: string;
}

export function AdvisorsTable({ data, className = '' }: AdvisorsTableProps) {
  const formatCurrency = (value: string) => {
    // Handle negative values
    if (value.startsWith('-')) {
      return <span className="text-destructive">{value}</span>;
    }
    return value;
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={isPositive ? 'text-green-500' : 'text-destructive'}>
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Nome</TableHead>
            <TableHead className="text-muted-foreground">Meta Anual</TableHead>
            <TableHead className="text-muted-foreground">Captado Anual</TableHead>
            <TableHead className="text-muted-foreground">Pace Semestral</TableHead>
            <TableHead className="text-muted-foreground">Meta Mensal</TableHead>
            <TableHead className="text-muted-foreground">Captado Mensal</TableHead>
            <TableHead className="text-muted-foreground">Pace Mensal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((advisor) => (
            <TableRow key={advisor.id}>
              <TableCell className="font-medium text-foreground">
                {advisor.name}
              </TableCell>
              <TableCell className="text-foreground">
                {advisor.annualGoal}
              </TableCell>
              <TableCell className="text-foreground">
                {formatCurrency(advisor.annualCaptured)}
              </TableCell>
              <TableCell>
                {formatPercentage(advisor.semiannualPace)}
              </TableCell>
              <TableCell className="text-foreground">
                {advisor.monthlyGoal}
              </TableCell>
              <TableCell className="text-foreground">
                {formatCurrency(advisor.monthlyCaptured)}
              </TableCell>
              <TableCell>
                {formatPercentage(advisor.monthlyPace)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}