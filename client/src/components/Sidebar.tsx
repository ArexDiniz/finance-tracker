/* ============================================================
   Sidebar — Navegação lateral fixa
   Design: Minimalismo Orgânico | Sage green sidebar
   ============================================================ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, List, BarChart2, Settings, Moon, Sun,
  Download, Upload, Trash2, Menu, X, TrendingDown, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { toast } from 'sonner';

type View = 'dashboard' | 'expenses' | 'charts';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'expenses', label: 'Despesas', icon: <List className="w-4 h-4" /> },
  { id: 'charts', label: 'Gráficos', icon: <BarChart2 className="w-4 h-4" /> },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { exportCSV, importCSV, clearAll, expenses } = useExpenseContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const result = await importCSV(file);
      toast.success(`Importação concluída: ${result.imported} despesas importadas${result.errors > 0 ? `, ${result.errors} erros` : ''}`);
    };
    input.click();
  };

  const handleExport = () => {
    exportCSV();
    toast.success('Arquivo CSV exportado com sucesso!');
  };

  const handleClearAll = () => {
    clearAll();
    setClearDialogOpen(false);
    toast.success('Todos os dados foram removidos.');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <TrendingDown className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>
              FinanceTracker
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Controle Financeiro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Navegação
        </p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { onViewChange(item.id); setMobileOpen(false); }}
            className={`sidebar-link w-full ${activeView === item.id ? 'active' : 'text-sidebar-foreground'}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {activeView === item.id && (
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
            )}
          </button>
        ))}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Dados
          </p>
          <button
            onClick={handleExport}
            disabled={expenses.length === 0}
            className="sidebar-link w-full text-sidebar-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handleImport}
            className="sidebar-link w-full text-sidebar-foreground"
          >
            <Upload className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
          <button
            onClick={() => setClearDialogOpen(true)}
            disabled={expenses.length === 0}
            className="sidebar-link w-full text-sidebar-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Dados</span>
          </button>
        </div>
      </nav>

      {/* Bottom: theme toggle */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={toggleTheme}
          className="sidebar-link w-full text-sidebar-foreground"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />}
          <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Dados salvos localmente
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl bg-sidebar border border-sidebar-border shadow-md flex items-center justify-center text-sidebar-foreground"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-sidebar border-r border-sidebar-border"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Clear all dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <DialogTitle className="text-base">Limpar todos os dados</DialogTitle>
            </div>
            <DialogDescription>
              Esta ação irá remover permanentemente todas as <strong>{expenses.length} despesas</strong> registradas.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setClearDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              Limpar tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
