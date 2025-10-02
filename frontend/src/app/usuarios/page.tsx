'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { User as UserIcon, UserPlus, Trash2, Pencil, Check } from 'lucide-react';
import { UserFormModal } from '@/app/components/forms/UserFormModal';
import { ToastProvider } from '@/app/components/ui/toast';
import { userService, User } from '@/lib/api/services/userService';

export default function Usuarios() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const itemsPerPage = 8;

  // Carregar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err) {
        console.error('Erro ao carregar usuários', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Métricas
  const totalCadastrados = users.length;
  const totalAtivos = users.filter(u => u.is_active).length;
  const totalInativos = users.filter(u => !u.is_active).length;

  const metricsData = [
    { title: 'Usuários Ativos', value: totalAtivos, icon: UserIcon },
    { title: 'Usuários Cadastrados', value: totalCadastrados, icon: UserIcon },
    { title: 'Usuários Inativos', value: totalInativos, icon: UserIcon },
  ];

  // CRUD
  const handleAddUser = async (data: { email: string; password: string; status: string }) => {
    const created = await userService.create({
      email: data.email,
      password: data.password,
      is_active: data.status === 'ativo',
    });
    setUsers(prev => [...prev, created]);
  };

  const handleToggleUserSelection = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedUsers) {
      await userService.delete(id);
    }
    setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  const handleToggleEdit = async (user: User) => {
    if (editingUser === user.id) {
      // Confirmar edição
      const updated = await userService.update(user.id, {
        email: editForm.email,
        is_active: editForm.status === 'ativo',
      });
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)));
      setEditingUser(null);
      setEditForm({});
    } else {
      // Entrar em modo edição
      setEditingUser(user.id);
      setEditForm({
        email: user.email,
        status: user.is_active ? 'ativo' : 'inativo',
      });
    }
  };

  const filteredData = users.filter(user =>
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(user => {
                    const isEditing = editingUser === user.id;
                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleToggleUserSelection(user.id)}
                          />
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
                                user.is_active
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {user.is_active ? 'ativo' : 'inativo'}
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
