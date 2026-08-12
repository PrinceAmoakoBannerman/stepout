import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { CategoryId } from '@/types';
import { categories } from '@/data/categories';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/common/Button';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';
import { usePageMeta } from '@/hooks/usePageMeta';

export const InterestOnboarding = () => {
  usePageMeta("What's your vibe? · StepOut");
  const { user, setInterests, toast } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId[]>(user?.interests ?? []);
  const [loading, setLoading] = useState(false);

  const toggle = (id: CategoryId) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const save = async () => {
    setLoading(true);
    await setInterests(selected);
    toast("Vibe set! Your feed is now personalised.", 'success');
    navigate('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <Logo size="lg" className="justify-center" />
          <h1 className="mt-6 font-display text-3xl font-extrabold">What's your vibe?</h1>
          <p className="mt-2 text-sm text-muted">
            Pick a few interests and StepOut personalises your discovery feed around them. You can always change these later.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map(cat => {
            const active = selected.includes(cat.id);
            return (
              <button key={cat.id} onClick={() => toggle(cat.id)} aria-pressed={active}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-200',
                  active ? 'border-green bg-green/8 shadow-[0_0_0_4px_rgba(139,61,255,0.15)]'
                    : 'border-line bg-surface hover:border-green/40',
                )}
              >
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl transition-colors', active ? 'bg-green text-white' : cat.tint)}>
                  <CategoryIcon id={cat.id} className="h-6 w-6" />
                </span>
                <span className="font-display text-sm font-bold">{cat.name}</span>
                <span className="text-[11px] text-muted">{cat.blurb}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{selected.length} of {categories.length} selected</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>Skip for now</Button>
            <Button loading={loading} icon={<Sparkles className="h-4 w-4" />} onClick={save} disabled={selected.length === 0}>
              Save my vibe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
