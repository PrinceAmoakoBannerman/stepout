import { Logo } from '@/components/common/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';

export const About = () => {
  usePageMeta('About StepOut', 'StepOut helps people in Accra discover what\'s happening around them and helps organizers reach their audience.');
  return (
    <div className="shell max-w-3xl py-14 sm:py-20">
      <Logo size="lg" showTagline to={null} />
      <h1 className="mt-8 font-display text-3xl font-extrabold sm:text-4xl">About StepOut</h1>
      <div className="horizon-rule mt-4" />
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted">
        <p>StepOut is an event discovery platform built for Accra and expanding to cities across Ghana. We help people find concerts, parties, match days, food pop-ups, tech meetups, workshops and everything in between — and we help the people who put on those events reach the right audience.</p>
        <p>The idea is simple: Accra has an enormous amount going on, but finding out about it relies on WhatsApp groups, word of mouth and algorithmic feeds that prioritise advertising. StepOut is a dedicated place where what you see is what's actually happening around you.</p>
        <p>For organizers, StepOut provides ticketing, QR code check-in, attendee management and an analytics dashboard — no technical setup required. Post an event, set a ticket price in GH₵, and be discoverable before the day is done.</p>
        <p>We're building this in Ghana, for Ghana first. More cities and features are on the way.</p>
      </div>
      <div className="mt-10 grid gap-6 rounded-2xl bg-raised p-6 sm:grid-cols-3 text-center">
        {[['25+','Events in the demo catalogue'],['10','Featured organizers'],['6','Cities supported']].map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-3xl font-extrabold text-fg">{n}</p>
            <p className="mt-1 text-xs text-muted">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
