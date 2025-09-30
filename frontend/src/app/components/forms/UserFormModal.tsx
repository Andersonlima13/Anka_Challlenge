import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';




const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  status: z.enum(['ativo', 'inativo'], {
    required_error: 'Selecione o status',
  }),
});







type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: UserFormValues) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ open, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      // Simulação de sucesso
      onSuccess(data);
      toast.success('Usuário cadastrado com sucesso!');
      reset();
      onClose();
    } catch (e) {
      toast.error('Erro ao cadastrar usuário.');
    }
  };

  if (!open) return null;

  return (


    

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-black/40 dark:bg-card rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cadastrar Usuário</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input type="email" placeholder="Email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Senha" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
