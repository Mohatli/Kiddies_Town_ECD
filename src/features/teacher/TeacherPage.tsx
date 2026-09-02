import { useCallback, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAllData } from '../../hooks/useAllData';
import TeacherDashboard from '../../components/TeacherDashboard';
import ChangePasswordDialog from '../../components/account/ChangePasswordDialog';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { api } from '../../lib/apiClient';
import type { ProgressReport, WeeklyTheme, ChatMessage, DailyRegister, JournalPost } from '../../types';

export default function TeacherPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch } = useAllData();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  const handleUpdateAttendance = useCallback(async (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    const learner = data?.learners.find((l) => l.id === studentId);
    if (!learner) return;
    setAttendanceError(null);
    try {
      await api.post('/learners', { ...learner, attendanceStatus: status });
      refetch();
    } catch {
      setAttendanceError(`Could not save the attendance update for ${learner.firstNames} ${learner.surname}. Please try again.`);
    }
  }, [data?.learners, refetch]);

  const handleMarkAllPresent = useCallback(async (studentIds: string[]) => {
    if (!data) return;
    setAttendanceError(null);
    const targets = data.learners.filter((l) => studentIds.includes(l.id));
    const results = await Promise.allSettled(
      targets.map((learner) => api.post('/learners', { ...learner, attendanceStatus: 'Present' as const }))
    );
    refetch();
    const failedCount = results.filter((r) => r.status === 'rejected').length;
    if (failedCount > 0) {
      setAttendanceError(
        `The register could not sync for ${failedCount} of ${targets.length} learners. Please review and try again.`
      );
      throw new Error('Bulk attendance partially failed');
    }
  }, [data, refetch]);

  const handleSubmitRegister = useCallback(async (): Promise<DailyRegister> => {
    if (!data) throw new Error('Data not loaded');
    setAttendanceError(null);
    const now = new Date();
    const register: DailyRegister = {
      date: now.toISOString().split('T')[0],
      submittedBy: user?.name,
      entries: data.learners.map((l) => ({
        learnerId: l.id,
        status: (l.attendanceStatus || 'Pending') as DailyRegister['entries'][number]['status'],
        arrivedTime: l.attendanceStatus === 'Present' ? (l.arrivedTime || now.toTimeString().slice(0, 5)) : undefined,
      })),
    };
    try {
      await api.post('/register', register);
      refetch();
      return register;
    } catch {
      setAttendanceError('Could not submit the daily register. Please check your connection and try again.');
      throw new Error('Register submission failed');
    }
  }, [data, user, refetch]);

  const handleUpdateMilestones = useCallback(async (studentId: string, milestones: { label: string; val: number }[]) => {
    if (!data) return;
    const existing = data.progressReports.find((r) => r.learnerId === studentId);
    const toRating = (val: number): 'A' | 'D' | 'E' => (val >= 80 ? 'A' : val >= 60 ? 'D' : 'E');
    const socialScore = milestones.find((m) => m.label.toLowerCase().includes('social'))?.val ?? 85;
    const numScore = milestones.find((m) => m.label.toLowerCase().includes('numeracy'))?.val ?? 80;
    const motorScore = milestones.find((m) => m.label.toLowerCase().includes('motor'))?.val ?? 85;
    const langScore = milestones.find((m) => m.label.toLowerCase().includes('language'))?.val ?? 75;

    const baseReport: ProgressReport = existing || {
      id: `report-${studentId}-term4`,
      learnerId: studentId,
      academicYear: new Date().getFullYear(),
      term: 4,
      released: true,
      releasedDate: new Date().toISOString().split('T')[0],
      recordedDaysAbsent: 0,
      shortSummary: 'K4',
      teacherComments: 'Demonstrating consistent milestone development and cooperative classroom engagement.',
      teacherName: user?.name || 'Teacher Anne',
      principalName: 'Mrs. Shineon',
      indicators: {
        classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
        communicationSkills: { B1_speaksClearly: toRating(langScore) },
        readingWritingSkills: { C1_recognizesLetters: toRating(langScore) },
        numbersMathArithmetic: { D1_countsRecognizes: toRating(numScore) },
        musicArtSkills: { E1_dancesMusicSings: 'A' },
        socialEmotionalSkills: { F1_sharesAndPlays: toRating(socialScore) },
        coloursAndShapes: { G1_colorsShapes: toRating(numScore) },
        fineMotorSkills: { H1_pencilCrayonScissors: toRating(motorScore), H2_blocksPuzzles: toRating(motorScore), H3_bounceKickThrow: toRating(motorScore), H4_buttonsShoesClothes: toRating(motorScore) },
        approachesToLearn: { I1_enjoysLearning: 'A' },
        computerSkills: { J1_tabletLaptopVoice: 'A' },
      },
    };

    const updatedReport: ProgressReport = {
      ...baseReport,
      indicators: {
        ...baseReport.indicators,
        socialEmotionalSkills: { ...baseReport.indicators.socialEmotionalSkills, F1_sharesAndPlays: toRating(socialScore) },
        numbersMathArithmetic: { ...baseReport.indicators.numbersMathArithmetic, D1_countsRecognizes: toRating(numScore) },
        fineMotorSkills: { ...baseReport.indicators.fineMotorSkills, H1_pencilCrayonScissors: toRating(motorScore) },
        readingWritingSkills: { ...baseReport.indicators.readingWritingSkills, C1_recognizesLetters: toRating(langScore) },
      },
    };

    await api.post('/progress-reports', updatedReport);
    refetch();
  }, [data, user, refetch]);

  const handleSaveReport = useCallback(async (report: ProgressReport) => {
    await api.post('/progress-reports', report);
    refetch();
  }, [refetch]);

  const handleAddJournalPost = useCallback(async (post: JournalPost) => {
    await api.post('/journal', post);
    refetch();
  }, [refetch]);

  const handleAddTheme = useCallback(async (theme: WeeklyTheme) => {
    await api.post('/themes', theme);
    refetch();
  }, [refetch]);

  const handleSendMessage = useCallback(async (text: string, parentEmailAddress?: string) => {
    if (!user) return;
    const message: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'Teacher',
      senderName: user.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parentEmail: parentEmailAddress || '',
    };
    await api.post('/chats', message);
    refetch();
  }, [user, refetch]);

  if (!user) return null;

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader portalLabel="Teacher Portal" onOpenPasswordDialog={() => setShowPasswordDialog(true)} />
      <ChangePasswordDialog isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />

      <TeacherDashboard
        learners={data.learners}
        themes={data.themes}
        reports={data.progressReports}
        chats={data.chatHistory}
        journalPosts={data.journalPosts}
        onUpdateAttendance={handleUpdateAttendance}
        onMarkAllPresent={handleMarkAllPresent}
        onSubmitRegister={handleSubmitRegister}
        attendanceError={attendanceError}
        onUpdateMilestones={handleUpdateMilestones}
        onSaveReport={handleSaveReport}
        onAddTheme={handleAddTheme}
        onSendMessage={handleSendMessage}
        onAddJournalPost={handleAddJournalPost}
      />
    </div>
  );
}
