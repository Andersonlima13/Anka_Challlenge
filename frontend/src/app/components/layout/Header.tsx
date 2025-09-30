'use client';

import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">BE</span>
        </div>
        <span className="text-xl font-bold text-foreground">BetterEdge</span>
      </div>

      {/* Center - Avatar with dimensions */}
      <div className="flex flex-col items-center">
        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded mb-2">
          1728 × 92
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            D
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Right side - Theme toggle and logout */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className={theme === 'light' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            <Sun className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            <Moon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
