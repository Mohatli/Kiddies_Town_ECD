import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { Learner, PaymentItem, WeeklyTheme, SchoolEvent, JournalPost } from '../types';

/**
 * Granular query hooks — each entity has its own query key.
 * Mutations only invalidate the affected entity's query, not the entire dataset.
 *
 * These coexist with useAllData() which remains for pages that need all data at once.
 * New code should prefer these granular hooks where possible.
 */

export function useLearners() {
  const user = useAuthStore((s) => s.user);
  return useQuery<Learner[]>({
    queryKey: ['learners', user?.email, user?.role],
    queryFn: () => api.get<Learner[]>('/data/learners'),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePayments() {
  const user = useAuthStore((s) => s.user);
  return useQuery<PaymentItem[]>({
    queryKey: ['payments', user?.email, user?.role],
    queryFn: () => api.get<PaymentItem[]>('/data/payments'),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useThemes() {
  return useQuery<WeeklyTheme[]>({
    queryKey: ['themes'],
    queryFn: () => api.get<WeeklyTheme[]>('/data/themes'),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useEvents() {
  return useQuery<SchoolEvent[]>({
    queryKey: ['events'],
    queryFn: () => api.get<SchoolEvent[]>('/data/events'),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useJournalPosts() {
  return useQuery<JournalPost[]>({
    queryKey: ['journal'],
    queryFn: () => api.get<JournalPost[]>('/data/journal'),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
