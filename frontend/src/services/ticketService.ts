import type { EventItem, Ticket, TicketTier } from '@/types';
import { store, uid } from '@/utils/storage';
import { api, resolve, useApi } from './api';

const TICKETS = 'tickets';

export interface CheckoutInput {
  event: EventItem;
  tier: TicketTier;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
}

export const ticketService = {
  async list(): Promise<Ticket[]> {
    if (useApi) return (await api.get<Ticket[]>('/tickets/')).data;
    return resolve(store.get<Ticket[]>(TICKETS, []), 150);
  },

  /**
   * UI-only checkout. When Paystack is wired up, initialise the transaction here
   * and only persist the ticket after the charge.success webhook confirms payment.
   */
  async purchase({ event, tier, quantity, attendeeName, attendeeEmail }: CheckoutInput): Promise<Ticket> {
    const ticket: Ticket = {
      id: `SO-${event.id.toUpperCase().slice(-4)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      eventId: event.id,
      tierId: tier.id,
      tierName: tier.name,
      attendeeName,
      attendeeEmail,
      quantity,
      total: tier.price * quantity,
      purchasedAt: new Date().toISOString(),
      status: 'valid',
    };
    if (useApi) return (await api.post<Ticket>('/tickets/', ticket)).data;
    store.set(TICKETS, [ticket, ...store.get<Ticket[]>(TICKETS, [])]);
    return resolve(ticket, 900);
  },

  async checkIn(ticketId: string): Promise<Ticket | null> {
    const tickets = store.get<Ticket[]>(TICKETS, []);
    const idx = tickets.findIndex((t) => t.id.toUpperCase() === ticketId.toUpperCase().trim());
    if (idx === -1) return resolve(null, 400);
    if (tickets[idx].status === 'checked-in') return resolve(tickets[idx], 400);
    tickets[idx] = { ...tickets[idx], status: 'checked-in' };
    store.set(TICKETS, tickets);
    return resolve(tickets[idx], 400);
  },

  reference: () => uid('ref').toUpperCase(),
};
