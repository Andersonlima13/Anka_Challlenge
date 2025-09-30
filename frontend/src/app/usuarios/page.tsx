'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { MonthSelector } from '@/app/components/forms/MonthSelector';
import { User, UserPlus } from 'lucide-react';

// Mock dos dados dos cards
const metricsData = [
  { title: 'Usuários Ativos', value: 18, icon: User, change: 0 },
  { title: 'Usuários Cadastrados', value: 30, icon: User, change: 0 },
  { title: 'Usuários Inativos', value: 12, icon: User, change: 0 },
];

// Mock dos dados dos usuários
const mockUsersData = [
  { name: 'Jane Cooper', email: 'jane.cooper@email.com', phone: '(11) 99999-0001', status: 'ativo' },
  { name: 'Floyd Miles', email: 'floyd.miles@email.com', phone: '(21) 98888-0002', status: 'ativo' },
  { name: 'Ronald Richards', email: 'ronald.richards@email.com', phone: '(31) 97777-0003', status: 'inativo' },
  { name: 'Marvin McKinney', email: 'marvin.mckinney@email.com', phone: '(41) 96666-0004', status: 'ativo' },
  // ...adicione mais mock conforme necessário
];

export default function Usuarios() {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Todos');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalItems = mockUsersData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filtrar dados baseado na busca
  const filteredData = mockUsersData.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.phone.includes(searchValue)
  );

  return (
    <DashboardLayout activeItem="usuarios">
      {/* Month Selector e botão adicionar */}
      <div className="flex justify-between items-center mb-6">
        <MonthSelector 
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <Button className="flex items-center gap-2" variant="primary">
          <UserPlus className="w-4 h-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricsData.map((metric, index) => (
         <MetricCard
  key={index}
  title={metric.title}
  value={metric.value}
  icon={metric.icon}
  change={metric.change}
/>
        ))}
      </div>

      {/* Usuários Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Lista de Usuários
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Informações dos usuários cadastrados
            </p>
          </div>
          <SearchAndFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
          />
        </div>

        {/* Tabela de Usuários */}
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="py-2 px-3 font-semibold">Nome</th>
                <th className="py-2 px-3 font-semibold">Email</th>
                <th className="py-2 px-3 font-semibold">Telefone</th>
                <th className="py-2 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage).map((user, idx) => (
                <tr key={idx} className="border-b border-border last:border-0">
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">{user.phone}</td>
                  <td className="py-2 px-3">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${user.status === 'ativo' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{user.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}