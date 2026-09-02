import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type {
  Learner, ParentProfile, ProgressReport, PaymentItem,
  ChatMessage, WeeklyTheme, SchoolEvent, JournalPost, EnrolmentApplication,
  DailyRegister,
} from '../types';

export interface AllDataResponse {
  learners: Learner[];
  parentProfile: ParentProfile | null;
  progressReports: ProgressReport[];
  paymentHistory: PaymentItem[];
  chatHistory: ChatMessage[];
  themes: WeeklyTheme[];
  events: SchoolEvent[];
  journalPosts: JournalPost[];
  enrolments: EnrolmentApplication[];
  registers?: DailyRegister[];
  parentProfiles: Array<{ email: string; name: string; profile?: ParentProfile }>;
  usingNeon?: boolean;
}

export function useAllData() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<AllDataResponse>({
    queryKey: ['all-data', user?.email, user?.role],
    queryFn: () => {
      const params = user
        ? `?email=${encodeURIComponent(user.email)}&role=${user.role}`
        : '';
      return api.get<AllDataResponse>(`/all-data${params}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 min
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
