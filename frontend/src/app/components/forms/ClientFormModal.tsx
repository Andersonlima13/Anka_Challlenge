import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

const clientSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  status: z.enum(['ativo', 'inativo'], {
    required_error: 'Selecione o status',
  }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: ClientFormValues) => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ open, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormValues) => {
    try {
      onSuccess(data);
      toast.success('Cliente cadastrado com sucesso!');
      reset();
      onClose();
    } catch (e) {
      toast.error('Erro ao cadastrar cliente.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-black/40 dark:bg-card rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cadastrar Cliente</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input type="text" placeholder="Nome" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input type="email" placeholder="Email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <select
              className="w-full border rounded px-3 py-2 bg-black/40"
              {...register('status')}
            >
              <option value="">Selecione o status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>Cadastrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};