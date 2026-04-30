/* ============================================================
   Charts — Gráficos de pizza e barras com Recharts
   Design: Minimalismo Orgânico | Paleta sage green + amber
   ============================================================ */

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/format';

const RADIAN = Math.PI / 180;

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
      {label && <p className="font-semibold text-foreground mb-2">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryPieChart() {
  const { stats } = useExpenseContext();

  const data = Object.entries(stats.byCategoryFiltered)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, value]) => ({
      name: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat,
      value,
      color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || '#757575',
      icon: CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || '📦',
    }));

  if (data.length === 0) {
    return (
      <div className="finance-card p-5 h-72 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="finance-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Distribuição por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={CustomPieLabel as any}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', color: 'var(--muted-foreground)' }}>
                {value}
              </span>
            )}
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBarChart() {
  const { stats } = useExpenseContext();

  const data = stats.last6Months.map(m => ({
    name: m.label,
    total: m.total,
  }));

  return (
    <div className="finance-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Gastos por Mês (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif', fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          <Bar dataKey="total" name="Total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyAreaChart() {
  const { stats } = useExpenseContext();

  const data = stats.last30Days
    .filter((_, i) => i % 3 === 0 || stats.last30Days[i].total > 0)
    .map(d => ({
      name: d.date.slice(5), // MM-DD
      total: d.total,
    }));

  return (
    <div className="finance-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Gastos Diários (últimos 30 dias)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            name="Total"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#colorTotal)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--primary)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
