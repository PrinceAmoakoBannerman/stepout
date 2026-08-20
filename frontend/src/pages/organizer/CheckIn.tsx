import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, QrCode, ScanLine } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Field';
import { ticketService } from '@/services/ticketService';
import { Logo } from '@/components/common/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/utils/cn';

type State = 'idle' | 'loading' | 'success' | 'fail' | 'already';

export const CheckIn = () => {
  usePageMeta('Check-in · StepOut Organizer');
  const { events } = useApp();
  const [ticketId, setTicketId] = useState('');
  const [state, setState] = useState<State>('idle');
  const [checkedTicket, setCheckedTicket] = useState<Awaited<ReturnType<typeof ticketService.checkIn>> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scan = async (id: string) => {
    const clean = id.trim();
    if (!clean) return;
    setState('loading');
    const ticket = await ticketService.checkIn(clean);
    if (!ticket) {
      setState('fail');
    } else if (ticket.status === 'checked-in' && ticket.id.toUpperCase() !== clean.toUpperCase()) {
      setState('already');
    } else if (checkedTicket?.id === ticket.id && ticket.status === 'checked-in') {
      setState('already');
    } else {
      setCheckedTicket(ticket);
      setState(ticket.status === 'checked-in' ? 'success' : 'fail');
    }
    setTimeout(() => { setState('idle'); setTicketId(''); inputRef.current?.focus(); }, 3500);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1">Entry management</p>
        <h1 className="font-display text-2xl font-extrabold">Check-in scanner</h1>
      </div>

      {/* Simulated scanner */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-line bg-surface p-10">
        <div className={cn('relative flex h-48 w-48 items-center justify-center rounded-2xl border-2 transition-colors',
          state === 'success' ? 'border-emerald-500 bg-emerald-500/10'
          : state === 'fail' || state === 'already' ? 'border-magenta bg-magenta/10'
          : 'border-green/40 bg-green/5')}>
          {state === 'loading' && <ScanLine className="h-12 w-12 animate-pulse text-green" />}
          {state === 'success' && <CheckCircle2 className="h-16 w-16 text-emerald-500" />}
          {(state === 'fail' || state === 'already') && <AlertCircle className="h-16 w-16 text-magenta" />}
          {state === 'idle' && <QrCode className="h-16 w-16 text-muted opacity-50" />}
          {state === 'idle' && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="animate-[shimmer_2.5s_linear_infinite] absolute inset-x-0 h-1 bg-green/60"
                style={{ top: '50%', boxShadow: '0 0 8px rgba(14,143,91,.6)' }} />
            </div>
          )}
        </div>

        {state === 'success' && (
          <div className="text-center">
            <p className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">CHECK-IN SUCCESSFUL</p>
            <p className="mt-1 text-sm text-muted">{checkedTicket?.attendeeName} · {checkedTicket?.tierName}</p>
          </div>
        )}
        {(state === 'fail') && (
          <div className="text-center">
            <p className="font-display text-2xl font-extrabold text-magenta">INVALID TICKET</p>
            <p className="mt-1 text-sm text-muted">This ticket ID was not found or has been refunded.</p>
          </div>
        )}
        {state === 'already' && (
          <div className="text-center">
            <p className="font-display text-2xl font-extrabold text-magenta">ALREADY CHECKED IN</p>
            <p className="mt-1 text-sm text-muted">This ticket was already scanned for entry.</p>
          </div>
        )}
        {state === 'idle' && (
          <p className="text-sm text-muted">Scanner active — paste a QR code value or type a ticket ID below.</p>
        )}
      </div>

      <div className="max-w-md space-y-3">
        <Input ref={inputRef} label="Ticket ID" placeholder="SO-XXXX-XXXXX"
          value={ticketId}
          onChange={e => setTicketId(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && scan(ticketId)}
          hint="Paste or type a ticket ID, then press Enter or click Verify." />
        <Button full onClick={() => scan(ticketId)} loading={state === 'loading'}>Verify & check in</Button>
      </div>

      <div className="card p-5">
        <p className="eyebrow mb-3">Demo tickets</p>
        <p className="mb-3 text-sm text-muted">Click a ticket ID to test the scanner.</p>
        <div className="flex flex-wrap gap-2">
          {['SO-E1AB-TEST1','SO-E2CD-TEST2','SO-E9EF-TEST3'].map(tid => (
            <button key={tid} onClick={() => { setTicketId(tid); scan(tid); }}
              className="rounded-lg bg-raised px-3 py-1.5 font-mono text-xs hover:bg-line/60 transition-colors">
              {tid}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
