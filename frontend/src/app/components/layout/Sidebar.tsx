'use client';

import { Button } from '@/app/components/ui/button';
import { 
  Settings, 
  BarChart3, 
  Package, 
  CheckSquare, 
  HelpCircle 
} from 'lucide-react';
import Link from 'next/link';
import { Users, User, Briefcase, Repeat } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'dashboard' }: SidebarProps) {
 const menuItems = [
  { id: 'usuarios', label: 'Usuários', icon: Users, href: '/usuarios' },
  { id: 'clientes', label: 'Clientes', icon: User, href: '/clientes' },
  { id: 'ativos', label: 'Ativos', icon: Briefcase, href: '/ativos' },
  { id: 'movimentacoes', label: 'Movimentações', icon: Repeat, href: '/movimentacoes' },
];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
  const Icon = item.icon;
  const isActive = activeItem === item.id;
  return (
    <Link key={item.id} href={item.href} className="block">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <Icon className="w-4 h-4 mr-3" />
        {item.label}
      </Button>
    </Link>
  );
})}
      </nav>
    </aside>
  );
}
