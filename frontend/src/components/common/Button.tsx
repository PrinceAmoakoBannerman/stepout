import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  loading?: boolean;
  icon?: ReactNode;
  full?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-bg shadow-[0_8px_24px_-12px_rgba(11,11,31,0.4)] hover:opacity-90',
  secondary: 'bg-fg text-bg hover:opacity-90',
  outline: 'border border-line bg-surface text-fg hover:border-green/60 hover:bg-raised',
  ghost: 'text-muted hover:bg-raised hover:text-fg',
  danger: 'bg-magenta-600 text-white hover:brightness-110',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base py-3.5',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', to, href, loading, icon, full, className, children, ...rest }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], full && 'w-full', className);

    if (to) {
      return (
        <Link to={to} className={classes}>
          {icon}
          {children}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
          {icon}
          {children}
        </a>
      );
    }
    return (
      <button ref={ref} className={classes} disabled={loading || rest.disabled} {...rest}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
