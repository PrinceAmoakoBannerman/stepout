import type { Category } from '@/types';
import { CategoryCard } from '@/components/events/CategoryCard';
import { Slideshow } from '@/components/common/Slideshow';

export const CategorySlideshow = ({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) => (
  <Slideshow
    items={categories}
    pageSizes={{ base: 2, sm: 3, lg: 5 }}
    gridClassName="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5"
    renderItem={(c) => <CategoryCard key={c.id} category={c} count={counts[c.id]} compact />}
  />
);
