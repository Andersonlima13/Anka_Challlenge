'use client';

import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { BarChart3 } from 'lucide-react';

export default function NetNewMoney() {
  const netNewMoneyMetrics = [
    {
      title: 'Net New Money Anual',
      value: '125M',
      change: 15.2,
      icon: BarChart3,
    },
    {
      title: 'Net New Money Semestral',
      value: '68M',
      change: 8.7,
      icon: BarChart3,
    },
    {
      title: 'Net New Money Mensal',
      value: '12M',
      change: 3.2,
      icon: BarChart3,
    },
    {
      title: 'Net New Money Semanal',
      value: '2.8M',
      change: 1.1,
      icon: BarChart3,
    },
  ];

  return (
    <DashboardLayout activeItem="net-new-money">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Net New Money
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise de novos investimentos captados
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {netNewMoneyMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Placeholder for future charts or tables */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Gráficos e Análises
          </h3>
          <p className="text-muted-foreground">
            Esta seção será expandida com gráficos detalhados e análises de Net New Money.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
