import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category } from '@/types';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { cn } from '@/utils/cn';

// One accent per category, applied only on hover/focus so the grid reads
// as a single calm system at rest instead of a wall of pastel chips.
const accents: Record<string, string> = {
  music: 'group-hover:bg-magenta/10 group-hover:text-magenta group-focus-visible:bg-magenta/10 group-focus-visible:text-magenta',
  nightlife: 'group-hover:bg-green/10 group-hover:text-green group-focus-visible:bg-green/10 group-focus-visible:text-green',
  sports: 'group-hover:bg-ember/10 group-hover:text-ember group-focus-visible:bg-ember/10 group-focus-visible:text-ember',
  food: 'group-hover:bg-sun/15 group-hover:text-sun-600 group-focus-visible:bg-sun/15 group-focus-visible:text-sun-600',
  tech: 'group-hover:bg-green/10 group-hover:text-green group-focus-visible:bg-green/10 group-focus-visible:text-green',
  networking: 'group-hover:bg-ember/10 group-hover:text-ember group-focus-visible:bg-ember/10 group-focus-visible:text-ember',
  arts: 'group-hover:bg-magenta/10 group-hover:text-magenta group-focus-visible:bg-magenta/10 group-focus-visible:text-magenta',
  culture: 'group-hover:bg-sun/15 group-hover:text-sun-600 group-focus-visible:bg-sun/15 group-focus-visible:text-sun-600',
  community: 'group-hover:bg-green/10 group-hover:text-green group-focus-visible:bg-green/10 group-focus-visible:text-green',
  workshops: 'group-hover:bg-ember/10 group-hover:text-ember group-focus-visible:bg-ember/10 group-focus-visible:text-ember',
};

export const CategoryCard = ({
  category,
  count,
  compact,
}: {
  category: Category;
  count?: number;
  compact?: boolean;
}) => (
  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
    <Link
      to={`/events?category=${category.id}`}
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-line bg-surface transition-colors hover:border-green/30',
        compact ? 'items-center gap-1.5 p-2.5 text-center sm:gap-2 sm:p-4' : 'gap-3 p-4',
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-xl border border-line bg-bg text-fg/70 transition-colors duration-200',
          compact ? 'h-8 w-8 sm:h-11 sm:w-11' : 'h-11 w-11',
          accents[category.id],
        )}
      >
        <CategoryIcon id={category.id} className={compact ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5'} />
      </span>
      <span>
        <span className={cn('block font-display font-bold', compact ? 'text-xs sm:text-[15px]' : 'text-[15px]')}>
          {category.name}
        </span>
        {!compact && <span className="mt-1 block text-xs text-muted">{category.blurb}</span>}
        {typeof count === 'number' && (
          <span
            className={cn(
              'block font-mono uppercase tracking-wider text-muted',
              compact ? 'mt-1 text-[9px] sm:mt-1.5 sm:text-[10px]' : 'mt-1.5 text-[10px]',
            )}
          >
            {count} {count === 1 ? 'event' : 'events'}
          </span>
        )}
      </span>
    </Link>
  </motion.div>
);
