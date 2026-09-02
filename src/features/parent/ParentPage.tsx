import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAllData } from '../../hooks/useAllData';
import ParentDashboard from '../../components/ParentDashboard';
import ChangePasswordDialog from '../../components/account/ChangePasswordDialog';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { api } from '../../lib/apiClient';
import type { PaymentItem, SchoolEvent, ChatMessage, ParentProfile } from '../../types';

export default function ParentPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch } = useAllData();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);

  const handleUpdateProfile = useCallback(async (updatedProfile: ParentProfile) => {
    await api.post('/parent-profile', updatedProfile);
    refetch();
  }, [refetch]);

  const handleAddMessage = useCallback(async (text: string) => {
    if (!user) return;
    const message: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'Parent',
      senderName: user.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parentEmail: user.email,
    };
    await api.post('/chats', message);
    refetch();
  }, [user, refetch]);

  const handleRsvpEvent = useCallback(async (eventId: string, status: 'Yes' | 'No' | 'Maybe') => {
    if (!user || !data) return;
    const event = data.events.find((e: SchoolEvent) => e.id === eventId);
    if (event) {
      const updatedRsvps = [
        ...(event.rsvps || []).filter((r) => r.parentName !== user.name),
        { parentName: user.name, count: 1, status },
      ];
      await api.post('/events', { ...event, rsvps: updatedRsvps });
      refetch();
    }
  }, [data, user, refetch]);

  const handleAddPayment = useCallback(async (item: PaymentItem) => {
    await api.post('/payments', item);
    refetch();
  }, [refetch]);

  const handleApplyOnline = useCallback(() => {
    navigate('/enrol');
  }, [navigate]);

  if (!user) return null;

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const selectedLearner =
    data.learners.find((l) => l.id === selectedLearnerId) || data.learners[0] || undefined;

  return (
    <div>
      <DashboardHeader portalLabel="Parent Portal" onOpenPasswordDialog={() => setShowPasswordDialog(true)} />
      <ChangePasswordDialog isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />

      <ParentDashboard
        learner={selectedLearner}
        profile={data.parentProfile || {
          name: user.name, email: user.email, phone: '', address: '',
          maritalStatus: 'Single', childLivesWith: 'Mother',
          mother: { title: '', surname: '', firstNames: '', idNumber: '', occupation: '', employer: '', telWork: '', telHome: '', cellNo: '', email: '', homeAddress: '', postalAddress: '', workAddress: '' },
          father: { title: '', surname: '', firstNames: '', idNumber: '', occupation: '', employer: '', telWork: '', telHome: '', cellNo: '', email: '', homeAddress: '', postalAddress: '', workAddress: '' },
        }}
        reports={data.progressReports}
        payments={data.paymentHistory}
        chatHistory={data.chatHistory}
        events={data.events}
        journalPosts={data.journalPosts}
        themes={data.themes}
        onAddMessage={handleAddMessage}
        onRsvpEvent={handleRsvpEvent}
        onAddPayment={handleAddPayment}
        onApplyOnline={handleApplyOnline}
        onUpdateProfile={handleUpdateProfile}
        parentLearners={data.learners}
        onSelectLearner={setSelectedLearnerId}
      />
    </div>
  );
}
