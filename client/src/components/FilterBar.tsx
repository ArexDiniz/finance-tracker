/* ============================================================
   FilterBar — Barra de filtros por data, categoria e pagamento
   Design: Minimalismo Orgânico
   ============================================================ */

import { X, SlidersHorizontal, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type Category,
  type PaymentMethod,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '@/hooks/useExpenses';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { getFirstDayOfMonth, getTodayStr } from '@/lib/format';

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
const paymentMethods = Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][];

export function FilterBar() {
  const { filters, setFilters, filteredExpenses, expenses } = useExpenseContext();

  const hasActiveFilters = !!(
    filters.dateFrom || filters.dateTo || filters.category || filters.paymentMethod
  );

  const clearFilters = () => {
    setFilters({});
  };

  const setThisMonth = () => {
    setFilters(f => ({ ...f, dateFrom: getFirstDayOfMonth(), dateTo: getTodayStr() }));
  };

  const setThisYear = () => {
    const now = new Date();
    setFilters(f => ({
      ...f,
      dateFrom: `${now.getFullYear()}-01-01`,
      dateTo: getTodayStr(),
    }));
  };

  const setLast30 = () => {
    const to = getTodayStr();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    setFilters(f => ({ ...f, dateFrom: from.toISOString().split('T')[0], dateTo: to }));
  };

  const activeCount = [
    filters.dateFrom || filters.dateTo,
    filters.category,
    filters.paymentMethod,
  ].filter(Boolean).length;

  return (
    <div className="finance-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Filter icon + label */}
        <div className="flex items-center gap-2 mr-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filtros</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>

        {/* Date range */}
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">De</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value || undefined }))}
              className="h-8 text-xs w-36"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Até</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value || undefined }))}
              className="h-8 text-xs w-36"
            />
          </div>
        </div>

        {/* Quick date presets */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={setThisMonth} className="h-8 text-xs px-2.5">
            Este mês
          </Button>
          <Button variant="outline" size="sm" onClick={setLast30} className="h-8 text-xs px-2.5">
            30 dias
          </Button>
          <Button variant="outline" size="sm" onClick={setThisYear} className="h-8 text-xs px-2.5">
            Este ano
          </Button>
        </div>

        {/* Category filter */}
        <div className="space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Categoria</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={v => setFilters(f => ({ ...f, category: v === 'all' ? undefined : v as Category }))}
          >
            <SelectTrigger className="h-8 text-xs w-40">
              <SelectValue>
                {filters.category
                  ? <span className="flex items-center gap-1.5">
                      <span>{CATEGORY_ICONS[filters.category as Category]}</span>
                      <span>{CATEGORY_LABELS[filters.category as Category]}</span>
                    </span>
                  : 'Todas'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{CATEGORY_ICONS[key]}</span>
                    <span>{label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment method filter */}
        <div className="space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Pagamento</Label>
          <Select
            value={filters.paymentMethod || 'all'}
            onValueChange={v => setFilters(f => ({ ...f, paymentMethod: v === 'all' ? undefined : v as PaymentMethod }))}
          >
            <SelectTrigger className="h-8 text-xs w-44">
              <SelectValue>
                {filters.paymentMethod
                  ? <span className="flex items-center gap-1.5">
                      <span>{PAYMENT_METHOD_ICONS[filters.paymentMethod as PaymentMethod]}</span>
                      <span>{PAYMENT_METHOD_LABELS[filters.paymentMethod as PaymentMethod]}</span>
                    </span>
                  : 'Todos'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as formas</SelectItem>
              {paymentMethods.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{PAYMENT_METHOD_ICONS[key]}</span>
                    <span>{label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </Button>
        )}

        {/* Results count */}
        <div className="ml-auto text-xs text-muted-foreground">
          <span className="finance-number font-semibold text-foreground">{filteredExpenses.length}</span>
          {' '}de{' '}
          <span className="finance-number font-semibold text-foreground">{expenses.length}</span>
          {' '}despesas
        </div>
      </div>
    </div>
  );
}
