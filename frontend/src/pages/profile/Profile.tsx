import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BadgeCheck, Bookmark, CalendarCheck, Edit3, LogOut, Settings, Sparkles, Ticket } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Input, Select } from '@/components/common/Field';
import { Tabs } from '@/components/common/Tabs';
import { Badge } from '@/components/common/Badge';
import { EventCard } from '@/components/events/EventCard';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { categories } from '@/data/categories';
import { cities } from '@/data/cities';
import { EmptyState } from '@/components/common/EmptyState';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { CategoryId } from '@/types';
import { cn } from '@/utils/cn';

const tabs = [
  { id: 'events', label: 'My events' },
  { id: 'saved', label: 'Saved' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'interests', label: 'Interests' },
  { id: 'settings', label: 'Settings' },
];

export const Profile = () => {
  usePageMeta('My profile · StepOut');
  const { user, signOut, updateProfile, setInterests, events, savedIds, interestedIds, tickets, toast } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(params.get('tab') ?? 'events');
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editCity, setEditCity] = useState(user?.cityId ?? 'accra');
  const [editBio, setEditBio] = useState(user?.bio ?? '');
  const [selectedInterests, setSelectedInterests] = useState<CategoryId[]>(user?.interests ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!user) navigate('/login'); }, [user]);
  useEffect(() => { if (user) { setEditName(user.name); setEditCity(user.cityId); setEditBio(user.bio ?? ''); setSelectedInterests(user.interests); } }, [user]);

  if (!user) return null;

  const myEvents = events.filter(e => interestedIds.includes(e.id));
  const savedEvents = savedIds.map(id => events.find(e => e.id === id)).filter(Boolean) as typeof events;

  const saveProfile = async () => {
    setSaving(true);
    await updateProfile({ name: editName, cityId: editCity, bio: editBio });
    toast('Profile updated', 'success');
    setSaving(false);
  };

  const saveInterests = async () => {
    setSaving(true);
    await setInterests(selectedInterests);
    toast('Interests saved', 'success');
    setSaving(false);
  };

  const toggleInterest = (id: CategoryId) =>
    setSelectedInterests(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="shell py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold">{user.name}</h1>
              {user.role !== 'attendee' && (
                <Badge tone="brand" className="flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" />
                  {user.role === 'admin' ? 'Admin' : 'Organizer'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted">{user.email}</p>
            {user.bio && <p className="mt-1 max-w-sm text-sm">{user.bio}</p>}
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {cities.find(c => c.id === user.cityId)?.name} · Joined {new Date(user.joined).toLocaleDateString('en-GH', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Edit3 className="h-4 w-4" />} onClick={() => setTab('settings')}>Edit</Button>
          <Button variant="ghost" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={() => { signOut(); navigate('/'); }}>Sign out</Button>
        </div>
      </div>

      <Tabs items={tabs} active={tab} onChange={setTab} className="mb-8" />

      {tab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-5 w-5 text-green" />
            <h2 className="font-display text-xl font-bold">Events you're interested in</h2>
          </div>
          {myEvents.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myEvents.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <EmptyState icon={<CalendarCheck className="h-6 w-6" />} title="No events yet"
              message="Mark events as interested and they'll appear here." actionLabel="Explore events" actionTo="/events" />
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Bookmark className="h-5 w-5 text-green" />
            <h2 className="font-display text-xl font-bold">Saved events</h2>
          </div>
          {savedEvents.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedEvents.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <EmptyState icon={<Bookmark className="h-6 w-6" />} title="Nothing saved yet"
              message="Tap the bookmark icon on any event card." actionLabel="Explore events" actionTo="/events" />
          )}
        </div>
      )}

      {tab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Ticket className="h-5 w-5 text-green" />
            <h2 className="font-display text-xl font-bold">My tickets</h2>
          </div>
          {tickets.length ? (
            <div className="space-y-3">
              {tickets.map(t => {
                const ev = events.find(e => e.id === t.eventId);
                return (
                  <div key={t.id} className="card flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-dusk text-white">
                      <span className="font-mono text-[9px] uppercase tracking-wider opacity-70">SO</span>
                      <span className="font-display text-xs font-bold">{t.id.slice(-4)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{ev?.title ?? 'Event'}</p>
                      <p className="text-xs text-muted">{t.tierName} · {t.quantity}×</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{t.id}</p>
                    </div>
                    <Badge tone={t.status === 'valid' ? 'success' : t.status === 'checked-in' ? 'brand' : 'danger'}>
                      {t.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<Ticket className="h-6 w-6" />} title="No tickets yet"
              message="Your purchased tickets appear here with a QR code for entry." actionLabel="Browse events" actionTo="/events" />
          )}
        </div>
      )}

      {tab === 'interests' && (
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-green" />
            <h2 className="font-display text-xl font-bold">Your interests</h2>
          </div>
          <p className="text-sm text-muted">These shape what appears in your "Picked for your vibe" row on the home page.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map(cat => {
              const active = selectedInterests.includes(cat.id);
              return (
                <button key={cat.id} onClick={() => toggleInterest(cat.id)} aria-pressed={active}
                  className={cn('flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all',
                    active ? 'border-green bg-green/8' : 'border-line bg-surface hover:border-green/40')}>
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-green text-white' : cat.tint)}>
                    <CategoryIcon id={cat.id} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold">{cat.name}</span>
                </button>
              );
            })}
          </div>
          <Button loading={saving} onClick={saveInterests} icon={<Sparkles className="h-4 w-4" />}>Save interests</Button>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-green" />
            <h2 className="font-display text-xl font-bold">Account settings</h2>
          </div>
          <div className="card p-5 space-y-4">
            <Input label="Full name" value={editName} onChange={e => setEditName(e.target.value)} />
            <Input label="Bio" value={editBio} onChange={e => setEditBio(e.target.value)} hint="A short line about yourself." />
            <Select label="City" value={editCity} onChange={e => setEditCity(e.target.value)}>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Button loading={saving} onClick={saveProfile}>Save changes</Button>
          </div>
        </div>
      )}
    </div>
  );
};
