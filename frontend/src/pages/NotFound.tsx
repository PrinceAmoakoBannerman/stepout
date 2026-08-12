import { MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';

export const NotFound = () => {
  usePageMeta('Page not found · StepOut');
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">
      <MapPin className="h-14 w-14 text-magenta mb-6 opacity-60" />
      <Logo size="sm" to={null} className="mb-6" />
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Looks like you've<br />wandered off the map.</h1>
      <p className="mt-4 max-w-sm text-muted">That page doesn't exist or has been moved. Accra's events are still waiting.</p>
      <Button to="/" size="lg" className="mt-8">Back to Discover</Button>
    </div>
  );
};
