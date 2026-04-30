/* ============================================================
   ExpenseForm — Formulário de adição/edição de despesas
   Design: Minimalismo Orgânico | Validação com react-hook-form + zod
   ============================================================ */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Category,
  type PaymentMethod,
  type Expense,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '@/hooks/useExpenses';
import { getTodayStr } from '@/lib/format';

const schema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(100, 'Máximo 100 caracteres'),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(v => !isNaN(parseFloat(v.replace(',', '.'))) && parseFloat(v.replace(',', '.')) > 0, {
      message: 'Valor deve ser maior que zero',
    }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  paymentMethod: z.string().min(1, 'Forma de pagamento é obrigatória'),
  notes: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

type FormValues = z.infer<typeof schema>;

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialValues?: Expense;
  isEditing?: boolean;
}

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
const paymentMethods = Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][];

export function ExpenseForm({ onSubmit, onCancel, initialValues, isEditing }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: initialValues?.description || '',
      amount: initialValues?.amount ? initialValues.amount.toFixed(2).replace('.', ',') : '',
      category: initialValues?.category || '',
      date: initialValues?.date || getTodayStr(),
      paymentMethod: initialValues?.paymentMethod || '',
      notes: initialValues?.notes || '',
    },
  });

  const selectedCategory = watch('category');
  const selectedPayment = watch('paymentMethod');

  const handleFormSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount.replace(',', '.'));
    onSubmit({
      description: values.description,
      amount,
      category: values.category as Category,
      date: values.date,
      paymentMethod: values.paymentMethod as PaymentMethod,
      notes: values.notes || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            {isEditing ? (
              <Save className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-primary" />
            )}
          </div>
          <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Descrição */}
          <div className="lg:col-span-2 space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Descrição *
            </Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante"
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.description.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Valor */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Valor (R$) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">R$</span>
              <Input
                id="amount"
                placeholder="0,00"
                className={`pl-9 font-mono ${errors.amount ? 'border-destructive' : ''}`}
                {...register('amount')}
              />
            </div>
            <AnimatePresence>
              {errors.amount && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Categoria *
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={v => setValue('category', v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione...">
                  {selectedCategory && (
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[selectedCategory as Category]}</span>
                      <span>{CATEGORY_LABELS[selectedCategory as Category]}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
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
            <AnimatePresence>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.category.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Data */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Data *
            </Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className={errors.date ? 'border-destructive' : ''}
            />
            <AnimatePresence>
              {errors.date && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.date.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Forma de pagamento */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Forma de Pagamento *
            </Label>
            <Select
              value={selectedPayment}
              onValueChange={v => setValue('paymentMethod', v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione...">
                  {selectedPayment && (
                    <span className="flex items-center gap-2">
                      <span>{PAYMENT_METHOD_ICONS[selectedPayment as PaymentMethod]}</span>
                      <span>{PAYMENT_METHOD_LABELS[selectedPayment as PaymentMethod]}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
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
            <AnimatePresence>
              {errors.paymentMethod && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.paymentMethod.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Notas */}
          <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Detalhes adicionais..."
              rows={2}
              {...register('notes')}
              className="resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onCancel} size="sm">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} size="sm" className="gap-2">
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Adicionar Despesa
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
