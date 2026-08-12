import { useMemo } from 'react';
import { CalendarDays, Eye, TrendingUp, Ticket, Users, Wallet } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { StatCard } from '@/components/common/StatCard';
import { ChartCard } from '@/components/common/ChartCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EventCard } from '@/components/events/EventCard';
import { organizerService } from '@/services/organizerService';
import { compact, cedis } from '@/utils/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { usePageMeta } from '@/hooks/usePageMeta';

const COLORS = ['#0E8F5B','#FF3D8A','#FF7A2F','#FFC93C','#CE1126','#06b6d4'];

export const OrganizerOverview = () => {
  usePageMeta('Organizer Overview · StepOut');
  const { events, user } = useApp();
  const myEvents = useMemo(() => events.filter(e => e.organizerId === (user?.organizerId ?? 'o1')), [events, user]);
  const stats = useMemo(() => organizerService.stats(myEvents), [myEvents]);
  const series = useMemo(() => organizerService.series(myEvents), [myEvents]);
  const breakdown = useMemo(() => organizerService.categoryBreakdown(myEvents), [myEvents]);
  const upcoming = useMemo(() => myEvents.filter(e => e.status === 'published' && new Date(e.start) > new Date()).slice(0, 3), [myEvents]);

  const weekly = series.filter((_, i) => i % 5 === 4).slice(-6);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1">Overview</p>
        <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total events" value={String(stats.totalEvents)} icon={<CalendarDays className="h-4 w-4" />} delta={12} />
        <StatCard label="Upcoming" value={String(stats.upcomingEvents)} icon={<TrendingUp className="h-4 w-4" />} accent="magenta" />
        <StatCard label="Total views" value={compact(stats.totalViews)} icon={<Eye className="h-4 w-4" />} delta={8} accent="ember" />
        <StatCard label="Interested" value={compact(stats.interestedUsers)} icon={<Users className="h-4 w-4" />} accent="sun" />
        <StatCard label="Tickets sold" value={compact(stats.ticketsSold)} icon={<Ticket className="h-4 w-4" />} delta={22} />
        <StatCard label="Revenue" value={`GH₵${compact(stats.revenue)}`} icon={<Wallet className="h-4 w-4" />} delta={18} accent="magenta" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Views over 30 days" subtitle="Daily page views across all published events">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={38} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="views" stroke="#0E8F5B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ticket sales" subtitle="Weekly ticket volumes">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }} />
              <Bar dataKey="tickets" fill="#FF3D8A" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue trend" subtitle="Weekly GH₵ earned">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} tickFormatter={v => `₵${compact(v)}`} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }} formatter={(v: number) => [cedis(v), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#FF7A2F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Events by category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={10}>
                {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {upcoming.length > 0 && (
        <div>
          <SectionHeader title="Upcoming events" href="/organizer/events" hrefLabel="All events" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
};
