import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

export const StatCard = ({
  label,
  value,
  delta,
  icon,
  accent = 'green',
}: {
  label: string;
  value: string;
  delta?: number;
  icon?: ReactNode;
  accent?: 'green' | 'magenta' | 'ember' | 'sun';
}) => {
  const accents = {
    green: 'text-green bg-green/10',
    magenta: 'text-magenta bg-magenta/10',
    ember: 'text-ember bg-ember/10',
    sun: 'text-sun-600 bg-sun/15',
  };
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {icon && <span className={cn('rounded-lg p-2', accents[accent])}>{icon}</span>}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      {typeof delta === 'number' && (
        <p
          className={cn(
            'mt-1.5 inline-flex items-center gap-1 text-xs font-semibold',
            delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-magenta',
          )}
        >
          {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(delta)}% vs last month
        </p>
      )}
    </div>
  );
};
