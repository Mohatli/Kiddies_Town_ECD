import { useCallback, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAllData } from '../../hooks/useAllData';
import AdminDashboard from '../../components/AdminDashboard';
import ChangePasswordDialog from '../../components/account/ChangePasswordDialog';
import DashboardHeader from '../../components/ui/DashboardHeader';
import type { Learner, SchoolEvent, PaymentItem, ProgressReport } from '../../types';
import { api } from '../../lib/apiClient';

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch } = useAllData();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleAddEvent = useCallback(async (event: SchoolEvent) => {
    await api.post('/events', event);
    refetch();
  }, [refetch]);

  const handleApproveEnrolment = useCallback(async (enrolId: string) => {
    const enrolment = data?.enrolments.find((e) => e.id === enrolId);
    if (!enrolment) return;

    await api.post('/enrolments', { ...enrolment, status: 'Approved' });

    const child = (enrolment.childParticulars || {}) as any;
    const parent = (enrolment.parentParticulars || {}) as any;
    const transport = (enrolment.transportDetails || {}) as any;
    const pEmail = (parent.mother?.email || parent.father?.email || parent.email || 'parent@kiddiestown.co.za').toLowerCase().trim();
    const pName = parent.mother ? `${parent.mother.firstNames || ''} ${parent.mother.surname || ''}`.trim() : (parent.name || 'Parent');

    let resolvedClass: 'Roses' | 'Giraffes' | 'Tigers' = 'Roses';
    const grade = (child.gradeThisYear || '').toLowerCase();
    if (grade.includes('grade r') || grade.includes('r') || grade.includes('5') || grade.includes('6')) {
      resolvedClass = 'Tigers';
    } else if (grade.includes('preschool') || grade.includes('3') || grade.includes('4') || grade.includes('giraffe')) {
      resolvedClass = 'Giraffes';
    }

    const learnerId = child.id || `student-${(child.firstNames || 'new').toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`;
    const newLearner: Learner = {
      id: learnerId,
      surname: child.surname || 'Learner',
      firstNames: child.firstNames || 'New',
      preferredName: child.preferredName || child.firstNames || 'Learner',
      dob: child.dob || '2021-01-01',
      idNumber: child.idNumber || '',
      gender: (child.gender as any) || 'Female',
      homeLanguage: child.homeLanguage || 'English',
      religion: child.religion || 'Christian',
      gradeThisYear: child.gradeThisYear || (resolvedClass === 'Roses' ? 'Toddler' : resolvedClass === 'Giraffes' ? 'Preschool' : 'Grade R'),
      schoolAttending: 'Kiddies Town ECD & Academy',
      previousSchool: child.previousSchool || 'None',
      classType: resolvedClass,
      attendanceStatus: 'Present',
      arrivedTime: '08:00',
      parentEmail: pEmail,
      parentName: pName,
      status: 'enrolled',
      enrolmentApproved: true,
      transportNeeded: transport.transportRequired || false,
      transportRouteName: transport.routeSelected || undefined,
    };

    await api.post('/learners', newLearner);

    await api.post('/admin/create-parent', { name: pName, email: pEmail }).catch(() => {});

    const newPayment: PaymentItem = {
      id: `pay-reg-${learnerId}`,
      description: `Registration & Admissions Fee (${new Date().getFullYear()}) - ${newLearner.firstNames} ${newLearner.surname}`,
      date: new Date().toISOString().split('T')[0],
      amount: 600,
      status: 'Paid',
      receiptNo: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
      parentEmail: pEmail,
      learnerId: learnerId,
    };
    await api.post('/payments', newPayment).catch(() => {});

    const starterReport: ProgressReport = {
      id: `report-${learnerId}-term4`,
      learnerId: learnerId,
      academicYear: new Date().getFullYear(),
      term: 4,
      released: true,
      releasedDate: new Date().toISOString().split('T')[0],
      recordedDaysAbsent: 0,
      shortSummary: 'K4',
      teacherComments: `${newLearner.firstNames} has officially commenced in the ${resolvedClass} classroom. Welcome to the Kiddies Town family!`,
      teacherName: 'Teacher Anne',
      principalName: 'Mrs. Shineon',
      indicators: {
        classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
        communicationSkills: { B1_speaksClearly: 'A' },
        readingWritingSkills: { C1_recognizesLetters: 'A' },
        numbersMathArithmetic: { D1_countsRecognizes: 'A' },
        musicArtSkills: { E1_dancesMusicSings: 'A' },
        socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
        coloursAndShapes: { G1_colorsShapes: 'A' },
        fineMotorSkills: { H1_pencilCrayonScissors: 'A', H2_blocksPuzzles: 'A', H3_bounceKickThrow: 'A', H4_buttonsShoesClothes: 'A' },
        approachesToLearn: { I1_enjoysLearning: 'A' },
        computerSkills: { J1_tabletLaptopVoice: 'A' },
      },
    };
    await api.post('/progress-reports', starterReport).catch(() => {});

    refetch();
  }, [data?.enrolments, refetch]);

  const handleVerifyPayment = useCallback(async (paymentId: string, status: 'Paid' | 'In Arrears' | 'Unpaid') => {
    await api.post(`/payments/${paymentId}/verify`, { status });
    refetch();
  }, [refetch]);

  const handleRejectEnrolment = useCallback(async (enrolId: string) => {
    const enrolment = data?.enrolments.find((e) => e.id === enrolId);
    if (enrolment) {
      await api.post('/enrolments', { ...enrolment, status: 'Rejected' });
      refetch();
    }
  }, [data?.enrolments, refetch]);

  const handleResetEnrolmentStatus = useCallback(async (enrolId: string, status: 'In Review' | 'Pending Approval') => {
    const enrolment = data?.enrolments.find((e) => e.id === enrolId);
    if (enrolment) {
      await api.post('/enrolments', { ...enrolment, status });
      refetch();
    }
  }, [data?.enrolments, refetch]);

  const handleSendNotice = useCallback(async (parentName: string, amount: number) => {
    await api.post('/admin/send-arrears-notice', { parentName, amount });
  }, []);

  const handleResetDb = useCallback(async () => {
    await api.post('/admin/reset-db', {});
    refetch();
  }, [refetch]);

  const handleAddLearner = useCallback(async (learner: Learner) => {
    await api.post('/learners', learner);
    refetch();
  }, [refetch]);

  const handleUpdateLearner = useCallback(async (learner: Learner) => {
    await api.post('/learners', learner);
    refetch();
  }, [refetch]);

  const handleDeleteLearner = useCallback(async (learnerId: string) => {
    await api.del(`/learners/${learnerId}`);
    refetch();
  }, [refetch]);

  const handleUpdateAttendance = useCallback(async (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    const learner = data?.learners.find((l) => l.id === studentId);
    if (learner) {
      await api.post('/learners', { ...learner, attendanceStatus: status });
      refetch();
    }
  }, [data?.learners, refetch]);

  if (!user) return null;

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader portalLabel="Admin Portal" onOpenPasswordDialog={() => setShowPasswordDialog(true)} />
      <ChangePasswordDialog isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />

      <AdminDashboard
        learners={data.learners}
        enrolments={data.enrolments}
        events={data.events}
        payments={data.paymentHistory}
        parentProfiles={data.parentProfiles}
        registers={data.registers}
        onAddEvent={handleAddEvent}
        onApproveEnrolment={handleApproveEnrolment}
        onRejectEnrolment={handleRejectEnrolment}
        onResetEnrolmentStatus={handleResetEnrolmentStatus}
        onSendNotice={handleSendNotice}
        onResetDb={handleResetDb}
        onAddLearner={handleAddLearner}
        onUpdateLearner={handleUpdateLearner}
        onDeleteLearner={handleDeleteLearner}
        onUpdateAttendance={handleUpdateAttendance}
        onVerifyPayment={handleVerifyPayment}
        onRefreshData={() => refetch().then(() => {})}
      />
    </div>
  );
}
