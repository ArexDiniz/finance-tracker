/* ============================================================
   ExpenseTable — Tabela de despesas com edição, exclusão e ordenação
   Design: Minimalismo Orgânico | Framer Motion para animações
   ============================================================ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  Search, X, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  type Expense,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/lib/format';
import { ExpenseForm } from './ExpenseForm';
import { useExpenseContext } from '@/contexts/ExpenseContext';

type SortField = 'date' | 'description' | 'amount' | 'category';
type SortDir = 'asc' | 'desc';

export function ExpenseTable() {
  const { filteredExpenses, updateExpense, deleteExpense, filters, setFilters } = useExpenseContext();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const sorted = [...filteredExpenses].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
    else if (sortField === 'amount') cmp = a.amount - b.amount;
    else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const editingExpense = editingId ? filteredExpenses.find(e => e.id === editingId) : null;
  const deletingExpense = deletingId ? filteredExpenses.find(e => e.id === deletingId) : null;

  const handleEdit = (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingId) {
      updateExpense(editingId, data);
      setEditingId(null);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteExpense(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar despesas..."
          value={filters.search || ''}
          onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
          className="pl-9 pr-9"
        />
        {filters.search && (
          <button
            onClick={() => setFilters(f => ({ ...f, search: '' }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Edit form inline */}
      <AnimatePresence>
        {editingId && editingExpense && (
          <ExpenseForm
            initialValues={editingExpense}
            isEditing
            onSubmit={handleEdit}
            onCancel={() => setEditingId(null)}
          />
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="finance-card overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Nenhuma despesa encontrada</p>
            <p className="text-xs text-muted-foreground">
              {Object.values(filters).some(Boolean)
                ? 'Tente ajustar os filtros aplicados'
                : 'Adicione sua primeira despesa usando o botão acima'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                      >
                        Data <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => handleSort('description')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                      >
                        Descrição <SortIcon field="description" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                      >
                        Categoria <SortIcon field="category" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Pagamento
                      </span>
                    </th>
                    <th className="text-right px-4 py-3">
                      <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors ml-auto"
                      >
                        Valor <SortIcon field="amount" />
                      </button>
                    </th>
                    <th className="text-right px-4 py-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Ações
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {paginated.map((expense, i) => (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15, delay: i * 0.02 }}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono whitespace-nowrap">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">{expense.description}</p>
                            {expense.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-48">{expense.notes}</p>
                            )}
                            {/* Mobile: show category and payment */}
                            <div className="flex items-center gap-2 mt-1 md:hidden">
                              <span className="text-xs text-muted-foreground">
                                {CATEGORY_ICONS[expense.category]} {CATEGORY_LABELS[expense.category]}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">
                                {PAYMENT_METHOD_ICONS[expense.paymentMethod]} {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className="category-badge text-white"
                            style={{ backgroundColor: CATEGORY_COLORS[expense.category] + 'dd' }}
                          >
                            <span>{CATEGORY_ICONS[expense.category]}</span>
                            <span>{CATEGORY_LABELS[expense.category]}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <span>{PAYMENT_METHOD_ICONS[expense.paymentMethod]}</span>
                            <span>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="finance-number text-sm font-semibold text-foreground">
                            {formatCurrency(expense.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingId(expense.id)}
                              className="w-7 h-7 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(expense.id)}
                              className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} de {sorted.length} despesas
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-7 px-2 text-xs"
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = page <= 3 ? i + 1 : page + i - 2;
                    if (p < 1 || p > totalPages) return null;
                    return (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(p)}
                        className="h-7 w-7 p-0 text-xs"
                      >
                        {p}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-7 px-2 text-xs"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <DialogTitle className="text-base">Excluir despesa</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Tem certeza que deseja excluir{' '}
              <strong className="text-foreground">"{deletingExpense?.description}"</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
