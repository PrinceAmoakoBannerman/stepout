import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = 'See all',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) => (
  <div className="mb-6 flex items-end justify-between gap-6">
    <div>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-[28px]">{title}</h2>
      {subtitle && <p className="mt-1.5 max-w-xl text-sm text-muted">{subtitle}</p>}
      <div className="horizon-rule mt-4" />
    </div>
    {href && (
      <Link
        to={href}
        className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-fg sm:inline-flex"
      >
        {hrefLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);
