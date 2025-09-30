'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, className = '' }: MetricCardProps) {

  
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
    
        </div>
      </CardContent>
    </Card>
  );
}