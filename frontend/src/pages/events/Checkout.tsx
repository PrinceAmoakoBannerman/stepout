import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, Ticket } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Field';
import { EventImage } from '@/components/events/EventImage';
import { Badge } from '@/components/common/Badge';
import { Logo } from '@/components/common/Logo';
import { cedis, cedisExact, clock, longDay } from '@/utils/format';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { TicketTier } from '@/types';
import { cn } from '@/utils/cn';

type Step = 'tickets' | 'details' | 'payment' | 'confirm';

export const Checkout = () => {
  usePageMeta('Get tickets · StepOut');
  const { id } = useParams();
  const { getEvent, venueOf, user, buyTicket, toast } = useApp();
  const navigate = useNavigate();
  const event = getEvent(id);
  const venue = event ? venueOf(event) : undefined;

  const [step, setStep] = useState<Step>('tickets');
  const [tier, setTier] = useState<TicketTier | null>(event?.tiers[0] ?? null);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Awaited<ReturnType<typeof buyTicket>> | null>(null);

  if (!event || !tier) return (
    <div className="shell py-20 text-center">
      <p className="text-muted">Event not found.</p>
      <Button to="/events" variant="outline" className="mt-4">Browse events</Button>
    </div>
  );

  const total = tier.price * qty;
  const steps: Step[] = ['tickets', 'details', 'payment', 'confirm'];
  const stepIdx = steps.indexOf(step);

  const purchase = async () => {
    if (!name || !email) { toast('Please fill in your name and email.', 'error'); return; }
    setLoading(true);
    try {
      const t = await buyTicket({ event, tier, quantity: qty, attendeeName: name, attendeeEmail: email });
      setTicket(t);
      setStep('confirm');
      toast('Ticket confirmed!', 'success');
    } catch {
      toast('Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm' && ticket) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="font-display text-3xl font-extrabold">You're in!</h1>
          <p className="text-sm text-muted">Your ticket for <strong>{event.title}</strong> is confirmed.</p>

          {/* Digital ticket */}
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
            <div className="bg-dusk px-5 py-4">
              <Logo size="sm" to={null} />
            </div>
            <div className="p-5 space-y-4">
              <EventImage src={event.image} alt={event.title} category={event.category} className="aspect-video w-full rounded-xl" />
              <div>
                <h2 className="font-display text-lg font-extrabold">{event.title}</h2>
                <p className="mt-1 text-sm text-muted">{longDay(event.start)} · {clock(event.start)}</p>
                <p className="text-sm text-muted">{venue?.name}, {venue?.area}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-raised p-2">
                  <dt className="eyebrow text-[10px]">Attendee</dt>
                  <dd className="mt-0.5 font-semibold truncate">{ticket.attendeeName}</dd>
                </div>
                <div className="rounded-lg bg-raised p-2">
                  <dt className="eyebrow text-[10px]">Tier</dt>
                  <dd className="mt-0.5 font-semibold">{ticket.tierName}</dd>
                </div>
                <div className="rounded-lg bg-raised p-2">
                  <dt className="eyebrow text-[10px]">Qty</dt>
                  <dd className="mt-0.5 font-semibold">{ticket.quantity}</dd>
                </div>
                <div className="rounded-lg bg-raised p-2">
                  <dt className="eyebrow text-[10px]">Total paid</dt>
                  <dd className="mt-0.5 font-semibold">{cedisExact(ticket.total)}</dd>
                </div>
              </dl>
              <div className="flex justify-center py-2">
                <QRCodeSVG value={ticket.id} size={130} className="rounded-lg" fgColor="currentColor" />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{ticket.id}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button to="/" full>Back to Discover</Button>
            <Button to="/profile?tab=tickets" variant="outline" full>View all tickets</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell max-w-3xl py-8 sm:py-12">
      <button onClick={() => step === 'tickets' ? navigate(-1) : setStep(steps[stepIdx - 1])}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold link-quiet">
        <ArrowLeft className="h-4 w-4" /> {step === 'tickets' ? 'Back to event' : 'Previous step'}
      </button>

      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {[['tickets','Tickets'],['details','Details'],['payment','Payment']].map(([s, label], i) => (
          <div key={s} className="flex-1">
            <div className={cn('h-1.5 rounded-full', stepIdx >= i ? 'bg-green' : 'bg-line')} />
            <p className={cn('mt-1.5 text-xs font-semibold', stepIdx === i ? 'text-fg' : 'text-muted')}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {step === 'tickets' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Choose your tickets</h2>
              {event.tiers.map(t => (
                <button key={t.id} onClick={() => setTier(t)}
                  className={cn('w-full rounded-2xl border-2 p-4 text-left transition-all',
                    tier?.id === t.id ? 'border-green bg-green/5' : 'border-line hover:border-green/40')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted">{t.quantity - t.sold} of {t.quantity} available</p>
                    </div>
                    <p className="font-display text-xl font-extrabold">{cedis(t.price)}</p>
                  </div>
                </button>
              ))}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-raised">−</button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(10, q + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-raised">+</button>
                </div>
              </div>
              <Button full size="lg" onClick={() => setStep('details')}>Continue to details</Button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Your details</h2>
              <Input label="Full name" required value={name} onChange={e => setName(e.target.value)} />
              <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                hint="Your ticket confirmation and QR code will be linked to this email." />
              <Button full size="lg" onClick={() => setStep('payment')}>Continue to payment</Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Payment</h2>
              <div className="rounded-2xl border border-green/25 bg-green/5 p-4 text-sm">
                <p className="font-semibold text-green">Demo mode</p>
                <p className="mt-1 text-muted">This is a UI preview. No real transaction will occur. Clicking "Pay now" confirms a demo ticket instantly. Paystack can be wired up via <code>VITE_PAYSTACK_PUBLIC_KEY</code>.</p>
              </div>
              <div className="card p-5 space-y-3">
                <p className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4 text-green" /> Pay with mobile money or card</p>
                {total === 0 ? (
                  <p className="text-sm text-muted">This ticket is free — no payment needed.</p>
                ) : (
                  <p className="font-display text-2xl font-extrabold">{cedisExact(total)}</p>
                )}
              </div>
              <Button full size="lg" loading={loading} icon={<Ticket className="h-4 w-4" />} onClick={purchase}>
                {total === 0 ? 'Confirm free ticket' : `Pay ${cedisExact(total)}`}
              </Button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <aside className="card self-start p-5 space-y-4">
          <h3 className="font-display font-bold">Order summary</h3>
          <EventImage src={event.image} alt={event.title} category={event.category} className="aspect-video w-full rounded-xl" />
          <p className="font-semibold">{event.title}</p>
          <p className="text-xs text-muted">{longDay(event.start)} · {clock(event.start)}</p>
          <p className="text-xs text-muted">{venue?.name}, {venue?.area}</p>
          {tier && (
            <div className="border-t border-line pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>{tier.name} × {qty}</span><span>{cedisExact(tier.price * qty)}</span></div>
              <div className="flex justify-between font-bold border-t border-line pt-2">
                <span>Total</span><span>{cedisExact(total)}</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
