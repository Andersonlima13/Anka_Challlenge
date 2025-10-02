'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { Plus, Trash2, Pencil, Check, BarChart3 } from 'lucide-react';
import { ToastProvider, toast } from '@/app/components/ui/toast';

import { clientService, Client } from '@/lib/api/services/clientService';
import movementService, { Movement, MovementCreate } from '@/lib/api/services/movimentacaoService';

export default function Movimentacoes() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMovements, setSelectedMovements] = useState<number[]>([]);
  const [editingMovement, setEditingMovement] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalItems = movements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Carregar clientes e movimentações
  useEffect(() => {
    clientService.getAll()
      .then(setClients)
      .catch(() => toast.error('Erro ao carregar clientes'));

    movementService.getAll()
      .then(setMovements)
      .catch(() => toast.error('Erro ao carregar movimentações'));
  }, []);

  // Filtro de pesquisa
  const filteredData = movements.filter(m =>
    m.client_name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Métricas
  const totalMovimentacoes = movements.length;
  const valorAcumulado = movements.reduce((acc, m) => acc + Number(m.value), 0);

  const metricsData = [
    { title: 'Nº de Movimentações', value: totalMovimentacoes, icon: BarChart3 },
    { title: 'Valor Acumulado', value: `R$ ${valorAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: BarChart3 },
  ];

  // Seleção
  const handleToggleSelection = (id: number) => {
    setSelectedMovements(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMovements.length === filteredData.length) setSelectedMovements([]);
    else setSelectedMovements(filteredData.map(m => m.id));
  };

  // Excluir selecionados
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedMovements.map(id => movementService.delete(id)));
      setMovements(movements.filter(m => !selectedMovements.includes(m.id)));
      setSelectedMovements([]);
      toast.success('Movimentações excluídas com sucesso!');
    } catch {
      toast.error('Erro ao excluir movimentações');
    }
  };

  // Edição inline
  const handleToggleEdit = async (movement: Movement) => {
    if (editingMovement === movement.id) {
      try {
        const updated = await movementService.update(movement.id, {
          client_id: editForm.client_id,
          type: editForm.type,
          value: Number(editForm.value),
          date: editForm.date,
          notes: editForm.notes,
        });
        setMovements(prev =>
          prev.map(m => (m.id === movement.id ? updated : m))
        );
        setEditingMovement(null);
        setEditForm({});
        toast.success('Movimentação editada com sucesso!');
      } catch {
        toast.error('Erro ao editar movimentação');
      }
    } else {
      setEditingMovement(movement.id);
      setEditForm({ ...movement });
    }
  };

  // Adicionar movimentação
  const handleAddMovement = async (data: MovementCreate) => {
    try {
      const newMov = await movementService.create(data);
      setMovements([...movements, newMov]);
      toast.success('Movimentação criada com sucesso!');
    } catch {
      toast.error('Erro ao criar movimentação');
    }
  };

  // Modal de criação
  function MovementFormModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: (data: MovementCreate) => void }) {
    const [form, setForm] = useState<MovementCreate>({
      client_id: 0,
      type: 'entrada',
      value: 0,
      date: '',
      notes: '',
    });
    const [errors, setErrors] = useState<any>({});

    const validate = () => {
      const errs: any = {};
      if (!form.client_id) errs.client_id = 'Cliente obrigatório';
      if (!form.type) errs.type = 'Tipo obrigatório';
      if (!form.value || isNaN(Number(form.value))) errs.value = 'Valor obrigatório';
      if (!form.date) errs.date = 'Data obrigatória';
      return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length === 0) {
        onSuccess({ ...form, value: Number(form.value) });
        setForm({ client_id: 0, type: 'entrada', value: 0, date: '', notes: '' });
        onClose();
      }
    };

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Cadastrar Movimentação</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Cliente</label>
              <select
                className="w-full border rounded px-3 py-2 bg-card"
                value={form.client_id}
                onChange={e => setForm({ ...form, client_id: Number(e.target.value) })}
              >
                <option value={0}>Selecione o cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo de Movimentação</label>
              <select
                className="w-full border rounded px-3 py-2 bg-card"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as 'entrada' | 'saida' })}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Valor</label>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={e => setForm({ ...form, value: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Data</label>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Notas (opcional)</label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-card"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary">Cadastrar</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <DashboardLayout activeItem="movimentacoes">
        <div className="flex justify-between items-center mb-6">
          <Button
            className="flex items-center gap-2"
            variant="default"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nova Movimentação
          </Button>
        </div>

        <MovementFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleAddMovement}
        />

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Movimentações Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Entradas e saídas de dinheiro
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SearchAndFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue=""
                onFilterChange={() => {}}
              />
              {selectedMovements.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </Button>
              )}
            </div>
          </div>

          {/* Tabela de Movimentações */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedMovements.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-3">Cliente</th>
                  <th className="py-2 px-3">Tipo</th>
                  <th className="py-2 px-3">Valor</th>
                  <th className="py-2 px-3">Data</th>
                  <th className="py-2 px-3">Notas</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(movement => {
                    const isEditing = editingMovement === movement.id;
                    return (
                      <tr key={movement.id} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedMovements.includes(movement.id)}
                            onChange={() => handleToggleSelection(movement.id)}
                          />
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <select
                              className="border rounded px-2 py-1 w-full"
                              value={editForm.client_id}
                              onChange={e => setEditForm({ ...editForm, client_id: Number(e.target.value) })}
                            >
                              <option value={0}>Selecione o cliente</option>
                              {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          ) : (
                            movement.client_name
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <select
                              className="border rounded px-2 py-1 w-full"
                              value={editForm.type}
                              onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                            >
                              <option value="entrada">Entrada</option>
                              <option value="saida">Saída</option>
                            </select>
                          ) : (
                            <span className={movement.type === 'entrada' ? 'text-green-500' : 'text-red-500'}>
                              {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editForm.value}
                              onChange={e => setEditForm({ ...editForm, value: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            `R$ ${Number(movement.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            movement.date
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.notes}
                              onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            movement.notes
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleToggleEdit(movement)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            {isEditing ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Pencil className="w-4 h-4" />
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
