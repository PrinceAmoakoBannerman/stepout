import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Shield, Ticket, Users, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { demoUsers, demoReports } from '@/data/people';
import { StatCard } from '@/components/common/StatCard';
import { Tabs } from '@/components/common/Tabs';
import { Badge, statusTone } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Textarea } from '@/components/common/Field';
import { EventImage } from '@/components/events/EventImage';
import { Avatar } from '@/components/common/Avatar';
import { organizerService } from '@/services/organizerService';
import { timeAgo, compact, cedis } from '@/utils/format';
import { usePageMeta } from '@/hooks/usePageMeta';

const adminTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'events', label: 'Events' },
  { id: 'users', label: 'Users' },
  { id: 'moderation', label: 'Moderation' },
];

export const AdminDashboard = () => {
  usePageMeta('Admin · StepOut');
  const { events, updateEvent, toast } = useApp();
  const [tab, setTab] = useState('overview');
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [reports, setReports] = useState(demoReports);

  const stats = useMemo(() => organizerService.stats(events), [events]);
  const pending = events.filter(e => e.status === 'pending');
  const published = events.filter(e => e.status === 'published');
  const openReports = reports.filter(r => r.status === 'open');

  const approve = async (id: string) => {
    await updateEvent(id, { status: 'published' });
    toast('Event approved and published', 'success');
  };

  const reject = async () => {
    if (!rejectModal || !reason) return;
    await updateEvent(rejectModal, { status: 'cancelled' });
    toast('Event rejected', 'info');
    setRejectModal(null);
    setReason('');
  };

  const resolveReport = (id: string) =>
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: 'resolved' } : rep));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-green" />
        <div>
          <p className="eyebrow mb-0.5">Platform management</p>
          <h1 className="font-display text-2xl font-extrabold">Admin dashboard</h1>
        </div>
      </div>

      <Tabs items={adminTabs.map(t => ({
        ...t,
        count: t.id === 'moderation' ? openReports.length + pending.length : undefined
      }))} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard label="Total users" value={compact(demoUsers.length)} icon={<Users className="h-4 w-4" />} delta={14} />
          <StatCard label="Total events" value={compact(events.length)} icon={<CalendarDays className="h-4 w-4" />} delta={9} accent="magenta" />
          <StatCard label="Tickets sold" value={compact(stats.ticketsSold)} icon={<Ticket className="h-4 w-4" />} delta={21} accent="ember" />
          <StatCard label="Revenue" value={`₵${compact(stats.revenue)}`} icon={<CheckCircle2 className="h-4 w-4" />} delta={18} accent="sun" />
          <StatCard label="Pending review" value={String(pending.length)} icon={<AlertTriangle className="h-4 w-4" />} />
          <StatCard label="Open reports" value={String(openReports.length)} icon={<AlertTriangle className="h-4 w-4" />} accent="magenta" />
          <StatCard label="Published" value={String(published.length)} icon={<CheckCircle2 className="h-4 w-4" />} accent="ember" />
          <StatCard label="Organizers" value="10" icon={<Users className="h-4 w-4" />} accent="sun" />
        </div>
      )}

      {tab === 'events' && (
        <div className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3 font-display font-bold">All events ({events.length})</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line bg-raised">
                <tr>
                  {['Event','Status','Views','Tickets','Revenue'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.slice(0, 20).map(e => (
                  <tr key={e.id} className="hover:bg-raised/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <EventImage src={e.image} alt={e.title} category={e.category} className="h-10 w-14 rounded-lg" />
                        <span className="max-w-[200px] truncate font-semibold">{e.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge tone={statusTone(e.status)}>{e.status}</Badge></td>
                    <td className="px-4 py-3 text-muted">{compact(e.views)}</td>
                    <td className="px-4 py-3">{e.tiers.reduce((s,t) => s + t.sold, 0)}</td>
                    <td className="px-4 py-3">{cedis(e.tiers.reduce((s,t) => s + t.sold * t.price, 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3 font-display font-bold">Registered users</div>
          <ul className="divide-y divide-line">
            {demoUsers.map(u => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-raised/50">
                <Avatar name={u.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <Badge tone={u.role === 'organizer' ? 'brand' : 'neutral'}>{u.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'moderation' && (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-lg font-bold">Pending event submissions ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map(e => (
                  <div key={e.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <EventImage src={e.image} alt={e.title} category={e.category} className="h-20 w-full rounded-xl sm:h-20 sm:w-28" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-xs text-muted">{e.summary}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => approve(e.id)}>Approve</Button>
                      <Button size="sm" variant="outline" icon={<X className="h-4 w-4 text-magenta" />} onClick={() => setRejectModal(e.id)}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-display text-lg font-bold">Open reports ({openReports.length})</h2>
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="card p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{r.reason}</p>
                      <p className="text-xs text-muted">Reported by {r.reportedBy} · {timeAgo(r.createdAt)}</p>
                    </div>
                    <Badge tone={r.status === 'open' ? 'danger' : 'success'}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-muted">{r.detail}</p>
                  {r.status === 'open' && (
                    <Button size="sm" variant="outline" onClick={() => resolveReport(r.id)}>Mark resolved</Button>
                  )}
                </div>
              ))}
              {!reports.length && <p className="text-sm text-muted">No reports to review.</p>}
            </div>
          </section>
        </div>
      )}

      <Modal open={Boolean(rejectModal)} onClose={() => setRejectModal(null)} title="Reject event"
        description="Tell the organizer why this submission was rejected."
        footer={<><Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button><Button onClick={reject}>Reject event</Button></>}>
        <Textarea label="Reason for rejection" value={reason} onChange={e => setReason(e.target.value)} rows={4}
          placeholder="The listing lacks sufficient detail about the schedule and ticket pricing." />
      </Modal>
    </div>
  );
};
