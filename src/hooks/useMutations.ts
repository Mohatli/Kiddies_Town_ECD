import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import type {
  Learner, ParentProfile, ProgressReport, PaymentItem,
  ChatMessage, SchoolEvent, WeeklyTheme, JournalPost, EnrolmentApplication,
} from '../types';

/**
 * Granular invalidation: each mutation invalidates only the affected entity's
 * query key, plus ['all-data'] for backward compatibility with pages that
 * still use the monolithic useAllData() hook.
 */
function useInvalidateEntity(entityKey: string | string[]) {
  const queryClient = useQueryClient();
  const keys = Array.isArray(entityKey) ? entityKey : [entityKey];
  return useCallback(
    () => {
      // Invalidate the specific entity query
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      // Also invalidate all-data for backward compat with pages still using useAllData()
      queryClient.invalidateQueries({ queryKey: ['all-data'] });
    },
    [queryClient, keys]
  );
}

export function useUpdateLearner() {
  const invalidate = useInvalidateEntity('learners');
  return useMutation({
    mutationFn: (learner: Learner) => api.post('/learners', learner),
    onSuccess: invalidate,
  });
}

export function useDeleteLearner() {
  const invalidate = useInvalidateEntity('learners');
  return useMutation({
    mutationFn: (id: string) => api.del(`/learners/${id}`),
    onSuccess: invalidate,
  });
}

export function useUpdateParentProfile() {
  const invalidate = useInvalidateEntity(['all-data']);
  return useMutation({
    mutationFn: (profile: Partial<ParentProfile>) => api.post('/parent-profile', profile),
    onSuccess: invalidate,
  });
}

export function useUpdateProgressReport() {
  const invalidate = useInvalidateEntity('all-data');
  return useMutation({
    mutationFn: (report: ProgressReport) => api.post('/progress-reports', report),
    onSuccess: invalidate,
  });
}

export function useUpdatePayment() {
  const invalidate = useInvalidateEntity('payments');
  return useMutation({
    mutationFn: (payment: PaymentItem) => api.post('/payments', payment),
    onSuccess: invalidate,
  });
}

export function useSendChat() {
  const invalidate = useInvalidateEntity('all-data');
  return useMutation({
    mutationFn: (message: ChatMessage) => api.post('/chats', message),
    onSuccess: invalidate,
  });
}

export function useUpdateEvent() {
  const invalidate = useInvalidateEntity('events');
  return useMutation({
    mutationFn: (event: SchoolEvent) => api.post('/events', event),
    onSuccess: invalidate,
  });
}

export function useUpdateTheme() {
  const invalidate = useInvalidateEntity('themes');
  return useMutation({
    mutationFn: (theme: WeeklyTheme) => api.post('/themes', theme),
    onSuccess: invalidate,
  });
}

export function usePostJournal() {
  const invalidate = useInvalidateEntity('journal');
  return useMutation({
    mutationFn: (post: JournalPost) => api.post('/journal', post),
    onSuccess: invalidate,
  });
}

export function useSubmitEnrolment() {
  const invalidate = useInvalidateEntity('all-data');
  return useMutation({
    mutationFn: (application: EnrolmentApplication) => api.post('/enrolments', application),
    onSuccess: invalidate,
  });
}

export function useCreateParent() {
  const invalidate = useInvalidateEntity('all-data');
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => api.post('/admin/create-parent', data),
    onSuccess: invalidate,
  });
}

export function useSendBulkEmails() {
  return useMutation({
    mutationFn: (data: { studentIds: string[]; subject: string; body: string; template?: string }) =>
      api.post('/admin/send-bulk-emails', data),
  });
}

export function useResetDatabase() {
  const invalidate = useInvalidateEntity('all-data');
  return useMutation({
    mutationFn: () => api.post('/admin/reset-db', {}),
    onSuccess: invalidate,
  });
}
