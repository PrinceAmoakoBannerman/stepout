import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'muted';

const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-fg border-line',
  brand: 'bg-green/10 text-green border-green/25',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400',
  warning: 'bg-sun/15 text-sun-600 border-sun/30',
  danger: 'bg-magenta/10 text-magenta border-magenta/25',
  muted: 'bg-transparent text-muted border-line',
};

export const Badge = ({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
      tones[tone],
      className,
    )}
  >
    {children}
  </span>
);

export const statusTone = (status: string): Tone =>
  status === 'published' || status === 'confirmed' || status === 'valid'
    ? 'success'
    : status === 'pending' || status === 'draft'
      ? 'warning'
      : status === 'cancelled' || status === 'refunded'
        ? 'danger'
        : 'neutral';
