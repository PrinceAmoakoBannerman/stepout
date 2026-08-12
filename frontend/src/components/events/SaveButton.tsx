import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { cn } from '@/utils/cn';

export const SaveButton = ({
  eventId,
  variant = 'icon',
  className,
}: {
  eventId: string;
  variant?: 'icon' | 'full';
  className?: string;
}) => {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(eventId);

  return (
    <motion.button
      whileTap={{ scale: 0.86 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(eventId);
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save event'}
      className={cn(
        variant === 'icon'
          ? 'flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-ink/45 text-white backdrop-blur transition-colors hover:bg-ink/70'
          : 'inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold transition-colors hover:bg-raised',
        saved && variant === 'full' && 'border-green/50 text-green',
        className,
      )}
    >
      <Bookmark className={cn('h-[18px] w-[18px]', saved && 'fill-current')} />
      {variant === 'full' && (saved ? 'Saved' : 'Save')}
    </motion.button>
  );
};
