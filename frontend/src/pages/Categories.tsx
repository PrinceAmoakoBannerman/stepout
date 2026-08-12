import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { categories } from '@/data/categories';
import { CategoryCard } from '@/components/events/CategoryCard';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Categories = () => {
  usePageMeta('Categories · StepOut', 'Browse every kind of event on StepOut — music, food, sports, tech and more.');
  const { events } = useApp();
  const counts = useMemo(
    () => Object.fromEntries(categories.map(c => [c.id, events.filter(e => e.category === c.id && e.status === 'published').length])),
    [events]
  );
  return (
    <div className="shell py-10 sm:py-14">
      <header className="mb-10">
        <p className="eyebrow mb-2">Browse</p>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Categories</h1>
        <div className="horizon-rule mt-4" />
        <p className="mt-4 max-w-xl text-muted">Every kind of event in Accra, organised by vibe. Pick one to see what's on.</p>
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map(c => <CategoryCard key={c.id} category={c} count={counts[c.id]} />)}
      </div>
    </div>
  );
};
