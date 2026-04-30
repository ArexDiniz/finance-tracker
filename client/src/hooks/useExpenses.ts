/* ============================================================
   useExpenses — Hook principal de gerenciamento de despesas
   Persistência: localStorage | Formato: JSON
   ============================================================ */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';

export type Category =
  | 'alimentacao'
  | 'transporte'
  | 'lazer'
  | 'contas'
  | 'saude'
  | 'educacao'
  | 'moradia'
  | 'vestuario'
  | 'tecnologia'
  | 'outros';

export type PaymentMethod =
  | 'dinheiro'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'pix'
  | 'transferencia'
  | 'boleto';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO date string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: Category | 'all';
  paymentMethod?: PaymentMethod | 'all';
  search?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  lazer: 'Lazer',
  contas: 'Contas',
  saude: 'Saúde',
  educacao: 'Educação',
  moradia: 'Moradia',
  vestuario: 'Vestuário',
  tecnologia: 'Tecnologia',
  outros: 'Outros',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: '#2D6A4F',
  transporte: '#1E88E5',
  lazer: '#8E24AA',
  contas: '#D97706',
  saude: '#E53935',
  educacao: '#00897B',
  moradia: '#F4511E',
  vestuario: '#D81B60',
  tecnologia: '#3949AB',
  outros: '#757575',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  alimentacao: '🍽️',
  transporte: '🚗',
  lazer: '🎮',
  contas: '📄',
  saude: '🏥',
  educacao: '📚',
  moradia: '🏠',
  vestuario: '👕',
  tecnologia: '💻',
  outros: '📦',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  pix: 'PIX',
  transferencia: 'Transferência',
  boleto: 'Boleto',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  dinheiro: '💵',
  cartao_credito: '💳',
  cartao_debito: '🏧',
  pix: '⚡',
  transferencia: '🔄',
  boleto: '📋',
};

const STORAGE_KEY = 'finance-tracker-expenses';

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

function saveToStorage(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage());
  const [filters, setFilters] = useState<ExpenseFilters>({});

  // Persist on change
  useEffect(() => {
    saveToStorage(expenses);
  }, [expenses]);

  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const expense: Expense = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    setExpenses(prev => [expense, ...prev]);
    return expense;
  }, []);

  const updateExpense = useCallback((id: string, data: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    setExpenses(prev =>
      prev.map(e =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const deleteMultiple = useCallback((ids: string[]) => {
    setExpenses(prev => prev.filter(e => !ids.includes(e.id)));
  }, []);

  const clearAll = useCallback(() => {
    setExpenses([]);
  }, []);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (filters.dateFrom && e.date < filters.dateFrom) return false;
      if (filters.dateTo && e.date > filters.dateTo) return false;
      if (filters.category && filters.category !== 'all' && e.category !== filters.category) return false;
      if (filters.paymentMethod && filters.paymentMethod !== 'all' && e.paymentMethod !== filters.paymentMethod) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!e.description.toLowerCase().includes(q) && !e.notes?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonth = now.getMonth() === 0
      ? `${now.getFullYear() - 1}-12`
      : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;

    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const prevMonthExpenses = expenses.filter(e => e.date.startsWith(prevMonth));

    const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPrevMonth = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0);

    // By category (this month)
    const byCategory: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    // By category (all filtered)
    const byCategoryFiltered: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      byCategoryFiltered[e.category] = (byCategoryFiltered[e.category] || 0) + e.amount;
    });

    // By payment method (this month)
    const byPaymentMethod: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      byPaymentMethod[e.paymentMethod] = (byPaymentMethod[e.paymentMethod] || 0) + e.amount;
    });

    // By day (last 30 days)
    const last30Days: { date: string; total: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const total = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      last30Days.push({ date: dateStr, total });
    }

    // By month (last 6 months)
    const last6Months: { month: string; label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const total = expenses
        .filter(e => e.date.startsWith(monthStr))
        .reduce((sum, e) => sum + e.amount, 0);
      last6Months.push({ month: monthStr, label: monthNames[d.getMonth()], total });
    }

    const monthlyChange = totalPrevMonth > 0
      ? ((totalThisMonth - totalPrevMonth) / totalPrevMonth) * 100
      : 0;

    return {
      totalThisMonth,
      totalPrevMonth,
      totalAll,
      monthlyChange,
      byCategory,
      byCategoryFiltered,
      byPaymentMethod,
      last30Days,
      last6Months,
      countThisMonth: thisMonthExpenses.length,
      countAll: expenses.length,
      avgThisMonth: thisMonthExpenses.length > 0 ? totalThisMonth / thisMonthExpenses.length : 0,
    };
  }, [expenses, filteredExpenses]);

  // CSV Export
  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Descrição', 'Valor', 'Categoria', 'Data', 'Forma de Pagamento', 'Notas', 'Criado em'];
    const rows = expenses.map(e => [
      e.id,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      CATEGORY_LABELS[e.category],
      e.date,
      PAYMENT_METHOD_LABELS[e.paymentMethod],
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      e.createdAt,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `despesas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [expenses]);

  // CSV Import
  const importCSV = useCallback((file: File): Promise<{ imported: number; errors: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(Boolean);
        if (lines.length < 2) { resolve({ imported: 0, errors: 0 }); return; }

        let imported = 0;
        let errors = 0;
        const newExpenses: Expense[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const cols = lines[i].split(',');
            if (cols.length < 6) { errors++; continue; }
            const amount = parseFloat(cols[2]);
            if (isNaN(amount)) { errors++; continue; }

            const catLabel = cols[3]?.replace(/"/g, '').trim();
            const category = (Object.entries(CATEGORY_LABELS).find(([, v]) => v === catLabel)?.[0] || 'outros') as Category;
            const pmLabel = cols[5]?.replace(/"/g, '').trim();
            const paymentMethod = (Object.entries(PAYMENT_METHOD_LABELS).find(([, v]) => v === pmLabel)?.[0] || 'dinheiro') as PaymentMethod;

            const now = new Date().toISOString();
            newExpenses.push({
              id: nanoid(),
              description: cols[1]?.replace(/"/g, '').trim() || 'Importado',
              amount,
              category,
              date: cols[4]?.trim() || now.split('T')[0],
              paymentMethod,
              notes: cols[6]?.replace(/"/g, '').trim(),
              createdAt: now,
              updatedAt: now,
            });
            imported++;
          } catch {
            errors++;
          }
        }

        setExpenses(prev => [...newExpenses, ...prev]);
        resolve({ imported, errors });
      };
      reader.readAsText(file, 'UTF-8');
    });
  }, []);

  return {
    expenses,
    filteredExpenses,
    filters,
    setFilters,
    stats,
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMultiple,
    clearAll,
    exportCSV,
    importCSV,
  };
}
