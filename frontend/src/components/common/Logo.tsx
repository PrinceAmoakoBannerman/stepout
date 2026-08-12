import { Link } from 'react-router-dom';
import mark from '@/assets/stepout-mark.png';
import { cn } from '@/utils/cn';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
  to?: string | null;
  className?: string;
}

const sizes = {
  sm: { mark: 'h-7 w-7', text: 'text-lg' },
  md: { mark: 'h-9 w-9', text: 'text-xl' },
  lg: { mark: 'h-14 w-14', text: 'text-3xl' },
};

export const Logo = ({ size = 'md', showWordmark = true, showTagline = false, to = '/', className }: Props) => {
  const s = sizes[size];
  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img src={mark} alt="StepOut" className={cn(s.mark, 'shrink-0 object-contain')} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-display font-extrabold tracking-tight', s.text)}>
            <span className="text-fg">Step</span>
            <span className="text-green">
              Out
            </span>
          </span>
          {showTagline && (
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
              Find your next thing.
            </span>
          )}
        </span>
      )}
    </span>
  );

  return to ? (
    <Link to={to} className="rounded-lg" aria-label="StepOut home">
      {content}
    </Link>
  ) : (
    content
  );
};
