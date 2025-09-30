'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { MonthSelector } from '@/app/components/forms/MonthSelector';
import { User, UserPlus, Trash2, Pencil, Check } from 'lucide-react';
import { UserFormModal } from '@/app/components/forms/UserFormModal';
import { ToastProvider } from '@/app/components/ui/toast';

const mockUsersData = [
  { name: 'Jane Cooper', email: 'jane.cooper@email.com', phone: '(11) 99999-0001', status: 'ativo' },
  { name: 'Floyd Miles', email: 'floyd.miles@email.com', phone: '(21) 98888-0002', status: 'ativo' },
  { name: 'Ronald Richards', email: 'ronald.richards@email.com', phone: '(31) 97777-0003', status: 'inativo' },
  { name: 'Marvin McKinney', email: 'marvin.mckinney@email.com', phone: '(41) 96666-0004', status: 'ativo' },
];

export default function Usuarios() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState(mockUsersData);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Todos');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const itemsPerPage = 8;
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredData = users.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.phone.includes(searchValue)
  );

  const totalCadastrados = users.length;
  const totalAtivos = users.filter(u => u.status === 'ativo').length;
  const totalInativos = users.filter(u => u.status === 'inativo').length;

  const metricsData = [
    { title: 'Usuários Ativos', value: totalAtivos, icon: User },
    { title: 'Usuários Cadastrados', value: totalCadastrados, icon: User },
    { title: 'Usuários Inativos', value: totalInativos, icon: User },
  ];

  const handleAddUser = (data: { email: string; password: string; status: string }) => {
    setUsers([
      ...users,
      {
        name: data.email.split('@')[0],
        email: data.email,
        phone: '---',
        status: data.status,
      },
    ]);
  };

  const handleToggleUserSelection = (email: string) => {
    setSelectedUsers(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleDeleteSelected = () => {
    setUsers(users.filter(u => !selectedUsers.includes(u.email)));
    setSelectedUsers([]);
  };

  const handleToggleEdit = (user: any) => {
    if (editingUser === user.email) {
      // Confirmar edição
      setUsers(prev =>
        prev.map(u => (u.email === user.email ? { ...u, ...editForm } : u))
      );
      setEditingUser(null);
      setEditForm({});
    } else {
      // Ativar modo edição com valores atuais
      setEditingUser(user.email);
      setEditForm({ ...user });
    }
  };

  return (
    <ToastProvider>
      <DashboardLayout activeItem="usuarios">
        <div className="flex justify-between items-center mb-6">
       
          <Button
            className="flex items-center gap-2"
            variant="default"
            onClick={() => setShowUserModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Usuário
          </Button>
        </div>

        <UserFormModal
          open={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSuccess={handleAddUser}
        />

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
              <h1 className="text-3xl font-bold text-foreground">Lista de Usuários</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Informações dos usuários cadastrados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SearchAndFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
              />
              {selectedUsers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Usuários
                </Button>
              )}
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 px-3"></th>
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Telefone</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((user, idx) => {
                    const isEditing = editingUser === user.email;
                    return (
                      <tr key={idx} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.email)}
                            onChange={() => handleToggleUserSelection(user.email)}
                          />
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.email}
                              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.phone}
                              onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            user.phone
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <select
                              value={editForm.status}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              className="border rounded px-2 py-1"
                            >
                              <option value="ativo">Ativo</option>
                              <option value="inativo">Inativo</option>
                            </select>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                user.status === 'ativo'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {user.status}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleToggleEdit(user)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            {isEditing ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Pencil className="w-4 h-4 text-white-500" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
    </ToastProvider>
  );
}
