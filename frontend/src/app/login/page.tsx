'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast, ToastProvider } from '@/app/components/ui/toast';
import { authService } from '@/lib/api/services/authService';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('unauthorized') === '1') {
      toast.error('Você precisa estar logado para acessar essa página.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.email || !form.password) {
      toast.error('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      await authService.login(form); // 🔥 chamada real à API
      toast.success('Login realizado com sucesso!');
      router.push('/usuarios'); // ✅ redirecionamento após login
    } catch (err: any) {
      console.error('Erro ao logar:', err);
      const message =
        err.response?.data?.detail || 'Email ou senha incorretos.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-lg shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Senha"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ToastProvider>
  );
}
