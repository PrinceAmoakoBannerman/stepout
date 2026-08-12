import type { ReactNode } from 'react';

export const ChartCard = ({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="card p-4 sm:p-5">
    <header className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-base font-bold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
    <div className="h-[240px] w-full">{children}</div>
  </section>
);
