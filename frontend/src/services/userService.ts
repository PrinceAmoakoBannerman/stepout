import type { AppNotification, UserProfile } from '@/types';
import { demoNotifications, demoUsers } from '@/data/people';
import { resolve, api, useApi } from './api';

export const userService = {
  async list(): Promise<UserProfile[]> {
    if (useApi) return (await api.get<UserProfile[]>('/users/')).data;
    return resolve(demoUsers);
  },

  async notifications(): Promise<AppNotification[]> {
    if (useApi) return (await api.get<AppNotification[]>('/notifications/')).data;
    return resolve(demoNotifications, 200);
  },
};
