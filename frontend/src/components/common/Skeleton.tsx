import { cn } from '@/utils/cn';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton', className)} />
);

export const EventCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);

export const EventGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);
