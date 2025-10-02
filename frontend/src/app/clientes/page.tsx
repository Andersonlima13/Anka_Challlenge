'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { User, UserPlus, Trash2, Pencil, Check } from 'lucide-react';
import { ToastProvider } from '@/app/components/ui/toast';
import { clientService, Client } from '@/lib/api/services/clientService';
import { ClientFormModal } from '../components/forms/ClientFormModal';

export default function Clientes() {
  const [showClientModal, setShowClientModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.getAll();
        setClients(data);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredData = clients.filter(client =>
    client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    client.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalCadastrados = clients.length;
  const totalAtivos = clients.filter(c => c.status === 'ativo').length;
  const totalInativos = clients.filter(c => c.status === 'inativo').length;

  const metricsData = [
    { title: 'Clientes Ativos', value: totalAtivos, icon: User },
    { title: 'Clientes Cadastrados', value: totalCadastrados, icon: User },
    { title: 'Clientes Inativos', value: totalInativos, icon: User },
  ];

  const handleAddClient = async (data: { name: string; email: string; status: string }) => {
    try {
      const newClient = await clientService.create({
        name: data.name,
        email: data.email,
        status: data.status as 'ativo' | 'inativo',
      });
      setClients([...clients, newClient]);
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
    }
  };

  const handleToggleClientSelection = (id: number) => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedClients.map(id => clientService.delete(id)));
      setClients(clients.filter(c => !selectedClients.includes(c.id)));
      setSelectedClients([]);
    } catch (err) {
      console.error('Erro ao excluir clientes:', err);
    }
  };

  const handleToggleEdit = async (client: Client) => {
    if (editingClient === client.id) {
      try {
        const updated = await clientService.update(client.id, editForm);
        setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));
        setEditingClient(null);
        setEditForm({});
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
      }
    } else {
      setEditingClient(client.id);
      setEditForm({ ...client });
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="clientes">
        <p className="text-center text-muted-foreground">Carregando clientes...</p>
      </DashboardLayout>
    );
  }

  return (
    <ToastProvider>
      <DashboardLayout activeItem="clientes">
        <div className="flex justify-between items-center mb-6">
          <Button
            className="flex items-center gap-2"
            variant="default"
            onClick={() => setShowClientModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Cliente
          </Button>
        </div>

        <ClientFormModal
          open={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSuccess={data =>
            handleAddClient({
              name: data.name,
              email: data.email,
              status: data.status,
            })
          }
          fields={['name', 'email', 'status']}
          title="Adicionar Cliente"
          submitLabel="Cadastrar Cliente"
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={String(metric.value)}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Clientes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lista de Clientes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Informações dos clientes cadastrados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SearchAndFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
              />
              {selectedClients.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Clientes
                </Button>
              )}
            </div>
          </div>

          {/* Tabela de Clientes */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 px-3"></th>
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Criado em</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(client => {
                    const isEditing = editingClient === client.id;
                    return (
                      <tr key={client.id} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleToggleClientSelection(client.id)}
                          />
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.name ?? ''}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            client.name
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.email ?? ''}
                              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            client.email
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <select
                              value={editForm.status ?? 'ativo'}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value as 'ativo' | 'inativo' })}
                              className="border rounded px-2 py-1"
                            >
                              <option value="ativo">Ativo</option>
                              <option value="inativo">Inativo</option>
                            </select>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                client.status === 'ativo'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {client.status}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editForm.createdAt ?? ''}
                              onChange={e => setEditForm({ ...editForm, createdAt: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            new Date(client.createdAt).toLocaleDateString('pt-BR')
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleToggleEdit(client)}
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
