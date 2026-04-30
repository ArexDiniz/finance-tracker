/* ============================================================
   DashboardCards — Cards de resumo financeiro no topo
   Design: Minimalismo Orgânico | Framer Motion stagger
   ============================================================ */

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Receipt, Calendar, BarChart3, Wallet
} from 'lucide-react';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { formatCurrency, formatMonthYear, getCurrentMonthStr } from '@/lib/format';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/hooks/useExpenses';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

export function DashboardCards() {
  const { stats } = useExpenseContext();
  const currentMonth = formatMonthYear(getCurrentMonthStr());

  const topCategory = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)[0];

  const cards = [
    {
      label: `Total em ${currentMonth}`,
      value: formatCurrency(stats.totalThisMonth),
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-primary',
      bg: 'bg-primary/8',
      sub: stats.monthlyChange !== 0 ? (
        <span className={`flex items-center gap-1 text-xs ${stats.monthlyChange > 0 ? 'text-destructive' : 'text-primary'}`}>
          {stats.monthlyChange > 0
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />}
          {Math.abs(stats.monthlyChange).toFixed(1)}% vs mês anterior
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Minus className="w-3 h-3" /> Sem comparativo
        </span>
      ),
    },
    {
      label: 'Despesas no Mês',
      value: stats.countThisMonth.toString(),
      icon: <Receipt className="w-4 h-4" />,
      color: 'text-[var(--finance-blue)]',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      sub: <span className="text-xs text-muted-foreground">Média: {formatCurrency(stats.avgThisMonth)}</span>,
    },
    {
      label: 'Total Geral',
      value: formatCurrency(stats.totalAll),
      icon: <Wallet className="w-4 h-4" />,
      color: 'text-[var(--finance-amber)]',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      sub: <span className="text-xs text-muted-foreground">{stats.countAll} despesas registradas</span>,
    },
    {
      label: 'Maior Categoria',
      value: topCategory ? CATEGORY_LABELS[topCategory[0] as keyof typeof CATEGORY_LABELS] : '—',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-[var(--finance-purple)]',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      sub: topCategory ? (
        <span className="text-xs text-muted-foreground">
          {CATEGORY_ICONS[topCategory[0] as keyof typeof CATEGORY_ICONS]} {formatCurrency(topCategory[1])} este mês
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">Sem dados</span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="finance-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground leading-tight">{card.label}</p>
            <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <p className={`finance-number text-xl font-bold ${card.color} leading-none`}>
            {card.value}
          </p>
          {card.sub}
        </motion.div>
      ))}
    </div>
  );
}

export function CategoryBreakdown() {
  const { stats } = useExpenseContext();

  const entries = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (entries.length === 0) {
    return (
      <div className="finance-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
          Gastos por Categoria
        </h3>
        <p className="text-xs text-muted-foreground text-center py-6">Sem dados para o mês atual</p>
      </div>
    );
  }

  return (
    <div className="finance-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Gastos por Categoria — Mês Atual
      </h3>
      <div className="space-y-2.5">
        {entries.map(([cat, amount], i) => {
          const pct = total > 0 ? (amount / total) * 100 : 0;
          const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS];
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <span>{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                  <span>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
                </span>
                <span className="finance-number text-muted-foreground">
                  {formatCurrency(amount)} <span className="text-muted-foreground/60">({pct.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
