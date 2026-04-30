/* ============================================================
   seedData.ts — Dados de exemplo para demonstração
   ============================================================ */

import { nanoid } from 'nanoid';
import type { Expense } from '@/hooks/useExpenses';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const SEED_EXPENSES: Expense[] = [
  { id: nanoid(), description: 'Supermercado Extra', amount: 287.50, category: 'alimentacao', date: daysAgo(1), paymentMethod: 'cartao_debito', notes: 'Compras da semana', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Uber para o trabalho', amount: 23.90, category: 'transporte', date: daysAgo(1), paymentMethod: 'pix', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Conta de luz', amount: 145.00, category: 'contas', date: daysAgo(2), paymentMethod: 'boleto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Cinema com amigos', amount: 68.00, category: 'lazer', date: daysAgo(3), paymentMethod: 'cartao_credito', notes: 'Filme + pipoca', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Farmácia', amount: 89.70, category: 'saude', date: daysAgo(4), paymentMethod: 'pix', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Aluguel', amount: 1800.00, category: 'moradia', date: daysAgo(5), paymentMethod: 'transferencia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Restaurante japonês', amount: 156.00, category: 'alimentacao', date: daysAgo(5), paymentMethod: 'cartao_credito', notes: 'Jantar comemorativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Spotify Premium', amount: 21.90, category: 'tecnologia', date: daysAgo(6), paymentMethod: 'cartao_credito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Gasolina', amount: 180.00, category: 'transporte', date: daysAgo(7), paymentMethod: 'dinheiro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Curso de inglês', amount: 350.00, category: 'educacao', date: daysAgo(8), paymentMethod: 'boleto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Camiseta nova', amount: 89.90, category: 'vestuario', date: daysAgo(9), paymentMethod: 'cartao_credito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Padaria', amount: 35.50, category: 'alimentacao', date: daysAgo(10), paymentMethod: 'dinheiro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Conta de internet', amount: 99.90, category: 'contas', date: daysAgo(12), paymentMethod: 'boleto', notes: 'Vivo Fibra 300MB', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Academia', amount: 120.00, category: 'saude', date: daysAgo(13), paymentMethod: 'cartao_debito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'iFood - Pizza', amount: 72.50, category: 'alimentacao', date: daysAgo(14), paymentMethod: 'cartao_credito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Ônibus mensal', amount: 180.00, category: 'transporte', date: daysAgo(15), paymentMethod: 'cartao_debito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Livro - Clean Code', amount: 79.90, category: 'educacao', date: daysAgo(17), paymentMethod: 'pix', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Happy hour', amount: 95.00, category: 'lazer', date: daysAgo(18), paymentMethod: 'dinheiro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Supermercado Pão de Açúcar', amount: 312.80, category: 'alimentacao', date: daysAgo(22), paymentMethod: 'cartao_debito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Netflix', amount: 39.90, category: 'tecnologia', date: daysAgo(25), paymentMethod: 'cartao_credito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Consulta médica', amount: 250.00, category: 'saude', date: daysAgo(28), paymentMethod: 'pix', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Conta de água', amount: 65.40, category: 'contas', date: daysAgo(30), paymentMethod: 'boleto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // Mês anterior
  { id: nanoid(), description: 'Supermercado', amount: 265.00, category: 'alimentacao', date: daysAgo(35), paymentMethod: 'cartao_debito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Aluguel', amount: 1800.00, category: 'moradia', date: daysAgo(36), paymentMethod: 'transferencia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Gasolina', amount: 160.00, category: 'transporte', date: daysAgo(38), paymentMethod: 'dinheiro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Jantar restaurante', amount: 130.00, category: 'alimentacao', date: daysAgo(40), paymentMethod: 'cartao_credito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Conta de luz', amount: 138.00, category: 'contas', date: daysAgo(42), paymentMethod: 'boleto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: nanoid(), description: 'Show de música', amount: 180.00, category: 'lazer', date: daysAgo(45), paymentMethod: 'pix', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export function seedLocalStorage() {
  const key = 'finance-tracker-expenses';
  const existing = localStorage.getItem(key);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(key, JSON.stringify(SEED_EXPENSES));
    return true;
  }
  return false;
}
