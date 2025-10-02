'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { BarChart3, TrendingUp, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { ToastProvider, toast } from '@/app/components/ui/toast';

// Mock inicial de ativos
const mockAssetsData = [
  { ticker: 'PETR4', name: 'Petrobras PN', exchange: 'B3', currency: 'BRL' },
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', currency: 'USD' },
  { ticker: 'VALE3', name: 'Vale ON', exchange: 'B3', currency: 'BRL' },
  { ticker: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', currency: 'USD' },
];

export default function Ativos() {
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assets, setAssets] = useState(mockAssetsData);
  const [searchValue, setSearchValue] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalItems = assets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredData = assets.filter(asset =>
    asset.ticker.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.exchange.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.currency.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Métricas de exemplo (pode adaptar para métricas reais de ativos)
  const metricsData = [
    { title: 'Total de Ativos', value: assets.length, icon: BarChart3 },
    { title: 'Ativos BRL', value: assets.filter(a => a.currency === 'BRL').length, icon: BarChart3 },
    { title: 'Ativos USD', value: assets.filter(a => a.currency === 'USD').length, icon: BarChart3 },
  ];

  // Seleção de ativos
  const handleToggleAssetSelection = (ticker: string) => {
    setSelectedAssets(prev =>
      prev.includes(ticker) ? prev.filter(t => t !== ticker) : [...prev, ticker]
    );
  };
  const handleSelectAll = () => {
    if (selectedAssets.length === filteredData.length) setSelectedAssets([]);
    else setSelectedAssets(filteredData.map(a => a.ticker));
  };

  // Excluir ativos selecionados
  const handleDeleteSelected = () => {
    setAssets(assets.filter(a => !selectedAssets.includes(a.ticker)));
    setSelectedAssets([]);
    toast.success('Ativos excluídos com sucesso!');
  };

  // Edição inline
  const handleToggleEdit = (asset: any) => {
    if (editingAsset === asset.ticker) {
      // Confirmar edição
      setAssets(prev =>
        prev.map(a => (a.ticker === asset.ticker ? { ...a, ...editForm } : a))
      );
      setEditingAsset(null);
      setEditForm({});
      toast.success('Ativo editado com sucesso!');
    } else {
      // Ativar modo edição com valores atuais
      setEditingAsset(asset.ticker);
      setEditForm({ ...asset });
    }
  };

  // Adicionar novo ativo
  const handleAddAsset = (data: { ticker: string; name: string; exchange: string; currency: string }) => {
    setAssets([
      ...assets,
      {
        ticker: data.ticker,
        name: data.name,
        exchange: data.exchange,
        currency: data.currency,
      },
    ]);
    toast.success('Ativo criado com sucesso!');
  };

  // Modal de criação de ativo (inline para simplicidade)
  function AssetFormModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: (data: any) => void }) {
    const [form, setForm] = useState({ ticker: '', name: '', exchange: '', currency: '' });
    const [errors, setErrors] = useState<any>({});

    const validate = () => {
      const errs: any = {};
      if (!form.ticker) errs.ticker = 'Ticker obrigatório';
      if (!form.name) errs.name = 'Nome obrigatório';
      if (!form.exchange) errs.exchange = 'Exchange obrigatória';
      if (!form.currency) errs.currency = 'Moeda obrigatória';
      return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length === 0) {
        onSuccess(form);
        setForm({ ticker: '', name: '', exchange: '', currency: '' });
        onClose();
      }
    };

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Cadastrar Ativo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                placeholder="Ticker"
                value={form.ticker}
                onChange={e => setForm({ ...form, ticker: e.target.value })}
              />
              {errors.ticker && <p className="text-red-500 text-xs mt-1">{errors.ticker}</p>}
            </div>
            <div>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                placeholder="Nome"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                placeholder="Exchange"
                value={form.exchange}
                onChange={e => setForm({ ...form, exchange: e.target.value })}
              />
              {errors.exchange && <p className="text-red-500 text-xs mt-1">{errors.exchange}</p>}
            </div>
            <div>
              <input
                className="w-full border rounded px-3 py-2 bg-card"
                placeholder="Moeda"
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
              />
              {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency}</p>}
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
      <DashboardLayout activeItem="ativos">
        <div className="flex justify-between items-center mb-6">
          <Button
            className="flex items-center gap-2"
            variant="default"
            onClick={() => setShowAssetModal(true)}
          >
            <Plus className="w-4 h-4" />
            Criar Ativo
          </Button>
        </div>

        <AssetFormModal
          open={showAssetModal}
          onClose={() => setShowAssetModal(false)}
          onSuccess={handleAddAsset}
        />

        {/* Cards de métricas */}
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

        {/* Ativos Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lista de Ativos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Informações dos ativos cadastrados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SearchAndFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue=""
                onFilterChange={() => {}}
              />
              {selectedAssets.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Ativos
                </Button>
              )}
            </div>
          </div>

          {/* Tabela de Ativos */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-3">Ticker</th>
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Exchange</th>
                  <th className="py-2 px-3">Moeda</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((asset, idx) => {
                    const isEditing = editingAsset === asset.ticker;
                    return (
                      <tr key={idx} className="border-b border-border last:border-0 text-foreground">
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedAssets.includes(asset.ticker)}
                            onChange={() => handleToggleAssetSelection(asset.ticker)}
                          />
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.ticker}
                              onChange={e => setEditForm({ ...editForm, ticker: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            asset.ticker
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            asset.name
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.exchange}
                              onChange={e => setEditForm({ ...editForm, exchange: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            asset.exchange
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              value={editForm.currency}
                              onChange={e => setEditForm({ ...editForm, currency: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            asset.currency
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleToggleEdit(asset)}
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