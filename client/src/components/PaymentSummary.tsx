/* ============================================================
   PaymentSummary — Resumo por forma de pagamento
   Design: Minimalismo Orgânico
   ============================================================ */

import { motion } from 'framer-motion';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHOD_ICONS } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/format';

export function PaymentSummary() {
  const { stats } = useExpenseContext();

  const entries = Object.entries(stats.byPaymentMethod)
    .sort(([, a], [, b]) => b - a);

  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const colors = [
    'bg-primary',
    'bg-[var(--finance-amber)]',
    'bg-[var(--finance-blue)]',
    'bg-[var(--finance-teal)]',
    'bg-[var(--finance-purple)]',
    'bg-[var(--finance-orange)]',
  ];

  if (entries.length === 0) {
    return (
      <div className="finance-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
          Por Forma de Pagamento
        </h3>
        <p className="text-xs text-muted-foreground text-center py-6">Sem dados para o mês atual</p>
      </div>
    );
  }

  return (
    <div className="finance-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Por Forma de Pagamento — Mês Atual
      </h3>

      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-0.5">
        {entries.map(([method, amount], i) => {
          const pct = total > 0 ? (amount / total) * 100 : 0;
          return (
            <motion.div
              key={method}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`h-full ${colors[i % colors.length]} first:rounded-l-full last:rounded-r-full`}
            />
          );
        })}
      </div>

      <div className="space-y-2">
        {entries.map(([method, amount], i) => {
          const pct = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={method} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-foreground">
                <span className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                <span>{PAYMENT_METHOD_ICONS[method as keyof typeof PAYMENT_METHOD_ICONS]}</span>
                <span className="font-medium">{PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS]}</span>
              </span>
              <span className="finance-number text-muted-foreground">
                {formatCurrency(amount)} <span className="text-muted-foreground/60">({pct.toFixed(0)}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
