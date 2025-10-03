'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/components/containers/DashboardLayout';
import { MetricCard } from '@/app/components/cards/MetricCard';
import { Button } from '@/app/components/ui/button';
import { SearchAndFilter } from '@/app/components/forms/SearchAndFilter';
import { Pagination } from '@/app/components/forms/Pagination';
import { BarChart3, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { ToastProvider, toast } from '@/app/components/ui/toast';
import { assetService, Asset, AssetCreate, AssetUpdate } from '@/lib/api/services/assetService';

export default function Ativos() {
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [editingAsset, setEditingAsset] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // ================== Fetch Assets ==================
  const fetchAssets = async () => {
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      toast.error('Erro ao carregar ativos');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // ================== CRUD Operations ==================
  const handleAddAsset = async (data: AssetCreate) => {
    try {
      const newAsset = await assetService.create(data);
      setAssets(prev => [...prev, newAsset]);
      toast.success('Ativo criado com sucesso!');
    } catch {
      toast.error('Erro ao criar ativo');
    }
  };

  const handleUpdateAsset = async (assetId: number, data: AssetUpdate) => {
    try {
      const updatedAsset = await assetService.update(assetId, data);
      setAssets(prev => prev.map(a => (a.id === assetId ? updatedAsset : a)));
      toast.success('Ativo atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar ativo');
    }
  };

  const handleDeleteAsset = async (assetId: number) => {
    try {
      await assetService.delete(assetId);
      setAssets(prev => prev.filter(a => a.id !== assetId));
      toast.success('Ativo excluído com sucesso!');
    } catch {
      toast.error('Erro ao excluir ativo');
    }
  };

  // ================== Filtragem e Paginação ==================
  const filteredData = assets.filter(asset =>
    asset.ticker.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.exchange.toLowerCase().includes(searchValue.toLowerCase()) ||
    asset.currency.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const metricsData = [
    { title: 'Total de Ativos', value: assets.length, icon: BarChart3 },
    { title: 'Ativos BRL', value: assets.filter(a => a.currency === 'BRL').length, icon: BarChart3 },
    { title: 'Ativos USD', value: assets.filter(a => a.currency === 'USD').length, icon: BarChart3 },
  ];

  // ================== Seleção ==================
  const handleToggleAssetSelection = (id: number) => {
    setSelectedAssets(prev =>
      prev.includes(id.toString()) ? prev.filter(t => t !== id.toString()) : [...prev, id.toString()]
    );
  };
  const handleSelectAll = () => {
    if (selectedAssets.length === filteredData.length) setSelectedAssets([]);
    else setSelectedAssets(filteredData.map(a => a.id.toString()));
  };
  const handleDeleteSelected = async () => {
    for (let id of selectedAssets) await handleDeleteAsset(Number(id));
    setSelectedAssets([]);
  };

  // ================== Edição inline ==================
  const handleToggleEdit = (asset: Asset) => {
    if (editingAsset === asset.id) {
      handleUpdateAsset(asset.id, editForm);
      setEditingAsset(null);
      setEditForm({});
    } else {
      setEditingAsset(asset.id);
      setEditForm({ ...asset });
    }
  };

  // ================== Modal ==================
  function AssetFormModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: (data: AssetCreate) => void }) {
    const [form, setForm] = useState<AssetCreate>({ ticker: '', name: '', exchange: '', currency: '' });
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
            {['ticker','name','exchange','currency'].map(field => (
              <div key={field}>
                <input
                  className="w-full border rounded px-3 py-2 bg-card"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field as keyof AssetCreate]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
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
          <Button className="flex items-center gap-2" variant="default" onClick={() => setShowAssetModal(true)}>
            <Plus className="w-4 h-4" /> Criar Ativo
          </Button>
        </div>

        <AssetFormModal open={showAssetModal} onClose={() => setShowAssetModal(false)} onSuccess={handleAddAsset} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <MetricCard key={index} title={metric.title} value={metric.value} icon={metric.icon} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lista de Ativos</h1>
              <p className="text-sm text-muted-foreground mt-1">Informações dos ativos cadastrados</p>
            </div>
            <div className="flex items-center gap-3">
              <SearchAndFilter searchValue={searchValue} onSearchChange={setSearchValue} filterValue="" onFilterChange={() => {}} />
              {selectedAssets.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Excluir Ativos
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="py-2 px-3">
                    <input type="checkbox" checked={selectedAssets.length === filteredData.length && filteredData.length > 0} onChange={handleSelectAll} />
                  </th>
                  <th className="py-2 px-3">Ticker</th>
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Exchange</th>
                  <th className="py-2 px-3">Moeda</th>
                  <th className="py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(asset => {
                  const isEditing = editingAsset === asset.id;
                  return (
                    <tr key={asset.id} className="border-b border-border last:border-0 text-foreground">
                      <td className="py-2 px-3">
                        <input type="checkbox" checked={selectedAssets.includes(asset.id.toString())} onChange={() => handleToggleAssetSelection(asset.id)} />
                      </td>
                      {['ticker','name','exchange','currency'].map(field => (
                        <td key={field} className="py-2 px-3">
                          {isEditing ? (
                            <input value={editForm[field]} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} className="border rounded px-2 py-1 w-full" />
                          ) : (
                            asset[field as keyof Asset]
                          )}
                        </td>
                      ))}
                      <td className="py-2 px-3">
                        <button onClick={() => handleToggleEdit(asset)} className="p-1 rounded hover:bg-muted">
                          {isEditing ? <Check className="w-4 h-4 text-green-500" /> : <Pencil className="w-4 h-4 text-white-500" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </div>
      </DashboardLayout>
    </ToastProvider>
  );
}
