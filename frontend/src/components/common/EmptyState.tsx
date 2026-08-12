import type { ReactNode } from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
}: {
  icon?: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
    {icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-raised text-green">{icon}</div>
    )}
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-muted">{message}</p>
    {actionLabel && (
      <div className="mt-6">
        {actionTo ? (
          <Button to={actionTo}>{actionLabel}</Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    )}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="rounded-2xl border border-magenta/30 bg-magenta/5 p-6 text-center">
    <h3 className="font-bold text-magenta">Something went wrong</h3>
    <p className="mt-1 text-sm text-muted">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
