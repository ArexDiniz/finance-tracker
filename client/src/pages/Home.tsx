/* ============================================================
   Home.tsx — Página principal do FinanceTracker
   Design: Minimalismo Orgânico Scandinavian Finance
   Layout: Sidebar fixa + área principal com dashboard/despesas/gráficos
   ============================================================ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { DashboardCards, CategoryBreakdown } from '@/components/DashboardCards';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseTable } from '@/components/ExpenseTable';
import { FilterBar } from '@/components/FilterBar';
import { CategoryPieChart, MonthlyBarChart, DailyAreaChart } from '@/components/Charts';
import { PaymentSummary } from '@/components/PaymentSummary';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { toast } from 'sonner';
import type { Expense } from '@/hooks/useExpenses';

type View = 'dashboard' | 'expenses' | 'charts';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663616738872/jjeLVx4WySJfzumF7UohfQ/finance-hero-hM6b7jeuLKQRQ9sBqLdZjz.webp';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const { addExpense, stats } = useExpenseContext();

  const handleAddExpense = (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    addExpense(data);
    setShowForm(false);
    toast.success(`Despesa "${data.description}" adicionada com sucesso!`);
  };

  const viewTitles: Record<View, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Visão geral das suas finanças',
    },
    expenses: {
      title: 'Despesas',
      subtitle: 'Gerencie e filtre suas despesas',
    },
    charts: {
      title: 'Gráficos',
      subtitle: 'Análise visual dos seus gastos',
    },
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="pl-10 lg:pl-0">
              <h1
                className="text-lg font-bold text-foreground leading-none"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {viewTitles[activeView].title}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {viewTitles[activeView].subtitle}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(v => !v)}
              size="sm"
              className="gap-2 shadow-sm"
            >
              {showForm ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Nova Despesa
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 pb-12 space-y-5 max-w-7xl">

            {/* Add expense form */}
            <AnimatePresence>
              {showForm && (
                <ExpenseForm
                  onSubmit={handleAddExpense}
                  onCancel={() => setShowForm(false)}
                />
              )}
            </AnimatePresence>

            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Hero banner (only when no expenses) */}
                {stats.countAll === 0 && (
                  <div className="finance-card overflow-hidden">
                    <div className="relative h-48 md:h-56">
                      <img
                        src={HERO_IMAGE}
                        alt="FinanceTracker"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center">
                        <div className="px-8">
                          <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                            Bem-vindo ao FinanceTracker
                          </h2>
                          <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            Registre suas despesas, acompanhe seus gastos e tome decisões financeiras mais inteligentes.
                          </p>
                          <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
                            <Plus className="w-3.5 h-3.5" />
                            Adicionar primeira despesa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <DashboardCards />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <CategoryBreakdown />
                  <PaymentSummary />
                </div>

                <MonthlyBarChart />

                {/* Recent expenses */}
                <div className="finance-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                      Despesas Recentes
                    </h3>
                    <button
                      onClick={() => setActiveView('expenses')}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Ver todas →
                    </button>
                  </div>
                  <RecentExpenses />
                </div>
              </motion.div>
            )}

            {/* Expenses View */}
            {activeView === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <FilterBar />
                <ExpenseTable />
              </motion.div>
            )}

            {/* Charts View */}
            {activeView === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <DashboardCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <CategoryPieChart />
                  <MonthlyBarChart />
                </div>
                <DailyAreaChart />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <CategoryBreakdown />
                  <PaymentSummary />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---- Recent Expenses mini-table ---- */
import { formatCurrency, formatDate } from '@/lib/format';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/hooks/useExpenses';

function RecentExpenses() {
  const { expenses } = useExpenseContext();
  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-xs text-muted-foreground">Nenhuma despesa registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {recent.map((expense, i) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
          >
            {CATEGORY_ICONS[expense.category]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
            <p className="text-xs text-muted-foreground">
              {CATEGORY_LABELS[expense.category]} · {formatDate(expense.date)}
            </p>
          </div>
          <span className="finance-number text-sm font-semibold text-foreground shrink-0">
            {formatCurrency(expense.amount)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
