'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  className?: string;
}

export function MetricCard({ title, value, change, icon: Icon, className = '' }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-green-500' : 'text-destructive'
          }`}>
            <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}