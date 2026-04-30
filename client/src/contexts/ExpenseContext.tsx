/* ============================================================
   ExpenseContext — Contexto global de despesas
   ============================================================ */

import React, { createContext, useContext } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { seedLocalStorage } from '@/lib/seedData';

// Seed on module load (before first render)
seedLocalStorage();

type ExpenseContextType = ReturnType<typeof useExpenses>;

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const value = useExpenses();
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenseContext() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenseContext must be used within ExpenseProvider');
  return ctx;
}
