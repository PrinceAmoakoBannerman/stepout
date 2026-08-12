import type { CategoryId, UserProfile } from '@/types';
import { store, uid } from '@/utils/storage';
import { api, resolve, useApi } from './api';

const SESSION = 'session';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterInput extends Credentials {
  name: string;
  cityId: string;
}

/** Demo accounts so the organizer and admin surfaces can be explored without a backend. */
const seeded: Record<string, UserProfile> = {
  'organizer@stepout.gh': {
    id: 'u-org', name: 'Adjoa Nyarko', email: 'organizer@stepout.gh', avatar: '', cityId: 'accra',
    interests: ['music', 'nightlife', 'food'], role: 'organizer', organizerId: 'o1',
    bio: 'Booking rooftops and gardens for Sunset Sessions GH.', joined: '2021-03-14',
  },
  'admin@stepout.gh': {
    id: 'u-admin', name: 'Nii Armah Tetteh', email: 'admin@stepout.gh', avatar: '', cityId: 'accra',
    interests: ['tech', 'sports'], role: 'admin', bio: 'Platform operations.', joined: '2020-05-01',
  },
};

export const authService = {
  current(): UserProfile | null {
    return store.get<UserProfile | null>(SESSION, null);
  },

  async login({ email, password }: Credentials): Promise<UserProfile> {
    if (useApi) {
      const { data } = await api.post<{ token: string; user: UserProfile }>('/auth/login/', { email, password });
      store.set('token', data.token);
      store.set(SESSION, data.user);
      return data.user;
    }
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const known = seeded[email.toLowerCase().trim()];
    const user: UserProfile = known ?? {
      id: uid('u'),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      avatar: '',
      cityId: 'accra',
      interests: [],
      role: 'attendee',
      joined: new Date().toISOString().slice(0, 10),
    };
    store.set(SESSION, user);
    return resolve(user, 450);
  },

  async register({ name, email, password, cityId }: RegisterInput): Promise<UserProfile> {
    if (useApi) {
      const { data } = await api.post<{ token: string; user: UserProfile }>('/auth/register/', { name, email, password, city: cityId });
      store.set('token', data.token);
      store.set(SESSION, data.user);
      return data.user;
    }
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const user: UserProfile = {
      id: uid('u'), name, email, avatar: '', cityId, interests: [], role: 'attendee',
      joined: new Date().toISOString().slice(0, 10),
    };
    store.set(SESSION, user);
    return resolve(user, 450);
  },

  async requestReset(email: string): Promise<void> {
    if (useApi) {
      await api.post('/auth/password-reset/', { email });
      return;
    }
    await resolve(null, 500);
  },

  async update(patch: Partial<UserProfile>): Promise<UserProfile> {
    const currentUser = this.current();
    if (!currentUser) throw new Error('You need to sign in first.');
    const next = { ...currentUser, ...patch };
    if (useApi) await api.patch(`/users/${currentUser.id}/`, patch);
    store.set(SESSION, next);
    return next;
  },

  async setInterests(interests: CategoryId[]): Promise<UserProfile> {
    return this.update({ interests });
  },

  logout() {
    store.remove(SESSION);
    store.remove('token');
  },
};
