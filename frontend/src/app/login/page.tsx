'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast, ToastProvider } from '@/app/components/ui/toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de login (substitua pela lógica real)
    if (form.email === '' || form.password === '') {
      toast.error('Preencha todos os campos.');
      setLoading(false);
      return;
    }
    // Simulação de sucesso
    setTimeout(() => {
      toast.success('Login realizado com sucesso!');
      setLoading(false);
      // Redirecionar ou atualizar estado global aqui
    }, 1000);
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