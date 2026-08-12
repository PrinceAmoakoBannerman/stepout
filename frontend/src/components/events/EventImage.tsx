import { useState } from 'react';
import { cn } from '@/utils/cn';
import { CategoryIcon } from '@/components/common/CategoryIcon';

/** Images are remote demo photos — this keeps a branded fallback if one fails to load. */
export const EventImage = ({
  src,
  alt,
  category,
  className,
  eager,
}: {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  eager?: boolean;
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn('flex items-center justify-center bg-dusk', className)} role="img" aria-label={alt}>
        <CategoryIcon id={category ?? 'all'} className="h-10 w-10 text-white/70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
};
