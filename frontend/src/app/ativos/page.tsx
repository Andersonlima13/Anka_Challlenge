'use client';

import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Avatar } from '@/app/components/ui/avatar';
import { useState } from 'react';

export default function Custodia() {
  // Mock dos dados dos cards
  const metrics = [
    {
      title: 'Começo do ano',
      value: 'R$1.155.000.000,00',
      icon: BarChart3,
    },
    {
      title: 'Final do ano',
      value: 'R$1.400.000.000,00',
      icon: BarChart3,
    },
    {
      title: 'Variação anual',
      value: '+ 17,5%',
      icon: TrendingUp,
      change: 17.5,
      isPercent: true  
    },
  ];

  // Mock dos filtros de data
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');

  // Mock dos dados dos gráficos
  // (No real, use um componente de chart, aqui é apenas placeholder visual)

  return (
    <DashboardLayout activeItem="custodia">
      <div className="space-y-6">
        {/* Título e avatar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Custódia</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <div>
                <span className="block text-xs text-muted-foreground mb-1">Data Inicial</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-foreground text-sm"
                />
              </div>
              <div>
                <span className="block text-xs text-muted-foreground mb-1">Data Final</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-foreground text-sm"
                />
              </div>
            </div>
                <Avatar className="w-12 h-12 border-2 border-primary" />
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric , idx) => (
  <MetricCard
    key={idx}
    title={metric.title}
    value={metric.value}
    change={metric.change ?? 0}
    icon={metric.icon}
    isPercent={metric.isPercent}
  />
))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Gráfico AuC */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground">AuC <span className="text-muted-foreground ml-2">R$ 1.4B</span></span>
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded bg-muted text-xs">Semana</button>
                <button className="px-2 py-1 rounded bg-muted text-xs">Mês</button>
                <button className="px-2 py-1 rounded bg-primary text-xs text-primary-foreground">Anual</button>
                <button className="px-2 py-1 rounded bg-muted text-xs">Max</button>
              </div>
            </div>
            {/* Placeholder visual do gráfico */}
            <div className="h-56 w-full bg-gradient-to-t from-primary/30 to-transparent rounded-lg flex items-end">
              <div className="w-full h-full flex items-end">
                {/* Simulação de curva */}
                <svg width="100%" height="100%" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 150 Q 50 120 100 130 Q 150 140 200 100 Q 250 60 300 120 Q 350 170 400 80" stroke="#6366F1" strokeWidth="4" fill="none" />
                  <polyline points="0,180 0,150 400,80 400,180" fill="#6366F1" fillOpacity="0.2" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
            </div>
          </div>
          {/* Gráfico Captação */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground">Captação</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded bg-muted text-xs">Dia</button>
                <button className="px-2 py-1 rounded bg-muted text-xs">Semana</button>
                <button className="px-2 py-1 rounded bg-primary text-xs text-primary-foreground">Ano</button>
              </div>
            </div>
            {/* Placeholder visual do gráfico de barras */}
            <div className="h-56 w-full flex items-end">
              <svg width="100%" height="100%" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Barras mockadas */}
                <rect x="20" y="120" width="20" height="60" fill="#6366F1" fillOpacity="0.7" />
                <rect x="60" y="80" width="20" height="100" fill="#6366F1" fillOpacity="0.7" />
                <rect x="100" y="100" width="20" height="80" fill="#6366F1" fillOpacity="0.7" />
                <rect x="140" y="60" width="20" height="120" fill="#6366F1" fillOpacity="0.7" />
                <rect x="180" y="40" width="20" height="140" fill="#6366F1" fillOpacity="0.7" />
                <rect x="220" y="90" width="20" height="90" fill="#6366F1" fillOpacity="0.7" />
                <rect x="260" y="70" width="20" height="110" fill="#6366F1" fillOpacity="0.7" />
              </svg>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
