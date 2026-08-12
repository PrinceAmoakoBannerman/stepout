import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { demoAttendees } from '@/data/people';
import { Button } from '@/components/common/Button';
import { Badge, statusTone } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Input } from '@/components/common/Field';
import { downloadCsv } from '@/utils/share';
import { timeAgo } from '@/utils/format';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Attendees = () => {
  usePageMeta('Attendees · StepOut Organizer');
  const { user, events } = useApp();
  const myIds = useMemo(() => events.filter(e => e.organizerId === (user?.organizerId ?? 'o1')).map(e => e.id), [events, user]);
  const attendees = useMemo(() => demoAttendees.filter(a => myIds.includes(a.eventId)), [myIds]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = attendees.filter(a =>
    (statusFilter === 'all' || a.status === statusFilter) &&
    (a.name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()))
  );

  const exportCsv = () => downloadCsv('stepout-attendees.csv', [
    ['Name','Email','Tier','Qty','Date','Status'],
    ...filtered.map(a => [a.name, a.email, a.tier, a.quantity, new Date(a.purchasedAt).toLocaleDateString(), a.status])
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">Attendees</p>
          <h1 className="font-display text-2xl font-extrabold">{attendees.length} attendees total</h1>
        </div>
        <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={exportCsv}>Export CSV</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm">
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked in</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-line bg-raised">
              <tr>
                {['Attendee','Tier','Qty','Date','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-raised/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.name} size="xs" />
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-muted">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{a.tier}</td>
                  <td className="px-4 py-3">{a.quantity}</td>
                  <td className="px-4 py-3 text-muted">{timeAgo(a.purchasedAt)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No attendees match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
