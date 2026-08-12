import { BarChart2, Globe, Ticket, Zap } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { usePageMeta } from '@/hooks/usePageMeta';

const features = [
  { icon: Globe, title: 'Reach Accra', body: 'Your events are surfaced to people actively looking for what you\'re putting on — by category, area, date and price.' },
  { icon: Ticket, title: 'Ticketing built in', body: 'Free and paid ticketing, QR code delivery and check-in management in one dashboard. Paystack integration for GH₵ payments.' },
  { icon: BarChart2, title: 'See what\'s working', body: 'Views, interest counts, ticket sales and revenue on a single screen. Know which events and categories are resonating.' },
  { icon: Zap, title: 'Go live in minutes', body: 'Five-step wizard: details, date, venue, tickets, publish. No technical setup. Be discoverable before the day is done.' },
];

export const ForOrganizers = () => {
  usePageMeta('For organizers · StepOut', 'Reach thousands of people in Accra looking for their next thing. Ticketing, check-in and analytics in one place.');
  return (
    <div>
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <div aria-hidden className="absolute inset-0 scale-110 bg-kente blur-md" />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(252,209,22,.3),transparent_60%)]" />
        </div>
        <div className="shell relative py-20 text-center sm:py-28">
          <p className="eyebrow text-white/70 mb-4">For organizers</p>
          <h1 className="font-display text-4xl font-extrabold text-white sm:text-6xl">
            Reach Accra.<br />Fill your event.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/75">
            StepOut puts your event in front of people actively looking for their next thing — concerts, tournaments, pop-ups, workshops.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button to="/organizer/events/new" size="lg">Create your first event</Button>
            <Button to="/organizer" variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Open dashboard</Button>
          </div>
        </div>
      </div>
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
