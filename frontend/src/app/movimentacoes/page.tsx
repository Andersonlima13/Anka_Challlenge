'use client';

import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { MonthSelector } from '@/app/components/forms/MonthSelector';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';

const metrics = [
  { title: 'Receita Bruta', value: 'R$1.800.000', change: 4.8, icon: BarChart3, description: 'Desde ontem' },
  { title: 'Receita Líquida', value: 'R$1.700.000', change: 4.4, icon: BarChart3, description: 'Desde o mês passado' },
  { title: 'Comissão total', value: 'R$980.000', change: 0.3, icon: BarChart3, description: 'Desde o ano passado' },
];

const tableData = [
  { name: 'Jane Cooper', receitaBruta: 'R$ 467.075,23', receitaLiquida: 'R$ 477.075,23', comissaoTotal: 'R$ 150.000,00', assessor1: '348.043,00', assessor2: '139.012,03', meta: 'cumpriu' },
  { name: 'Floyd Miles', receitaBruta: 'R$ 427.075,23', receitaLiquida: 'R$ 437.075,23', comissaoTotal: 'R$ 120.000,00', assessor1: '400.043,00', assessor2: '100.012,03', meta: 'não atingiu' },
  // ...adicione mais mock conforme necessário
];

export default function Comissoes() {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Maior');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = 30;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredData = tableData.filter(assessor =>
    assessor.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <DashboardLayout activeItem="comissoes">
      {/* Cards de métricas e mês */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{metric.title}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                <span className="text-xs text-muted-foreground">{metric.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-[160px]">
          <span className="text-sm text-muted-foreground">Selecione um mês</span>
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>
      </div>

      {/* Tabela de detalhes por assessor */}
      <div className="bg-gradient-to-br from-[#23244A] to-[#2B2C5A] rounded-2xl p-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">Detalhes por Assessor</h2>
            <p className="text-sm text-muted-foreground">Assessores Ativos</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <SearchAndFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filterValue={filterValue}
              onFilterChange={setFilterValue}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="py-2 px-3 font-semibold">Nome</th>
                <th className="py-2 px-3 font-semibold">Receita Bruta</th>
                <th className="py-2 px-3 font-semibold">Receita Líquida</th>
                <th className="py-2 px-3 font-semibold">Comissão Total</th>
                <th className="py-2 px-3 font-semibold">Assessor 1</th>
                <th className="py-2 px-3 font-semibold">Assessor 2</th>
                <th className="py-2 px-3 font-semibold">Meta</th>
                <th className="py-2 px-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((assessor, idx) => (
                <tr key={idx} className="border-b border-border last:border-0">
                  <td className="py-2 px-3">{assessor.name}</td>
                  <td className="py-2 px-3">{assessor.receitaBruta}</td>
                  <td className="py-2 px-3">{assessor.receitaLiquida}</td>
                  <td className="py-2 px-3">{assessor.comissaoTotal}</td>
                  <td className="py-2 px-3">{assessor.assessor1}</td>
                  <td className="py-2 px-3">{assessor.assessor2}</td>
                  <td className="py-2 px-3">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${assessor.meta === 'cumpriu' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{assessor.meta}</span>
                  </td>
                  <td className="py-2 px-3">
                    <button className="text-muted-foreground hover:text-primary">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>Mostrando assessores 1 a 8 de 30 assessores</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}