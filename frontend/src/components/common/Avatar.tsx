import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

const sizes = { xs: 'h-7 w-7 text-[10px]', sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' };

/** Falls back to a brand-gradient monogram so a missing photo never breaks the layout. */
export const Avatar = ({
  name,
  src,
  size = 'md',
  ring,
  className,
}: {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  ring?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-dusk font-display font-bold text-white',
      sizes[size],
      ring && 'ring-2 ring-surface',
      className,
    )}
    aria-hidden={false}
    title={name}
  >
    {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
  </span>
);
