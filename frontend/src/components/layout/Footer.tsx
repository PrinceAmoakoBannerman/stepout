import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

const groups = [
  {
    title: 'Discover',
    links: [
      { label: 'Tonight in Accra', to: '/events?when=today' },
      { label: 'This weekend', to: '/events?when=weekend' },
      { label: 'Free events', to: '/events?free=1' },
      { label: 'Event map', to: '/map' },
      { label: 'Categories', to: '/categories' },
    ],
  },
  {
    title: 'For organizers',
    links: [
      { label: 'Why StepOut', to: '/for-organizers' },
      { label: 'Create an event', to: '/organizer/events/new' },
      { label: 'Organizer dashboard', to: '/organizer' },
      { label: 'Check-in', to: '/organizer/checkin' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy', to: '/about#privacy' },
      { label: 'Terms', to: '/about#terms' },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-20 border-t border-line bg-surface">
    <div className="h-[3px] w-full bg-horizon" />
    <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div>
        <Logo size="md" showTagline />
        <p className="mt-4 max-w-xs text-sm text-muted">
          Event discovery for Accra — concerts, parties, match days, food, tech and everything in
          between. Built in Ghana.
        </p>
        <div className="mt-5 flex gap-2">
          {[
            { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
            { icon: Twitter, label: 'X', href: 'https://x.com' },
            { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
            { icon: Mail, label: 'Email', href: 'mailto:hello@stepout.gh' },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-green/50 hover:text-fg"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {groups.map((g) => (
        <nav key={g.title} aria-label={g.title}>
          <h3 className="font-display text-sm font-bold">{g.title}</h3>
          <ul className="mt-4 space-y-2.5">
            {g.links.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm link-quiet">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>

    <div className="border-t border-line">
      <div className="shell flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} StepOut. Made in Accra, Ghana.</p>
        <p className="font-mono uppercase tracking-[0.2em]">Find your next thing.</p>
      </div>
    </div>
  </footer>
);
