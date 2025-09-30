
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { User, UserPlus, Trash2, Pencil, Check } from 'lucide-react';
import { ToastProvider } from '@/app/components/ui/toast';
// Importe o modal de cliente (crie se não existir)
import { UserFormModal } from '@/app/components/forms/UserFormModal';

// Mock de clientes
const mockClientsData = [
  { name: 'Empresa Alpha', email: 'contato@alpha.com', status: 'ativo', createdAt: '2025-09-01' },
  { name: 'Beta Ltda', email: 'beta@empresa.com', status: 'ativo', createdAt: '2025-08-15' },
  { name: 'Gamma Corp', email: 'gamma@corp.com', status: 'inativo', createdAt: '2025-07-10' },
  { name: 'Delta S/A', email: 'delta@sa.com', status: 'ativo', createdAt: '2025-06-20' },
];

export default function Clientes() {
  const [showClientModal, setShowClientModal] = useState(false);
  const [clients, setClients] = useState(mockClientsData);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const itemsPerPage = 8;
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const handleAddClient = (data: { name: string; email: string; status: string; createdAt: string }) => {
    setClients([
      ...clients,
      {
        name: data.name,
        email: data.email,
        status: data.status,
        createdAt: data.createdAt,
      },
    ]);
  };

  const handleToggleClientSelection = (email: string) => {
    setSelectedClients(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleDeleteSelected = () => {
    setClients(clients.filter(c => !selectedClients.includes(c.email)));
    setSelectedClients([]);
  };

  const handleToggleEdit = (client: any) => {
    if (editingClient === client.email) {
      // Confirmar edição
      setClients(prev =>
        prev.map(c => (c.email === client.email ? { ...c, ...editForm } : c))
      );
      setEditingClient(null);
      setEditForm({});
    } else {
      // Ativar modo edição com valores atuais
      setEditingClient(client.email);
      setEditForm({ ...client });
    }
  };

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

        <UserFormModal
          open={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSuccess={data => handleAddClient({
            name: data.name,
            email: data.email,
            status: data.status,
            createdAt: new Date().toISOString().slice(0, 10),
          })}
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
                  .map((client, idx) => {
                    const isEditing = editingClient === client.email;
                    return (
                      <tr key={idx} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.email)}
                            onChange={() => handleToggleClientSelection(client.email)}
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
                            client.name
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
                            client.email
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
                              value={editForm.createdAt}
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
