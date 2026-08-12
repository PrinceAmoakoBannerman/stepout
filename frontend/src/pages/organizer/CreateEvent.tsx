import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye } from 'lucide-react';
import type { CategoryId, EventDraftInput } from '@/types';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/common/Button';
import { Input, Select, Textarea, Toggle } from '@/components/common/Field';
import { EventDetailView } from '@/components/events/EventDetailView';
import { categories } from '@/data/categories';
import { areas } from '@/data/cities';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/utils/cn';

const ACCRA = { lat: 5.6037, lng: -0.187 };

const blank: EventDraftInput = {
  title: '', category: 'music', summary: '', description: '',
  image: '', startDate: '', startTime: '18:00', endDate: '', endTime: '21:00',
  venueName: '', address: '', area: areas[0], lat: ACCRA.lat, lng: ACCRA.lng,
  isFree: true, tierName: 'General', price: 0, quantity: 100,
};

const steps = ['Details','Date & time','Location','Tickets','Review'];

export const CreateEvent = () => {
  usePageMeta('Create event · StepOut Organizer');
  const { createEvent, toast, venueMap, organizerOf } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<EventDraftInput>(blank);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = <K extends keyof EventDraftInput>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const publish = async (status: 'draft' | 'pending') => {
    setLoading(true);
    try {
      const ev = await createEvent(form, status, '');
      toast(status === 'draft' ? 'Saved as draft' : 'Event submitted for review', 'success');
      navigate('/organizer/events');
    } catch {
      toast('Could not save event. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* Build a pseudo-event for the preview */
  const previewEvent = {
    id: 'preview', title: form.title || 'Event name', category: form.category as CategoryId,
    summary: form.summary, description: form.description,
    image: form.image || `https://picsum.photos/seed/prev/1200/800`,
    start: form.startDate ? new Date(`${form.startDate}T${form.startTime}`).toISOString() : new Date().toISOString(),
    end: form.endDate ? new Date(`${form.endDate}T${form.endTime}`).toISOString() : new Date().toISOString(),
    venueId: 'preview-venue', organizerId: 'o1',
    tiers: [{ id: 't1', name: form.isFree ? 'Free entry' : form.tierName, price: form.isFree ? 0 : form.price, quantity: form.quantity, sold: 0 }],
    interested: 0, views: 0, status: 'draft' as const, featured: false, trending: false,
    tags: [form.area.toLowerCase()], schedule: [], info: ['Bring a valid ID.'], createdAt: new Date().toISOString(),
  };
  const previewVenue = { id: 'preview-venue', name: form.venueName || 'Venue name', address: form.address, area: form.area, cityId: 'accra', lat: form.lat, lng: form.lng, capacity: form.quantity };

  if (preview) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => setPreview(false)}>Back to form</Button>
          <h2 className="font-display text-xl font-bold">Preview</h2>
        </div>
        <EventDetailView event={previewEvent} venue={previewVenue} preview />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Create event</p>
          <h1 className="font-display text-2xl font-extrabold">{steps[step]}</h1>
        </div>
        <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />} onClick={() => setPreview(true)}>Preview</Button>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={cn('h-1.5 rounded-full transition-colors', i <= step ? 'bg-green' : 'bg-line')} />
            <p className={cn('mt-1 hidden text-[10px] font-semibold sm:block', i === step ? 'text-fg' : 'text-muted')}>{s}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        {step === 0 && <>
          <Input label="Event name" required placeholder="Sunset Sessions: Rooftop Highlife" value={form.title} onChange={set('title')} />
          <Select label="Category" value={form.category} onChange={set('category')}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Short summary" placeholder="A one-line teaser for your event." value={form.summary} onChange={set('summary')} />
          <Textarea label="Full description" rows={5} placeholder="Tell people what to expect." value={form.description} onChange={set('description')} />
          <Input label="Cover image URL" placeholder="https://..." value={form.image} onChange={set('image')} hint="Leave blank to use a placeholder." />
        </>}

        {step === 1 && <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start date" type="date" required value={form.startDate} onChange={set('startDate')} />
            <Input label="Start time" type="time" required value={form.startTime} onChange={set('startTime')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="End date" type="date" value={form.endDate} onChange={set('endDate')} />
            <Input label="End time" type="time" value={form.endTime} onChange={set('endTime')} />
          </div>
        </>}

        {step === 2 && <>
          <Input label="Venue name" required placeholder="Untamed Rooftop" value={form.venueName} onChange={set('venueName')} />
          <Input label="Address" placeholder="Lagos Avenue, East Legon" value={form.address} onChange={set('address')} />
          <Select label="Area" value={form.area} onChange={set('area')}>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </Select>
          <p className="text-xs text-muted">Map pin will default to the selected area. Full map picker available in a future release.</p>
        </>}

        {step === 3 && <>
          <Toggle checked={form.isFree} onChange={v => setForm(f => ({ ...f, isFree: v }))} label="This is a free event" />
          {!form.isFree && <>
            <Input label="Ticket tier name" placeholder="General admission" value={form.tierName} onChange={set('tierName')} />
            <Input label="Price (GH₵)" type="number" min={0} value={String(form.price)} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
          </>}
          <Input label="Capacity / ticket quantity" type="number" min={1} value={String(form.quantity)} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
        </>}

        {step === 4 && (
          <div className="space-y-4 text-sm">
            <h3 className="font-display text-lg font-bold">Review before publishing</h3>
            <dl className="grid gap-2 rounded-xl bg-raised p-4">
              {[
                ['Event', form.title || '—'],
                ['Category', form.category],
                ['Start', form.startDate ? `${form.startDate} ${form.startTime}` : '—'],
                ['Venue', `${form.venueName || '—'}, ${form.area}`],
                ['Ticket', form.isFree ? 'Free' : `GH₵${form.price} · ${form.quantity} available`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-20 shrink-0 font-semibold text-muted">{k}</dt>
                  <dd className="truncate">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" full onClick={() => publish('draft')} loading={loading}>Save as draft</Button>
              <Button full onClick={() => publish('pending')} loading={loading} icon={<CheckCircle2 className="h-4 w-4" />}>Submit for review</Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        {step > 0 ? (
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => setStep(s => s - 1)}>Back</Button>
        ) : <span />}
        {step < steps.length - 1 && (
          <Button icon={<ArrowRight className="h-4 w-4" />} onClick={() => setStep(s => s + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
};
