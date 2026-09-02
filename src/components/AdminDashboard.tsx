import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, DollarSign, Calendar as CalIcon, Truck, Plus, Mail, Check, Trash,
  ChevronDown, Search, Filter, AlertCircle, FileText, CheckCircle2, UserCheck, Trash2,
  RefreshCw, Database, Heart, ShieldAlert, Phone, MapPin, Clock, CreditCard, Download,
  Route
} from 'lucide-react';
import { Learner, EnrolmentApplication, SchoolEvent, PaymentItem, ParentProfile, MedicalProfile, TransportDetails, DailyRegister } from '../types';
import EnrollmentOverview from './EnrollmentOverview';
import { api } from '../lib/apiClient';

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  employmentDate: string;
  qualification: string;
}

interface AdminDashboardProps {
  learners: Learner[];
  enrolments: EnrolmentApplication[];
  events: SchoolEvent[];
  payments: PaymentItem[];
  parentProfiles?: { email: string; name: string; profile?: ParentProfile }[];
  registers?: DailyRegister[];
  onAddEvent: (event: SchoolEvent) => void;
  onApproveEnrolment: (enrolId: string, sendWelcomeEmail?: boolean) => void;
  onRejectEnrolment: (enrolId: string) => void;
  onResetEnrolmentStatus?: (enrolId: string, status: 'In Review' | 'Pending Approval') => void;
  onSendNotice: (parentName: string, amount: number) => void;
  onResetDb?: () => Promise<void>;
  onAddLearner?: (learner: Learner) => void;
  onUpdateLearner?: (learner: Learner) => Promise<void> | void;
  onDeleteLearner?: (learnerId: string) => void;
  onUpdateAttendance?: (studentId: string, status: 'Present' | 'Absent' | 'Excused') => Promise<void> | void;
  onVerifyPayment?: (paymentId: string, status: 'Paid' | 'Pending' | 'Overdue') => Promise<void> | void;
  onRefreshData?: () => Promise<void>;
}

export default function AdminDashboard({
  learners,
  enrolments,
  events,
  payments,
  parentProfiles = [],
  registers = [],
  onAddEvent,
  onApproveEnrolment,
  onRejectEnrolment,
  onResetEnrolmentStatus,
  onSendNotice,
  onResetDb,
  onAddLearner,
  onUpdateLearner,
  onDeleteLearner,
  onUpdateAttendance,
  onVerifyPayment,
  onRefreshData
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'staff' | 'enrolments' | 'calendar' | 'transport' | 'audit-logs'>('overview');
  
  // Custom states for student directory filters
  const [filterEnrollmentStatus, setFilterEnrollmentStatus] = useState<string>('all');
  const [filterTransportRoute, setFilterTransportRoute] = useState<string>('all');
  const [selectedTransportLearner, setSelectedTransportLearner] = useState<Learner | null>(null);

  // Bulk Email states
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailBody, setBulkEmailBody] = useState('');
  const [bulkEmailTemplate, setBulkEmailTemplate] = useState('custom');
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [bulkEmailSuccessMsg, setBulkEmailSuccessMsg] = useState<string | null>(null);
  const [bulkEmailErrorMsg, setBulkEmailErrorMsg] = useState<string | null>(null);

  // Selected enrolment for approval confirmation modal
  const [approvalModalApp, setApprovalModalApp] = useState<EnrolmentApplication | null>(null);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccessMsg, setApprovalSuccessMsg] = useState<string | null>(null);

  const handleApproveClick = (enrolId: string) => {
    const app = enrolments.find(e => e.id === enrolId);
    if (app) {
      setApprovalModalApp(app);
      setSendWelcomeEmail(true);
      setApprovalSuccessMsg(null);
    }
  };

  const handleTemplateChange = (tmpl: string) => {
    setBulkEmailTemplate(tmpl);
    if (tmpl === 'custom') {
      setBulkEmailSubject('');
      setBulkEmailBody('');
    } else if (tmpl === 'attendance') {
      setBulkEmailSubject('Kiddies Town: Attendance Status Notification');
      setBulkEmailBody(`Dear Parents,\n\nWe wanted to kindly update you regarding your child's attendance record at Kiddies Town today. Regular attendance helps us ensure academic consistency and support your child's overall developmental milestones.\n\nPlease reach out directly to Teacher Anne or consult the Parent Portal if you have any questions or need to submit any medical certificates.\n\nWarm regards,\nKiddies Town Administration`);
    } else if (tmpl === 'announcement') {
      setBulkEmailSubject('Kiddies Town: School Announcement & Update');
      setBulkEmailBody(`Dear Parents,\n\nWe hope this message finds you well.\n\nWe are writing to share some important upcoming updates regarding Kiddies Town campus events, schedules, and curriculum-focused themes. Please check the 'Calendar Events' and 'Weekly Themes' tabs inside your Parent Portal for more details.\n\nThank you for your continued partnership in early childhood development!\n\nWarm regards,\nKiddies Town Administration`);
    } else if (tmpl === 'transport') {
      setBulkEmailSubject('Kiddies Town: Transport Route Allocation Update');
      setBulkEmailBody(`Dear Parents,\n\nWe would like to inform you that your child's school transport route allocation has been updated by the administration.\n\nPlease check the 'Transport' panel in your Parent Portal to verify pickup schedules, vehicle registration numbers, and assigned driver details (including direct cell phone contacts).\n\nEnsuring safe, reliable, and punctual travel is our highest priority.\n\nWarm regards,\nKiddies Town Administration`);
    }
  };

  const handleSendBulkEmail = async () => {
    if (selectedStudentIds.length === 0) return;
    if (!bulkEmailSubject || !bulkEmailBody) {
      setBulkEmailErrorMsg("Please specify both subject and body message for parent notification.");
      return;
    }
    setIsSendingBulkEmail(true);
    setBulkEmailErrorMsg(null);
    setBulkEmailSuccessMsg(null);

    try {
      const data = await api.post<{ success: boolean; message?: string; error?: string }>('/admin/send-bulk-emails', {
        studentIds: selectedStudentIds,
        subject: bulkEmailSubject,
        body: bulkEmailBody,
        template: bulkEmailTemplate
      });
      if (data.success) {
        setBulkEmailSuccessMsg(data.message);
        setSelectedStudentIds([]);
        if (onRefreshData) {
          await onRefreshData();
        }
        await fetchAuditLogs();
        setTimeout(() => {
          setShowBulkEmailModal(false);
          setBulkEmailSuccessMsg(null);
        }, 3000);
      } else {
        setBulkEmailErrorMsg(data.error || "Failed to dispatch bulk notifications.");
      }
    } catch (err) {
      setBulkEmailErrorMsg("Network error: Could not contact email service.");
    } finally {
      setIsSendingBulkEmail(false);
    }
  };

  // Quick Parent Registry inline Form States
  const [showQuickParentForm, setShowQuickParentForm] = useState(false);
  const [quickParentName, setQuickParentName] = useState('');
  const [quickParentEmail, setQuickParentEmail] = useState('');
  const [quickParentSaving, setQuickParentSaving] = useState(false);
  const [quickParentError, setQuickParentError] = useState<string | null>(null);

  // System Audit Logs States
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('ALL');
  const [auditOperatorFilter, setAuditOperatorFilter] = useState<string>('ALL');

  // Dynamically extract all unique operators and action types from auditLogs
  const uniqueOperators = Array.from(new Set(auditLogs.map((log: any) => log.operatorId || ''))).filter(Boolean);
  const uniqueActionTypes = Array.from(new Set(auditLogs.map((log: any) => log.actionType || ''))).filter(Boolean);

  const filteredAuditLogs = auditLogs.filter((log: any) => {
    const query = auditSearchQuery.toLowerCase();
    const operatorMatches = (log.operatorId || '').toLowerCase().includes(query);
    const actionMatches = (log.actionType || '').toLowerCase().includes(query);
    const payloadStr = JSON.stringify(log.payload || {}).toLowerCase();
    const payloadMatches = payloadStr.includes(query);
    const matchesSearch = !query || operatorMatches || actionMatches || payloadMatches;

    const matchesAction = auditActionFilter === 'ALL' || log.actionType === auditActionFilter;
    const matchesOperator = auditOperatorFilter === 'ALL' || log.operatorId === auditOperatorFilter;

    return matchesSearch && matchesAction && matchesOperator;
  });

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await api.get<any[]>('/admin/audit-logs');
      setAuditLogs(data || []);
    } catch (e) {
      console.error("Error retrieving audit logs:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'audit-logs') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleQuickCreateParent = async () => {
    if (!quickParentName || !quickParentEmail) {
      setQuickParentError("Please fill in parent name and email address");
      return;
    }
    setQuickParentSaving(true);
    setQuickParentError(null);
    try {
      const data = await api.post<{ success: boolean; email?: string; error?: string; tempPassword?: string }>('/admin/create-parent', {
        name: quickParentName,
        email: quickParentEmail
      });
      if (data.success) {
        setStudParentEmail(data.email);
        setQuickParentName('');
        setQuickParentEmail('');
        setShowQuickParentForm(false);
        if (onRefreshData) {
          await onRefreshData();
        }
      } else {
        setQuickParentError(data.error || "Failed to create parent profile");
      }
    } catch (err) {
      setQuickParentError("Network error: Could not complete registration");
    } finally {
      setQuickParentSaving(false);
    }
  };
  
  // Database reset & sync states
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetDatabase = async () => {
    setResetting(true);
    setResetMessage(null);
    try {
      const result = await api.post<{ success: boolean; error?: string }>('/admin/reset-db', {});
      if (result.success) {
        setResetMessage("Success: Database reset & synchronized!");
        if (onResetDb) {
          await onResetDb();
        }
      } else {
        setResetMessage(`Error: ${result.error || 'Failed to sync'}`);
      }
    } catch (err: any) {
      setResetMessage("Error: Connection lost");
    } finally {
      setResetting(false);
      setTimeout(() => setResetMessage(null), 5000);
    }
  };

  // Staff Management Registry State
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 'staff-1',
      name: 'Teacher Anne',
      role: 'Lead Instructor (Tigers Room)',
      email: 'anne@kiddiestown.co.za',
      phone: '+27 82 453 1199',
      employmentDate: '2021-01-15',
      qualification: 'B.Ed in Early Childhood Development'
    },
    {
      id: 'staff-2',
      name: 'Mrs. Shineon Mofokeng',
      role: 'Principal & Executive Director',
      email: 'shineon@kiddiestown.co.za',
      phone: '+27 83 721 9831',
      employmentDate: '2018-06-01',
      qualification: 'M.Ed in Educational Management'
    },
    {
      id: 'staff-3',
      name: 'Teacher Beatrice',
      role: 'Lead Instructor (Giraffes Room)',
      email: 'beatrice@kiddiestown.co.za',
      phone: '+27 71 884 0233',
      employmentDate: '2022-04-10',
      qualification: 'Diploma in Early Childhood Studies'
    },
    {
      id: 'staff-4',
      name: 'Teacher Clara',
      role: 'Assistant Instructor (Roses Room)',
      email: 'clara@kiddiestown.co.za',
      phone: '+27 60 491 5566',
      employmentDate: '2023-10-01',
      qualification: 'Higher Certificate in Pre-School Education'
    },
    {
      id: 'staff-5',
      name: 'Mr. Sipho Ndlovu',
      role: 'Transport & Logistics Coordinator',
      email: 'sipho@kiddiestown.co.za',
      phone: '+27 79 382 1045',
      employmentDate: '2020-03-01',
      qualification: 'Code 10 PDP & First Aid Certified'
    },
    {
      id: 'staff-6',
      name: 'Miss Emily Watson',
      role: 'Administrative Clerk',
      email: 'emily@kiddiestown.co.za',
      phone: '+27 81 229 0481',
      employmentDate: '2024-02-15',
      qualification: 'National Diploma in Office Administration'
    }
  ]);

  // Form toggles
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);

  // Expanded parent profile for student placard
  const [expandedParentStudentId, setExpandedParentStudentId] = useState<string | null>(null);

  // Transport Routes state
  const [transportRoutes, setTransportRoutes] = useState([
    {
      id: 'route-1',
      name: 'Ster Park Bus Route (Route A)',
      driver: 'Mr. Sipho Ndlovu',
      driverPhone: '+27 79 382 1045',
      time: '07:00 AM',
      vehicle: 'Toyota Quantum (Reg: LND 452 LP)',
      capacity: 15,
      stops: ['Kiddies Town Campus', '7 Grimm Street', 'Munnik Avenue', 'Ster Park Shopping Plaza', 'Kiddies Town Campus'],
      learners: ['Leo Mbeki', 'Kabo Molefe']
    },
    {
      id: 'route-2',
      name: 'Polokwane CBD Shuttle (Route B)',
      driver: 'Mr. Sipho Ndlovu',
      driverPhone: '+27 79 382 1045',
      time: '07:15 AM',
      vehicle: 'Nissan NV350 (Reg: FDS 889 LP)',
      capacity: 15,
      stops: ['Kiddies Town Campus', '15 Hospital Road', 'Landros Mare Street', 'Grobler Street', 'Kiddies Town Campus'],
      learners: ['Thabo Junior', 'David Jones', 'Amara Khumalo']
    },
    {
      id: 'route-3',
      name: 'Flora Park Express (Route C)',
      driver: 'Mr. Sipho Ndlovu',
      driverPhone: '+27 79 382 1045',
      time: '07:40 AM',
      vehicle: 'Toyota Quantum (Reg: LND 452 LP)',
      capacity: 15,
      stops: ['Kiddies Town Campus', 'McDonald Street', 'Flora Park Dam', 'Marshall Street', 'Kiddies Town Campus'],
      learners: ['Sarah Smith']
    }
  ]);

  // Dynamically compute passengers on each route by combining initial learners and approved enrolment apps
  const computedTransportRoutes = transportRoutes.map(route => {
    const matchedFromApps = enrolments
      .filter(app => {
        if (app.status !== 'Approved') return false;
        if (!app.transportDetails?.needed) return false;
        
        // Match routeId based on pickup point or address
        const pickup = (app.transportDetails.pickUpPoint || '').toLowerCase();
        const address = (app.parentParticulars?.address || '').toLowerCase();
        
        if (route.id === 'route-1') {
          return pickup.includes('ster') || address.includes('ster') || (!pickup.includes('cbd') && !pickup.includes('flora') && !address.includes('cbd') && !address.includes('flora'));
        }
        if (route.id === 'route-2') {
          return pickup.includes('cbd') || address.includes('cbd') || pickup.includes('town') || address.includes('town');
        }
        if (route.id === 'route-3') {
          return pickup.includes('flora') || address.includes('flora');
        }
        return false;
      })
      .map(app => `${app.childParticulars?.preferredName || app.childParticulars?.firstNames || 'Unknown'} ${app.childParticulars?.surname || ''}`);

    const combined = Array.from(new Set([...route.learners, ...matchedFromApps]));
    return { ...route, learners: combined };
  });

  // Add Route form state
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteTime, setNewRouteTime] = useState('07:30 AM');
  const [newRouteDriver, setNewRouteDriver] = useState('Mr. Sipho Ndlovu');
  const [newRouteVehicle, setNewRouteVehicle] = useState('Toyota Quantum (Reg: LND 452 LP)');
  const [newRouteStops, setNewRouteStops] = useState('');
  const [newRouteLearners, setNewRouteLearners] = useState('');

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName || !newRouteStops) return;

    const routeStops = newRouteStops.split(',').map(s => s.trim()).filter(Boolean);
    const routeLearners = newRouteLearners ? newRouteLearners.split(',').map(l => l.trim()).filter(Boolean) : [];

    const newRoute = {
      id: 'route-' + Date.now(),
      name: newRouteName,
      driver: newRouteDriver,
      driverPhone: '+27 79 382 1045',
      time: newRouteTime,
      vehicle: newRouteVehicle,
      capacity: 15,
      stops: ['Kiddies Town Campus', ...routeStops, 'Kiddies Town Campus'],
      learners: routeLearners
    };

    setTransportRoutes([...transportRoutes, newRoute]);
    setNewRouteName('');
    setNewRouteStops('');
    setNewRouteLearners('');
    setShowAddRouteForm(false);
  };

  // Student form input states
  const [studFirstNames, setStudFirstNames] = useState('');
  const [studSurname, setStudSurname] = useState('');
  const [studPreferredName, setStudPreferredName] = useState('');
  const [studDob, setStudDob] = useState('');
  const [studIdNumber, setStudIdNumber] = useState('');
  const [studGender, setStudGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [studLanguage, setStudLanguage] = useState('English');
  const [studClass, setStudClass] = useState<'Roses' | 'Giraffes' | 'Tigers'>('Tigers');
  const [studParentEmail, setStudParentEmail] = useState('');

  // Selected student for detailed emergency/medical view modal
  const [selectedMedicalLearner, setSelectedMedicalLearner] = useState<Learner | null>(null);
  // Feedback alert for direct communication action
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // Staff form input states
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffDate, setStaffDate] = useState('');
  const [staffQual, setStaffQual] = useState('');

  // Submit Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studFirstNames || !studSurname || !studDob || !studParentEmail) {
      alert("All students must be linked to an existing parent account. Please select a parent.");
      return;
    }

    const newStudent: Learner = {
      id: 'student-' + Date.now(),
      surname: studSurname,
      firstNames: studFirstNames,
      preferredName: studPreferredName || studFirstNames,
      dob: studDob,
      idNumber: studIdNumber || '1901015000000',
      gender: studGender,
      homeLanguage: studLanguage,
      classType: studClass,
      attendanceStatus: 'Present',
      arrivedTime: '08:00',
      parentEmail: studParentEmail
    };

    if (onAddLearner) {
      onAddLearner(newStudent);
    }
    
    // Clear & close
    setStudFirstNames('');
    setStudSurname('');
    setStudPreferredName('');
    setStudDob('');
    setStudIdNumber('');
    setStudGender('Male');
    setStudLanguage('English');
    setStudClass('Tigers');
    setStudParentEmail('');
    setShowAddStudentForm(false);
  };

  // Submit Staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffRole || !staffEmail) return;

    const newStaff: Staff = {
      id: 'staff-' + Date.now(),
      name: staffName,
      role: staffRole,
      email: staffEmail,
      phone: staffPhone || '+27 82 000 0000',
      employmentDate: staffDate || new Date().toISOString().split('T')[0],
      qualification: staffQual || 'Qualified Instructor Certificate'
    };

    setStaffList(prev => [...prev, newStaff]);

    // Clear & close
    setStaffName('');
    setStaffRole('');
    setStaffEmail('');
    setStaffPhone('');
    setStaffDate('');
    setStaffQual('');
    setShowAddStaffForm(false);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList(prev => prev.filter(s => s.id !== staffId));
  };

  // Notice triggers State
  const [notifiedParents, setNotifiedParents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Add Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00 AM');
  const [newEventCategory, setNewEventCategory] = useState<'Event' | 'Extra-mural' | 'Holiday' | 'Incursion'>('Event');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventSuccess, setEventSuccess] = useState(false);

  // Send Notice helper
  const triggerArrearsNotice = (parentName: string, amount: number) => {
    onSendNotice(parentName, amount);
    setNotifiedParents([...notifiedParents, parentName]);
    setTimeout(() => {
      setNotifiedParents(prev => prev.filter(name => name !== parentName));
    }, 4500);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    const nEvent: SchoolEvent = {
      id: 'event-' + Date.now(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      category: newEventCategory,
      description: newEventDesc,
      rsvps: []
    };

    onAddEvent(nEvent);
    setEventSuccess(true);
    
    // Reset Form
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    
    setTimeout(() => {
      setEventSuccess(false);
    }, 3000);
  };

  // Calculations for Arrears List
  const delinquentAccounts = [
    { id: 'da-1', parentName: 'Sarah Mbeki', childName: 'Leo Mbeki', amount: 2500, daysOverdue: 9, email: 'sarah.mbeki@mail.com' },
    { id: 'da-2', parentName: 'John Doe', childName: 'Samantha Doe', amount: 1200, daysOverdue: 4, email: 'john@doe.co.za' },
  ];

  // Calculations for Active/Pending counters
  const totalStudents = learners.length;
  const pendingApps = enrolments.filter(e => e.status !== 'Approved' && e.status !== 'Rejected');
  const pendingEnrolmentsCount = pendingApps.length;
  const dailyActiveChildren = learners.filter(l => l.attendanceStatus === 'Present').length;

  // Real attendance trend computed from teacher-submitted daily registers (last 5 dates).
  const todayISO = new Date().toISOString().split('T')[0];
  const todaysRegister = registers.find((r) => r.date === todayISO);

  const attendanceGraphData = (() => {
    const sorted = [...registers].sort((a, b) => a.date.localeCompare(b.date)).slice(-5);
    return sorted.map((reg) => {
      const decided = reg.entries.filter((e) => e.status !== 'Pending');
      const presentCount = decided.filter((e) => e.status === 'Present').length;
      const total = reg.entries.length || 1;
      const presentPct = Math.round((presentCount / total) * 100);
      return {
        date: reg.date,
        day: new Date(`${reg.date}T00:00:00`).toLocaleDateString('en-ZA', { weekday: 'short' }),
        present: presentPct,
        absent: 100 - presentPct,
        submittedBy: reg.submittedBy || 'Teacher',
        isToday: reg.date === todayISO,
      };
    });
  })();

  // Filtered Learners lists for pipeline view
  const filteredLearners = learners.filter(l => {
    const query = searchQuery.toLowerCase();
    const studentNameMatches = `${l.firstNames} ${l.surname}`.toLowerCase().includes(query);
    const parentEmailMatches = (l.parentEmail || '').toLowerCase().includes(query);
    const classTypeMatches = (l.classType || '').toLowerCase().includes(query);
    
    let parentNameMatches = false;
    if (l.parentEmail) {
      const parent = parentProfiles.find(p => p.email.toLowerCase().trim() === l.parentEmail?.toLowerCase().trim());
      if (parent && parent.name.toLowerCase().includes(query)) {
        parentNameMatches = true;
      }
    }
    const matchesSearch = !query || studentNameMatches || parentEmailMatches || parentNameMatches || classTypeMatches;

    const matchesClass = filterClass === 'all' || l.classType === filterClass;

    let matchesEnrollment = true;
    if (filterEnrollmentStatus === 'Approved') {
      matchesEnrollment = l.enrolmentApproved !== false && l.attendanceStatus !== 'Pending';
    } else if (filterEnrollmentStatus === 'Pending') {
      matchesEnrollment = l.enrolmentApproved === false || l.attendanceStatus === 'Pending';
    }

    let matchesTransportRoute = true;
    if (filterTransportRoute === 'unassigned') {
      matchesTransportRoute = !l.transportRouteId;
    } else if (filterTransportRoute !== 'all') {
      matchesTransportRoute = l.transportRouteId === filterTransportRoute;
    }

    return matchesSearch && matchesClass && matchesEnrollment && matchesTransportRoute;
  });

  const downloadStudentsCSV = () => {
    // CSV Header
    const headers = ["ID", "First Names", "Surname", "Preferred Name", "Date of Birth", "ID Number", "Gender", "Home Language", "Classroom Allocation", "Attendance Status", "Arrival Time", "Parent Email", "Transport Needed"];
    
    // CSV Rows
    const rows = filteredLearners.map(l => [
      l.id,
      l.firstNames,
      l.surname,
      l.preferredName,
      l.dob,
      l.idNumber || '',
      l.gender,
      l.homeLanguage,
      l.classType,
      l.attendanceStatus,
      l.arrivedTime || '',
      l.parentEmail || '',
      l.transportNeeded ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kiddies_town_students_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPaymentsCSV = () => {
    // CSV Header
    const headers = ["ID", "Parent Name", "Child Name", "Amount (ZAR)", "Days Overdue", "Email"];
    
    // CSV Rows
    const rows = delinquentAccounts.map(ac => [
      ac.id,
      ac.parentName,
      ac.childName,
      ac.amount,
      ac.daysOverdue,
      ac.email
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kiddies_town_arrears_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBackupJSON = () => {
    const backupData = {
      backup_version: "1.0",
      exported_at: new Date().toISOString(),
      learners: learners,
      enrolments: enrolments,
      payments: payments
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kiddies_town_database_backup_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderEntityDetails = (log: any) => {
    const p = log.payload || {};
    switch (log.actionType) {
      case 'ATTENDANCE_UPDATE':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Attendance marked for {p.name || 'Student'}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              Status: <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{p.newStatus}</span> (was {p.previousStatus || 'Pending'})
            </span>
          </div>
        );
      case 'STUDENT_PROFILE_CHANGE':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Profile modified for {p.name || 'Student'}</span>
            <span className="text-[10px] text-slate-500 font-mono">ID: {p.id} {p.parentEmail ? `| Parent: ${p.parentEmail}` : ''}</span>
          </div>
        );
      case 'FEE_ADJUSTMENT':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Fee invoice adjusted: {p.description || 'Fees'}</span>
            <span className="text-[10px] text-slate-500">
              Amount: <span className="font-bold text-slate-700">R{Number(p.amount).toLocaleString()}</span> | Status: <span className="font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{p.status}</span>
            </span>
          </div>
        );
      case 'RECORD_PAYMENT':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Payment recorded: R{Number(p.amount).toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-mono">{p.description || ''}</span>
          </div>
        );
      case 'CREATE_STUDENT':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Enrolled new student: {p.name || 'Student'}</span>
            <span className="text-[10px] text-slate-500 font-mono">ID: {p.id} {p.parentEmail ? `| Parent: ${p.parentEmail}` : ''}</span>
          </div>
        );
      case 'DELETE_STUDENT':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Deleted student profile</span>
            <span className="text-[10px] text-slate-500 font-mono">ID: {p.id} {p.name ? `| Name: ${p.name}` : ''}</span>
          </div>
        );
      case 'CREATE_PARENT_PROFILE_QUICK':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Quick Parent Profile Created</span>
            <span className="text-[10px] text-slate-500">{p.name} ({p.email})</span>
          </div>
        );
      case 'SAVE_PROGRESS_REPORT':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Progress report saved</span>
            <span className="text-[10px] text-slate-500">Term: {p.term} | Student ID: {p.studentId}</span>
          </div>
        );
      case 'RESET_DB':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800 text-amber-700">Database hard reset</span>
            <span className="text-[10px] text-slate-500">Store: {p.store}</span>
          </div>
        );
      case 'BULK_EMAIL_DISPATCH':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800">Bulk Email Dispatch: {p.subject}</span>
            <span className="text-[10px] text-slate-500 font-medium">
              Notified <span className="font-bold text-indigo-600">{p.parentCount} parents</span> for <span className="font-bold text-indigo-600">{p.studentCount} students</span>.
            </span>
            <p className="text-[10px] text-slate-400 italic mt-0.5 max-w-md truncate">"{p.bodyPreview}"</p>
          </div>
        );
      default:
        return (
          <span className="text-xs text-slate-600 font-semibold font-mono" title={JSON.stringify(p)}>
            {JSON.stringify(p)}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 bg-slate-50/50 min-h-screen p-4 md:p-8 rounded-3xl">
      {/* Summary Header displaying key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Metric 1 */}
        <div id="metric-total-active" className="glass-card rounded-3xl p-6 flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="space-y-1 z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 block">Total Active Learners</span>
            <span className="text-4xl font-black text-slate-800 font-mono tracking-tight block gradient-text bg-gradient-to-r from-indigo-600 to-violet-600">{totalStudents}</span>
            <span className="text-[11px] text-slate-500 font-medium block">Approved student directory</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0 z-10 transform group-hover:scale-110 transition-transform duration-500">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 2 */}
        <div id="metric-pending-enrolments" className="glass-card rounded-3xl p-6 flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="space-y-1 z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-500 block">Pending Enrolments</span>
            <span className="text-4xl font-black text-slate-800 font-mono tracking-tight block gradient-text bg-gradient-to-r from-amber-500 to-orange-500">{pendingEnrolmentsCount}</span>
            <span className="text-[11px] text-slate-500 font-medium block">Applications awaiting onboarding</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0 z-10 transform group-hover:scale-110 transition-transform duration-500">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 3 */}
        <div id="metric-daily-active" className="glass-card rounded-3xl p-6 flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="space-y-1 z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 block">Daily Active Children</span>
            <span className="text-4xl font-black text-slate-800 font-mono tracking-tight block gradient-text bg-gradient-to-r from-emerald-500 to-teal-500">{dailyActiveChildren}</span>
            <span className="text-[11px] text-slate-500 font-medium block">Present at school today</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0 z-10 transform group-hover:scale-110 transition-transform duration-500">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Modern Navigation Panel */}
      <div className="flex flex-row overflow-x-auto lg:flex-wrap glass-card p-2 rounded-2xl gap-2 w-full shadow-lg shadow-slate-200/50 animate-slide-up hide-scrollbar" style={{ animationDelay: '0.2s' }}>
        {[
          { id: 'overview', label: 'Admin Overview', icon: Users },
          { id: 'students', label: 'Student Directory', icon: UserCheck },
          { id: 'staff', label: 'Staff Roster', icon: Users },
          { id: 'enrolments', label: 'Enrolment Pipeline', icon: FileText },
          { id: 'calendar', label: 'Calendar Planner', icon: CalIcon },
          { id: 'transport', label: 'Transport & Logistics', icon: Truck },
          { id: 'audit-logs', label: 'System Audit Logs', icon: ShieldAlert },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap overflow-hidden ${
                isActive ? 'text-white shadow-md' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {/* TAB 1: ADMIN OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Arrears Alerts Banner list */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="xl:col-span-2 glass-card rounded-3xl p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/50">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                        Active Arrears Accounts
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 font-medium">Generate direct notices to parent profiles immediately</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={downloadPaymentsCSV}
                        className="px-3 py-2 bg-white/80 hover:bg-white text-indigo-600 font-bold text-[11px] uppercase rounded-xl transition-all shadow-sm border border-slate-200/60 flex items-center gap-2 cursor-pointer hover-lift"
                        title="Download Arrears CSV Report"
                      >
                        <Download className="w-3 h-3" />
                        Download Report
                      </button>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                        Action Required
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {delinquentAccounts.map((ac) => {
                      const isNotified = notifiedParents.includes(ac.parentName);
                      return (
                        <div key={ac.id} className="p-5 bg-white/60 hover:bg-white transition-all rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover-lift">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h5 className="font-extrabold text-sm text-slate-800">{ac.parentName}</h5>
                              <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200/60 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                                {ac.daysOverdue} Days Overdue
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">Learner: <span className="font-semibold text-slate-700">{ac.childName}</span> • Total Overdue: <span className="font-mono font-black text-rose-600 text-sm">R{ac.amount}</span></p>
                          </div>

                          <button
                            onClick={() => triggerArrearsNotice(ac.parentName, ac.amount)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-sm ${
                              isNotified
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
                                : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:shadow-slate-800/20 hover-lift'
                            }`}
                            disabled={isNotified}
                          >
                            {isNotified ? (
                              <>
                                <Check className="w-4 h-4 stroke-[3]" />
                                Notice Sent!
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                Send Warning
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance counters */}
                <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-indigo-50 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <h4 className="font-black text-xs uppercase tracking-widest text-indigo-200">Kiddies Town Pipeline</h4>
                    <p className="text-xs text-indigo-200/80 mt-1.5 font-medium">System dashboard controls</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-8 relative z-10">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                      <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Enrolled</p>
                      <p className="text-3xl font-mono font-black mt-2 text-white">{totalStudents}</p>
                    </div>

                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                      <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Pipeline Apps</p>
                      <p className="text-3xl font-mono font-black mt-2 text-white">{pendingEnrolmentsCount}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3 relative z-10">
                    <button
                      type="button"
                      onClick={downloadBackupJSON}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold text-[11px] uppercase py-3 px-4 rounded-xl transition-all cursor-pointer backdrop-blur-sm border border-emerald-500/30"
                    >
                      <Download className="w-4 h-4" />
                      Backup System
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDatabase}
                      disabled={resetting}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-extrabold text-[11px] uppercase py-3 px-4 rounded-xl transition-all cursor-pointer backdrop-blur-sm border border-white/10"
                    >
                      <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
                      {resetting ? 'Synchronizing...' : 'Sync & Reset DB'}
                    </button>
                    {resetMessage && (
                      <p className="text-[10px] text-amber-300 font-bold mt-2 text-center font-mono">
                        {resetMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* DEDICATED ENROLLMENT PIPELINE SECTION */}
              <div className="glass-card rounded-3xl p-8 shadow-sm space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Enrollment Pipeline (Pending Action)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Directly onboard pending child applications into the active student directory, assign to classrooms, and auto-generate initial tuition invoices.
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 w-fit shrink-0">
                    {pendingApps.length} Pending Onboarding
                  </span>
                </div>

                {pendingApps.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200/80">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-black text-slate-800">No Pending Applications!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your enrollment pipeline is 100% clean. All registered kiddies have been approved and moved to active registers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingApps.map((app) => {
                      const child = app.childParticulars;
                      const parent = app.parentParticulars;
                      const hasTransport = app.transportDetails?.needed;
                      const pEmail = app.parentParticulars?.email || app.parentParticulars?.mother?.email || 'parent@kiddiestown.co.za';
                      
                      return (
                        <div key={app.id} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all duration-200 flex flex-col justify-between shadow-2xs group relative overflow-hidden">
                          {/* Top Design Accent line */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />
                          
                          <div className="space-y-4">
                            {/* Header details */}
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="px-2.5 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {child.classType || 'Giraffes'} Room
                                </span>
                                <h5 className="font-extrabold text-slate-900 text-base mt-2 leading-tight">
                                  {child.firstNames || 'Unnamed'} {child.surname || 'Child'}
                                </h5>
                                <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">ID No: {child.idNumber || 'No national ID provided'}</p>
                              </div>
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-150 px-2 py-0.5 rounded-lg font-black tracking-wider uppercase shrink-0">
                                Step {app.step}/6
                              </span>
                            </div>

                            {/* Parent Details card block */}
                            <div className="p-3 bg-white group-hover:bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 transition-colors">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Parent Contact Profile</p>
                              <div className="text-[11px] font-extrabold text-slate-800 leading-none">
                                {parent?.name || (parent?.mother?.firstNames ? `${parent.mother.firstNames} Zulu` : 'Registered Parent')}
                              </div>
                              <div className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1.5 leading-tight truncate select-all">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {pEmail}
                              </div>
                              {parent?.phone && (
                                <div className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1.5 leading-none">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {parent.phone}
                                </div>
                              )}
                            </div>

                            {/* Essential child specifications */}
                            <div className="grid grid-cols-2 gap-2.5 text-[10.5px] font-bold text-slate-500">
                              <div className="flex items-center gap-1.5 bg-white/40 p-2 rounded-lg border border-slate-200/50">
                                <span className="text-slate-400 font-medium">DOB:</span>
                                <span className="text-slate-800 font-mono font-black">{child.dob || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-white/40 p-2 rounded-lg border border-slate-200/50">
                                <span className="text-slate-400 font-medium">Lang:</span>
                                <span className="text-slate-800 font-black">{child.homeLanguage || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Transport requirement block */}
                            <div className="flex items-center justify-between text-[11px] font-bold px-1">
                              <span className="text-slate-400 font-semibold">School Transport Service:</span>
                              {hasTransport ? (
                                <span className="flex items-center gap-1 text-indigo-600 font-black bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg uppercase tracking-wider text-[10px]">
                                  <Truck className="w-3.5 h-3.5" />
                                  Required
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-200/60 border border-slate-200 px-2 py-0.5 rounded-lg font-black uppercase">Not Needed</span>
                              )}
                            </div>
                          </div>

                          {/* Quick Action Trigger button */}
                          <div className="mt-5 pt-3.5 border-t border-slate-200/80">
                            <button
                              type="button"
                              onClick={() => handleApproveClick(app.id)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] uppercase py-2.5 px-4 rounded-xl shadow-sm border border-emerald-500/30 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 select-none hover:shadow-md"
                            >
                              <UserCheck className="w-4 h-4" />
                              Approve & Onboard Student
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sub Graphs Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Custom Attendance Bar chart — fed by teacher-submitted daily registers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Daily Attendance Register Overview</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mb-6">
                        Live data from registers submitted by teachers (latest 5 days)
                      </p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      todaysRegister
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {todaysRegister ? `Today: submitted by ${todaysRegister.submittedBy || 'Teacher'}` : 'Today: awaiting register'}
                    </span>
                  </div>

                  {attendanceGraphData.length === 0 ? (
                    <div className="h-56 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                        <Clock className="w-7 h-7 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">No registers submitted yet</p>
                      <p className="text-xs text-slate-400 font-medium mt-1.5 max-w-xs leading-relaxed">
                        Once teachers submit the daily attendance register from their portal, the statistics will appear here automatically.
                      </p>
                    </div>
                  ) : (
                  <div className="h-56 relative border-l border-b border-slate-100/80 pl-8 pb-8 flex justify-around items-end">
                    {/* Y-Axis guide lines */}
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-12 text-[10px] text-slate-300 font-mono">50%</div>
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-24 text-[10px] text-slate-300 font-mono">75%</div>
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-36 text-[10px] text-slate-300 font-mono">100%</div>

                    {attendanceGraphData.map((data, idx) => (
                      <div key={idx} className={`flex flex-col items-center gap-2 group relative z-10 w-12 ${data.isToday ? 'bg-indigo-50/60 rounded-t-xl -m-1 p-1' : ''}`} title={data.isToday ? "Today's register" : `Submitted by ${data.submittedBy}`}>
                        {/* Attendance pills stacked */}
                        <div className="w-full flex flex-col justify-end gap-0.5 h-36">
                          {/* Present Bar (Green) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.present}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="bg-emerald-500 rounded-t-sm w-full font-mono font-bold text-[9px] text-white flex items-end justify-center pb-1 select-none"
                            title={`Present: ${data.present}%`}
                          >
                            {data.present > 40 && `${data.present}%`}
                          </motion.div>
                          {/* Absent Bar (Red) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.absent}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="bg-rose-400/90 rounded-b-sm w-full font-mono font-bold text-[9px] text-rose-50 flex items-start justify-center pt-0.5 cursor-pointer"
                            title={`Absent: ${data.absent}%`}
                          >
                            {data.absent > 10 && `${data.absent}%`}
                          </motion.div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{data.day}</span>
                        <span className="text-[9px] font-mono text-slate-400">{data.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                  )}
                </div>

                {/* Transport distribution Doughnut chart + Legend specs */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Transport Logistics distribution</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mb-6">Learner geographic distribution areas for school transport planning</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* SVG Doughnut Circle */}
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Gray base segment */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                        {/* Ster Park: 55% Segment (Indigo) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="4.2" strokeDasharray="55 45" strokeDashoffset="0" />
                        {/* Flora Park: 30% Segment (Emerald) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-55" />
                        {/* CBD: 15% Segment (Amber) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-85" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-mono font-black text-slate-800">100%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Represented</span>
                      </div>
                    </div>

                    {/* Interactive Legend parameters */}
                    <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-indigo-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Ster Park (55%)</p>
                          <p className="text-[10px] text-slate-400">Primary Pick-up zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Flora Park (30%)</p>
                          <p className="text-[10px] text-slate-400">Secondary zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Polokwane CBD (15%)</p>
                          <p className="text-[10px] text-slate-400">Arranged bus pickups</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDENT DIRECTORY */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-fade-in">
              {/* Directory Welcome & Stats Header */}
              <div className="glass-card rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="z-10">
                  <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Student Database Directory</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium max-w-lg leading-relaxed">
                    Manage enrollment registry, class room allocation, and personal profiles for all registered kiddies.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start md:self-auto z-10">
                  <button
                    onClick={downloadStudentsCSV}
                    className="px-5 py-2.5 bg-white/80 hover:bg-white text-indigo-600 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm border border-slate-200/60 hover-lift"
                    title="Download Students CSV Report"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover-lift"
                  >
                    <Plus className="w-4 h-4" />
                    {showAddStudentForm ? 'Cancel Registration' : 'Enroll New Student'}
                  </button>
                </div>
              </div>

              {/* Real-time Search Input Bar at the top of pane */}
              <div id="student-directory-search-bar" className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
                <div className="relative group">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search instantly by student name, class (e.g. Roses, Giraffes, Tigers), parent name, or email..."
                    className="w-full bg-white/50 border border-slate-200/60 pl-12 pr-12 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-sm backdrop-blur-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-slate-200/60 hover:bg-slate-200 px-2 py-1 rounded-md cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span>Filtering {filteredLearners.length} of {learners.length} total students</span>
                  </div>
                  {searchQuery && (
                    <span className="font-mono text-[10.5px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                      Active Query: "{searchQuery}"
                    </span>
                  )}
                </div>
              </div>

              {/* Add Student Form */}
              {showAddStudentForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border-2 border-indigo-100 shadow-md space-y-4"
                >
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Student Admission Form
                  </h4>
                  <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">First Names *</label>
                      <input 
                        type="text" 
                        required
                        value={studFirstNames}
                        onChange={(e) => setStudFirstNames(e.target.value)}
                        placeholder="e.g. Leo David"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Surname *</label>
                      <input 
                        type="text" 
                        required
                        value={studSurname}
                        onChange={(e) => setStudSurname(e.target.value)}
                        placeholder="e.g. Mbeki"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Preferred Name</label>
                      <input 
                        type="text" 
                        value={studPreferredName}
                        onChange={(e) => setStudPreferredName(e.target.value)}
                        placeholder="e.g. Leo"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Date of Birth *</label>
                      <input 
                        type="date" 
                        required
                        value={studDob}
                        onChange={(e) => setStudDob(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">ID Number (Optional)</label>
                      <input 
                        type="text" 
                        value={studIdNumber}
                        onChange={(e) => setStudIdNumber(e.target.value)}
                        placeholder="13-digit ID Number"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Gender *</label>
                      <select 
                        value={studGender}
                        onChange={(e) => setStudGender(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Home Language</label>
                      <input 
                        type="text" 
                        value={studLanguage}
                        onChange={(e) => setStudLanguage(e.target.value)}
                        placeholder="e.g. Sesotho / English"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Classroom Allocation *</label>
                      <select 
                        value={studClass}
                        onChange={(e) => setStudClass(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="Roses">Roses (2-3 yrs)</option>
                        <option value="Giraffes">Giraffes (3-4 yrs)</option>
                        <option value="Tigers">Tigers (4-5 yrs)</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase">Linked Parent Email *</label>
                        <button
                          type="button"
                          onClick={() => setShowQuickParentForm(!showQuickParentForm)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold uppercase flex items-center gap-0.5 cursor-pointer select-none"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {showQuickParentForm ? "Close" : "Quick-Add Parent"}
                        </button>
                      </div>
                      <select 
                        value={studParentEmail}
                        onChange={(e) => setStudParentEmail(e.target.value)}
                        required={!showQuickParentForm}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="">-- Select Parent Account --</option>
                        {parentProfiles.map((p) => (
                          <option key={p.email} value={p.email}>
                            {p.name} ({p.email})
                          </option>
                        ))}
                      </select>

                      {showQuickParentForm && (
                        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 mt-2">
                          <p className="text-[10px] font-black text-indigo-900 uppercase tracking-wider">Quick-Register Parent</p>
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={quickParentName}
                              onChange={(e) => setQuickParentName(e.target.value)}
                              placeholder="Parent Full Name"
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-hidden"
                            />
                            <input
                              type="email"
                              value={quickParentEmail}
                              onChange={(e) => setQuickParentEmail(e.target.value)}
                              placeholder="Parent Email"
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-hidden"
                            />
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={handleQuickCreateParent}
                                disabled={quickParentSaving}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer"
                              >
                                {quickParentSaving ? "Saving..." : "Save Parent"}
                              </button>
                            </div>
                            {quickParentError && (
                              <p className="text-[9.5px] text-rose-600 font-bold font-mono mt-0.5">{quickParentError}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm mr-2"
                      >
                        Submit Student Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddStudentForm(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-705 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Filters Panel */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student, parent name or email..."
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-3 justify-start xl:justify-end">
                  {/* Class Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Class</span>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">All Classes</option>
                      <option value="Roses">Roses Class</option>
                      <option value="Giraffes">Giraffes Class</option>
                      <option value="Tigers">Tigers Class</option>
                    </select>
                  </div>

                  {/* Enrollment Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                    <select
                      value={filterEnrollmentStatus}
                      onChange={(e) => setFilterEnrollmentStatus(e.target.value)}
                      className="border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Approved">Approved / Enrolled</option>
                      <option value="Pending">Pending Approval</option>
                    </select>
                  </div>

                  {/* Transport Route Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Transport</span>
                    <select
                      value={filterTransportRoute}
                      onChange={(e) => setFilterTransportRoute(e.target.value)}
                      className="border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">All Routes</option>
                      <option value="unassigned">No Assigned Route</option>
                      {transportRoutes.map(route => (
                        <option key={route.id} value={route.id}>{route.name}</option>
                      ))}
                    </select>
                  </div>

                  {(searchQuery || filterClass !== 'all' || filterEnrollmentStatus !== 'all' || filterTransportRoute !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterClass('all');
                        setFilterEnrollmentStatus('all');
                        setFilterTransportRoute('all');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer select-none"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Selection & Bulk Action Bar */}
              {filteredLearners.length > 0 && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={filteredLearners.length > 0 && selectedStudentIds.length === filteredLearners.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudentIds(filteredLearners.map(l => l.id));
                          } else {
                            setSelectedStudentIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                      />
                      <span>Select All on Page ({filteredLearners.length})</span>
                    </label>
                    {selectedStudentIds.length > 0 && (
                      <span className="text-xs font-black text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full animate-fade-in">
                        {selectedStudentIds.length} Selected
                      </span>
                    )}
                  </div>

                  {selectedStudentIds.length > 0 ? (
                    <button
                      onClick={() => {
                        setBulkEmailSubject('');
                        setBulkEmailBody('');
                        setBulkEmailTemplate('custom');
                        setBulkEmailSuccessMsg(null);
                        setBulkEmailErrorMsg(null);
                        setShowBulkEmailModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Bulk Email Parents
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic text-right">Select student cards to send bulk templates</span>
                  )}
                </div>
              )}

              {/* Grid Layout of Student Directory list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLearners.length > 0 ? (
                  filteredLearners.map((student) => {
                    const dobYear = new Date(student.dob).getFullYear();
                    const age = new Date().getFullYear() - dobYear;
                    const isCardSelected = selectedStudentIds.includes(student.id);
                    
                    return (
                      <div 
                        key={student.id} 
                        className={`bg-white rounded-2xl border transition-all p-5 shadow-xs relative overflow-hidden flex flex-col justify-between ${
                          isCardSelected ? 'border-indigo-500/80 ring-2 ring-indigo-500/5 bg-indigo-50/5' : 'border-slate-200'
                        }`}
                      >
                        {/* Upper highlight bar for Class Rooms */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          student.classType === 'Roses' ? 'bg-rose-400' : student.classType === 'Giraffes' ? 'bg-emerald-400' : 'bg-indigo-400'
                        }`} />

                        <div>
                          <div className="flex justify-between items-start mb-3 pl-2.5">
                            <div className="flex items-start gap-3">
                              {/* Selection Checkbox */}
                              <input
                                type="checkbox"
                                checked={isCardSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIds(prev => [...prev, student.id]);
                                  } else {
                                    setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                                  }
                                }}
                                className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer shrink-0"
                              />
                              <div>
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                  student.classType === 'Roses' 
                                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                    : student.classType === 'Giraffes' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}>
                                  {student.classType} Room
                                </span>
                                {student.enrolmentApproved === false && (
                                  <span className="ml-1.5 px-2 py-0.5 rounded text-[9.5px] font-bold bg-amber-50 text-amber-700 border border-amber-150 uppercase tracking-wider">
                                    Pending Approval
                                  </span>
                                )}
                                <h4 className="font-extrabold text-slate-900 text-sm mt-2">{student.firstNames} {student.surname}</h4>
                                <p className="text-[10px] text-slate-400 font-medium">Preferred: "{student.preferredName}"</p>
                              </div>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
                              {student.firstNames[0]}{student.surname[0]}
                            </div>
                          </div>

                          <div className="space-y-2 text-[11px] text-slate-500 border-t border-slate-50 pt-3 pl-2.5">
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-400">Date of Birth:</span>
                              <span className="font-mono text-slate-700">{student.dob} ({age} yrs old)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-400">ID Number:</span>
                              <span className="font-mono text-slate-700">{student.idNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-400">Gender & Language:</span>
                              <span className="text-slate-700">{student.gender} • {student.homeLanguage}</span>
                            </div>
                            {student.parentEmail && (() => {
                              const matchingParent = parentProfiles.find(
                                (p) => p.email.toLowerCase().trim() === student.parentEmail?.toLowerCase().trim()
                              );
                              const isExpanded = expandedParentStudentId === student.id;

                              return (
                                <div className="mt-2 border-t border-slate-100 pt-2.5 flex flex-col gap-1.5 pl-2.5">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-semibold text-slate-400">Parent Link:</span>
                                    <button
                                      type="button"
                                      onClick={() => setExpandedParentStudentId(isExpanded ? null : student.id)}
                                      className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer flex items-center gap-1 focus:outline-hidden"
                                    >
                                      <span className="truncate max-w-[130px]">{matchingParent ? matchingParent.name : student.parentEmail}</span>
                                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                  </div>

                                  {isExpanded && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="mt-2.5 bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-3 text-[10.5px] text-slate-600 overflow-hidden"
                                    >
                                      {matchingParent?.profile ? (
                                        <>
                                          <div className="space-y-1">
                                            <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px] border-b border-slate-200 pb-0.5">Primary Contact Info</p>
                                            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                                              <div>
                                                <span className="text-slate-400 font-semibold block text-[8.5px] uppercase">Marital Status</span>
                                                <span className="text-slate-800 font-bold">{matchingParent.profile.maritalStatus || 'N/A'}</span>
                                              </div>
                                              <div>
                                                <span className="text-slate-400 font-semibold block text-[8.5px] uppercase">Child Lives With</span>
                                                <span className="text-slate-800 font-bold">{matchingParent.profile.childLivesWith || 'N/A'}</span>
                                              </div>
                                              <div className="col-span-2">
                                                <span className="text-slate-400 font-semibold block text-[8.5px] uppercase">Primary Address</span>
                                                <span className="text-slate-800 font-medium leading-tight">{matchingParent.profile.address || 'N/A'}</span>
                                              </div>
                                            </div>
                                          </div>

                                          {matchingParent.profile.mother && matchingParent.profile.mother.firstNames && (
                                            <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-100">
                                              <p className="font-bold text-indigo-700 uppercase tracking-wider text-[9px] border-b border-indigo-50 pb-0.5 flex justify-between">
                                                <span>Mother Particulars</span>
                                                <span className="text-slate-400 font-mono text-[8px]">{matchingParent.profile.mother.title}</span>
                                              </p>
                                              <p className="text-slate-800 font-extrabold text-[10.5px]">{matchingParent.profile.mother.firstNames} {matchingParent.profile.mother.surname}</p>
                                              <div className="text-[10px] text-slate-500 space-y-0.5 pt-0.5 font-medium">
                                                <p><span className="text-slate-400">Cell:</span> <span className="font-mono text-slate-700 font-semibold">{matchingParent.profile.mother.cellNo || 'N/A'}</span></p>
                                                <p><span className="text-slate-400">Email:</span> <span className="font-mono text-slate-700">{matchingParent.profile.mother.email || 'N/A'}</span></p>
                                                <p className="truncate"><span className="text-slate-400">Occupation:</span> <span className="text-slate-700">{matchingParent.profile.mother.occupation || 'N/A'}</span></p>
                                                <p className="truncate"><span className="text-slate-400">Employer:</span> <span className="text-slate-700">{matchingParent.profile.mother.employer || 'N/A'}</span></p>
                                              </div>
                                            </div>
                                          )}

                                          {matchingParent.profile.father && matchingParent.profile.father.firstNames && (
                                            <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-100">
                                              <p className="font-bold text-emerald-700 uppercase tracking-wider text-[9px] border-b border-emerald-50 pb-0.5 flex justify-between">
                                                <span>Father Particulars</span>
                                                <span className="text-slate-400 font-mono text-[8px]">{matchingParent.profile.father.title}</span>
                                              </p>
                                              <p className="text-slate-800 font-extrabold text-[10.5px]">{matchingParent.profile.father.firstNames} {matchingParent.profile.father.surname}</p>
                                              <div className="text-[10px] text-slate-500 space-y-0.5 pt-0.5 font-medium">
                                                {matchingParent.profile.father.cellNo && (
                                                  <p><span className="text-slate-400">Cell:</span> <span className="font-mono text-slate-700 font-semibold">{matchingParent.profile.father.cellNo}</span></p>
                                                )}
                                                {matchingParent.profile.father.email && (
                                                  <p><span className="text-slate-400">Email:</span> <span className="font-mono text-slate-700">{matchingParent.profile.father.email}</span></p>
                                                )}
                                                {matchingParent.profile.father.occupation && matchingParent.profile.father.occupation !== 'Unknown' && (
                                                  <p className="truncate"><span className="text-slate-400">Occupation:</span> <span className="text-slate-700">{matchingParent.profile.father.occupation}</span></p>
                                                )}
                                                {matchingParent.profile.father.employer && matchingParent.profile.father.employer !== 'Self' && (
                                                  <p className="truncate"><span className="text-slate-400">Employer:</span> <span className="text-slate-700">{matchingParent.profile.father.employer}</span></p>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="text-center py-2 text-slate-400 italic">
                                          Detailed profile data not synced for {student.parentEmail}.
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Attendance Action Controller */}
                            <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-2 pl-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-indigo-500" /> Daily Attendance
                                </span>
                                {student.attendanceStatus === 'Present' && student.arrivedTime && (
                                  <span className="text-[9.5px] text-emerald-600 font-extrabold font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                                    Arrived: {student.arrivedTime}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                {(['Present', 'Absent', 'Excused'] as const).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => {
                                      if (onUpdateAttendance) {
                                        onUpdateAttendance(student.id, status);
                                      }
                                    }}
                                    className={`py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all border text-center ${
                                      student.attendanceStatus === status
                                        ? status === 'Present'
                                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                          : status === 'Absent'
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                            : 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Tuition Overdue Notification Panel */}
                            {(() => {
                              const parentEmailNorm = student.parentEmail?.toLowerCase().trim();
                              const studentPayments = payments.filter(
                                (p) => p.parentEmail?.toLowerCase().trim() === parentEmailNorm || p.learnerId === student.id
                              );
                              const outstandingAmount = studentPayments
                                .filter((p) => p.status === 'Unpaid' || p.status === 'In Arrears')
                                .reduce((sum, p) => sum + p.amount, 0);

                              return (
                                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between pl-2.5">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                      <CreditCard className="w-3 h-3 text-slate-400" /> Fee Balance
                                    </span>
                                    <span className={`text-[11.5px] font-black mt-0.5 ${outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                      {outstandingAmount > 0 ? `R${outstandingAmount.toLocaleString()} Overdue` : 'Fees Up-to-Date'}
                                    </span>
                                  </div>
                                  {outstandingAmount > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSendNotice(student.firstNames + ' ' + student.surname + ' (Parent)', outstandingAmount);
                                        setLocalFeedback(`Arrears alert dispatched to parent of ${student.firstNames}!`);
                                        setTimeout(() => setLocalFeedback(null), 4000);
                                      }}
                                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-rose-100 shadow-2xs"
                                    >
                                      <Mail className="w-3 h-3" />
                                      Remind
                                    </button>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Medical Alert Status Panel */}
                            {(() => {
                              const matchedApp = enrolments.find(
                                (app) => 
                                  app.childParticulars?.id === student.id || 
                                  (app.childParticulars?.firstNames?.toLowerCase().trim() === student.firstNames.toLowerCase().trim() &&
                                   app.childParticulars?.surname?.toLowerCase().trim() === student.surname.toLowerCase().trim())
                              );
                              const medProfile = matchedApp?.medicalProfile || (student.id === 'student-thabo' || student.firstNames === 'Thabo' ? { asthma: true } : null);
                              const hasCriticalConditions = medProfile && (medProfile.asthma || medProfile.diabetes || medProfile.epilepsy || medProfile.lifeThreateningAllergies);

                              return (
                                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between pl-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${hasCriticalConditions ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    <span className="text-[11px] text-slate-600 font-extrabold">
                                      {hasCriticalConditions ? 'Medical Alert Flag' : 'Medical File Clear'}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMedicalLearner(student)}
                                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
                                  >
                                    <ShieldAlert className="w-3 h-3 text-slate-500" />
                                    Medical Card
                                  </button>
                                </div>
                              );
                            })()}

                            {/* Transport Status Panel */}
                            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between pl-2.5">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-slate-400" /> Transport Route
                                </span>
                                <span className={`text-[11.5px] font-black mt-0.5 ${student.transportRouteId ? 'text-indigo-600' : 'text-slate-500'}`}>
                                  {student.transportRouteId 
                                    ? (student.transportRouteName || transportRoutes.find(r => r.id === student.transportRouteId)?.name || 'Assigned') 
                                    : student.transportNeeded 
                                      ? 'Transport Requested' 
                                      : 'No Transport Needed'
                                  }
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedTransportLearner(student)}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-indigo-100 shadow-2xs select-none"
                              >
                                <Truck className="w-3 h-3" />
                                {student.transportRouteId ? 'Update Route' : 'Assign Route'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {onDeleteLearner && (
                          <div className="flex justify-end mt-4 pt-3 border-t border-slate-50 pl-2.5 gap-2">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete student profile ${student.preferredName}? This cannot be undone.`)) {
                                  onDeleteLearner(student.id);
                                }
                              }}
                              className="text-[10px] text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-colors font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove Student
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-20 gap-4 text-slate-400 text-xs font-semibold">
                    No student records matching your query was found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: STAFF ROSTER */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              {/* Staff Welcome & Stats Header */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Educators & Administrative Staff Roster</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Manage active teachers, assistants, facilitators, administrators, and drivers in service.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStaffForm(!showAddStaffForm)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer self-start md:self-auto shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  {showAddStaffForm ? 'Close Intake' : 'Add New Staff'}
                </button>
              </div>

              {/* Add Staff Form */}
              {showAddStaffForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border-2 border-indigo-100 shadow-md space-y-4"
                >
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Staff Induction Registry
                  </h4>
                  <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="e.g. Teacher Anne Mofokeng"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Professional Role *</label>
                      <input 
                        type="text" 
                        required
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                        placeholder="e.g. Tiger Room Lead Teacher"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        placeholder="e.g. anne@kiddiestown.co.za"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        placeholder="e.g. +27 82 453 1199"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Date Employed</label>
                      <input 
                        type="date" 
                        value={staffDate}
                        onChange={(e) => setStaffDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Key Qualification</label>
                      <input 
                        type="text" 
                        value={staffQual}
                        onChange={(e) => setStaffQual(e.target.value)}
                        placeholder="e.g. Diploma in Pre-School Ed"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm mr-2"
                      >
                        Induct Staff Member
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddStaffForm(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-705 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Roster list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((staff) => (
                  <div key={staff.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{staff.name}</h4>
                          <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full mt-1.5 w-fit">
                            {staff.role}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-sm select-none">
                          {staff.name.replace("Mrs. ", "").replace("Teacher ", "").replace("Mr. ", "").replace("Miss ", "")[0]}
                        </div>
                      </div>

                      <div className="space-y-2 text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400">Email:</span>
                          <span className="text-slate-700 font-mono">{staff.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400">Phone:</span>
                          <span className="text-slate-700 font-mono">{staff.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400">Qualified:</span>
                          <span className="text-slate-700 text-right font-semibold">{staff.qualification}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400">Employment Date:</span>
                          <span className="text-slate-700 font-mono">{staff.employmentDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 pt-3 border-t border-slate-50 gap-2">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to de-register ${staff.name} from the active staff list?`)) {
                            handleDeleteStaff(staff.id);
                          }
                        }}
                        className="text-[10px] text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-colors font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        De-register Staff
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ENROLMENT OVERVIEW DATA GRID */}
          {activeTab === 'enrolments' && (
            <EnrollmentOverview 
              enrolments={enrolments}
              onApproveEnrolment={handleApproveClick}
              onRejectEnrolment={onRejectEnrolment}
              onResetEnrolmentStatus={onResetEnrolmentStatus}
            />
          )}

          {/* TAB 3: CALENDAR PLANNER */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Events list and planner Form */}
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="flex justify-between items-center mb-5 border-b border-indigo-50 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">Active Calendar Schedules</h3>
                    <p className="text-xs text-slate-400">Total listed events: {events.length}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 hover:bg-white transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600">
                            {ev.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{ev.date} at {ev.time}</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-sm">{ev.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{ev.description}</p>
                      </div>

                      {/* Display RSVP response rate */}
                      <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        RSVPs logged: {ev.rsvps.length} parents
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Event Form panel */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-1 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">Create New Year Event</h4>
                <p className="text-[11px] text-slate-400 mb-4 font-semibold">Instantly updates the parent and teacher calendars</p>

                {eventSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <h5 className="font-bold text-xs">Event scheduled!</h5>
                    <p className="text-[10px] mt-1 text-emerald-700/80">Notification push synchronized directly to the parents' app streams.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs font-semibold text-slate-600">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="e.g. End of Year Concert"
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-800 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200 w-full px-2 py-2 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Time</label>
                        <input
                          type="text"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="bg-slate-50 border border-slate-200 w-full px-2 py-2 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                          placeholder="09:00 AM"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Category</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-700 focus:outline-hidden"
                      >
                        <option value="Event">School Event</option>
                        <option value="Extra-mural">Extra-Mural Sport</option>
                        <option value="Incursion">Educational Incursion</option>
                        <option value="Holiday">School Holiday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Description / Brief Notes</label>
                      <textarea
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Provide details about standard dress requirements or refreshments..."
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-800 h-20 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl cursor-pointer"
                    >
                      Publish Schedule Event
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TRANSPORT & GEOGRAPHY */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              {/* Header card with "Add Route" trigger */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Transport Geography & Logistics Map</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Manage geographical coordinates, vehicles, drivers, stops, and scheduled school busses pick-up points requested by parents.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddRouteForm(!showAddRouteForm)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer self-start md:self-auto shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  {showAddRouteForm ? 'Close Intake' : 'Register New Route'}
                </button>
              </div>

              {/* Add Route Form */}
              {showAddRouteForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border-2 border-indigo-100 shadow-md space-y-4"
                >
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    Induct New Transport Route
                  </h4>
                  <form onSubmit={handleCreateRoute} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600 text-slate-700">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Route Name *</label>
                      <input 
                        type="text" 
                        required
                        value={newRouteName}
                        onChange={(e) => setNewRouteName(e.target.value)}
                        placeholder="e.g. Flora Park Express (Route C)"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Departure Time *</label>
                      <input 
                        type="text" 
                        required
                        value={newRouteTime}
                        onChange={(e) => setNewRouteTime(e.target.value)}
                        placeholder="e.g. 07:40 AM"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Assigned Driver</label>
                      <select 
                        value={newRouteDriver}
                        onChange={(e) => setNewRouteDriver(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="Mr. Sipho Ndlovu">Mr. Sipho Ndlovu (Transport Coordinator)</option>
                        <option value="Teacher Clara">Teacher Clara (Relief Driver)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Vehicle Details</label>
                      <input 
                        type="text" 
                        value={newRouteVehicle}
                        onChange={(e) => setNewRouteVehicle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Route Stops (Comma-separated, excluding campus) *</label>
                      <input 
                        type="text" 
                        required
                        value={newRouteStops}
                        onChange={(e) => setNewRouteStops(e.target.value)}
                        placeholder="e.g. McDonald Street, Flora Park Dam, Marshall Street"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Active Passengers / Learners (Comma-separated)</label>
                      <input 
                        type="text" 
                        value={newRouteLearners}
                        onChange={(e) => setNewRouteLearners(e.target.value)}
                        placeholder="e.g. Sarah Smith, Thabo Junior"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm mr-2"
                      >
                        Induct Route
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddRouteForm(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-705 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Transport Summary Stats Widget */}
              <div id="transport-route-summary-widget" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {computedTransportRoutes.map((route, rIdx) => {
                  const filledSeats = route.learners.length;
                  const capacityPercentage = Math.round((filledSeats / route.capacity) * 100);
                  
                  // Color codes for different fill rates
                  let progressColor = "bg-indigo-600";
                  let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                  if (capacityPercentage >= 100) {
                    progressColor = "bg-rose-600";
                    badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                  } else if (capacityPercentage >= 80) {
                    progressColor = "bg-amber-600";
                    badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                  } else if (filledSeats > 0) {
                    progressColor = "bg-emerald-600";
                    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  }

                  return (
                    <div 
                      key={route.id} 
                      className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Route {rIdx + 1}</span>
                          <h4 className="font-extrabold text-slate-800 text-xs line-clamp-1" title={route.name}>{route.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block">{route.driver}</span>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                          <Route className="w-4 h-4 text-indigo-600" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <div className="space-y-0.5">
                            <span className="text-xl font-mono font-black text-slate-900">{filledSeats}</span>
                            <span className="text-[10px] text-slate-400 font-bold ml-1">/ {route.capacity} kids</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-wider border ${badgeColor}`}>
                            {capacityPercentage}% Full
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/40">
                          <div 
                            className={`${progressColor} h-full transition-all duration-500`} 
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Card 4: Unassigned / Waitlist or Total summary */}
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200/80 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Planning Backlog</span>
                      <h4 className="font-extrabold text-slate-800 text-xs">Unassigned Bus Riders</h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">Require route allocation</span>
                    </div>
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 shrink-0">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-mono font-black text-slate-900">
                        {learners.filter(l => l.transportNeeded && !l.transportRouteId).length}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Kiddies</span>
                    </div>
                    <span className="text-[10px] font-bold block text-slate-500">
                      {learners.filter(l => l.transportNeeded && !l.transportRouteId).length > 0 
                        ? "⚠️ Allocation required in directory" 
                        : "✓ All transport requests assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 2-Columns wide: list of active transport routes */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="font-extrabold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      Active Transport Routes & Schedules
                    </h4>
                    
                    <div className="space-y-6">
                      {computedTransportRoutes.map((route) => {
                        const filledSeats = route.learners.length;
                        const capacityPercentage = Math.round((filledSeats / route.capacity) * 100);

                        return (
                          <div key={route.id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:bg-white transition-all space-y-4">
                            
                            {/* Route Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h5 className="font-black text-slate-900 text-sm">{route.name}</h5>
                                <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                  <span>Vehicle: {route.vehicle}</span>
                                  <span>•</span>
                                  <span className="text-indigo-600 font-mono font-bold">{route.time}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
                                  {filledSeats} / {route.capacity} Seats Filled ({capacityPercentage}%)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to retire ${route.name}?`)) {
                                      setTransportRoutes(transportRoutes.filter(r => r.id !== route.id));
                                    }
                                  }}
                                  className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-colors cursor-pointer"
                                  title="Retire Route"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Driver Assignment Block */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                                  SN
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{route.driver}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">Primary Logistics Pilot</p>
                                </div>
                              </div>
                              <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">{route.driverPhone}</span>
                            </div>

                            {/* Timeline of Stops */}
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Stop Milestones</p>
                              <div className="relative pl-4 border-l-2 border-indigo-100 ml-2 py-1 space-y-3.5">
                                {route.stops.map((stop, sIdx) => {
                                  const isTerminal = sIdx === 0 || sIdx === route.stops.length - 1;
                                  return (
                                    <div key={sIdx} className="relative flex items-center gap-2">
                                      {/* Indicator bullet */}
                                      <span className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 ${
                                        isTerminal ? 'bg-indigo-600 border-white' : 'bg-white border-indigo-400'
                                      }`} />
                                      <span className={`text-[11px] ${
                                        isTerminal ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'
                                      }`}>
                                        {stop} {sIdx === 0 ? '(07:00)' : sIdx === route.stops.length - 1 ? '(07:55)' : ''}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Passenger Passengers list */}
                            <div className="pt-2 border-t border-slate-150/60">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Kiddies on Bus</p>
                              <div className="flex flex-wrap gap-1.5">
                                {route.learners.length > 0 ? (
                                  route.learners.map((learner, lIdx) => (
                                    <span key={lIdx} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                      {learner}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic font-medium">No kids registered to this shuttle currently.</span>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 1-Column side: Geography stats and route information benefits */}
                <div className="space-y-6">
                  
                  {/* Geographical stats overview */}
                  <div className="bg-indigo-950 text-indigo-50 rounded-2xl p-6 border border-indigo-950 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm mb-1 text-white">Geographical Profiling Benefits</h4>
                      <p className="text-xs mt-2 text-indigo-200 leading-relaxed font-medium">
                        By planning student distribution dynamically across Ster Park, Flora Park, and Polokwane CBD, Kiddies Town administration optimizes shuttle fuel and scheduling times.
                      </p>
                      
                      <div className="mt-5 space-y-3 pt-3 border-t border-indigo-900">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-300 font-semibold">Active Registered Busses:</span>
                          <span className="font-mono font-bold text-white">2 Fleet Units</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-300 font-semibold">Configured Fleet Routes:</span>
                          <span className="font-mono font-bold text-white">{computedTransportRoutes.length} Routes</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-300 font-semibold">Maximum Transit Capacity:</span>
                          <span className="font-mono font-bold text-white">45 Seats</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-300 font-semibold">Linked Passengers:</span>
                          <span className="font-mono font-bold text-white">
                            {computedTransportRoutes.reduce((sum, r) => sum + r.learners.length, 0)} Kiddies
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-900/40 p-4 rounded-xl border border-indigo-800/40 text-xs leading-relaxed text-indigo-300 font-mono mt-4">
                      All fleet units are tracked via satellite GPS and undergo bi-weekly safety checklists.
                    </div>
                  </div>

                  {/* Operational Instructions card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Logistics Desk Guidelines</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Ensure that pick-up and drop-off records exactly correlate with parent requests registered through the admission folders. Notify parents instantly if driver rotations change.
                    </p>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 font-medium">
                      Reminder: Drivers must ensure PDP licenses are updated and first aid kits are fully stocked before embarking on daily morning runs.
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">System Audit Overrides Registry</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Cryptographically signed audit logs of all administrative overrides, admission records, deletions, and system resets.
                    </p>
                  </div>
                  <button
                    onClick={fetchAuditLogs}
                    disabled={loadingLogs}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 disabled:bg-slate-50 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto select-none transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
                    Refresh Logs
                  </button>
                </div>
              </div>

              {/* Filters & Search Control Bar */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search logs by operator, details..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Action</span>
                    <select
                      value={auditActionFilter}
                      onChange={(e) => setAuditActionFilter(e.target.value)}
                      className="border border-slate-200 bg-white rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                    >
                      <option value="ALL">All Action Types</option>
                      {uniqueActionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Operator</span>
                    <select
                      value={auditOperatorFilter}
                      onChange={(e) => setAuditOperatorFilter(e.target.value)}
                      className="border border-slate-200 bg-white rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                    >
                      <option value="ALL">All Operators</option>
                      {uniqueOperators.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>

                  {(auditSearchQuery || auditActionFilter !== 'ALL' || auditOperatorFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setAuditSearchQuery('');
                        setAuditActionFilter('ALL');
                        setAuditOperatorFilter('ALL');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer select-none"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 uppercase tracking-widest text-[10px] font-bold text-slate-400 bg-slate-50/50">
                        <th className="py-3 px-4 w-1/4">Operator / Admin</th>
                        <th className="py-3 px-4 w-1/4">Action Type</th>
                        <th className="py-3 px-4 w-1/3">Entity Details</th>
                        <th className="py-3 px-4 w-1/6 font-mono">Timestamp (SAST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {loadingLogs ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-bold font-mono">
                            <div className="flex flex-col items-center gap-2 justify-center">
                              <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                              <span>Decrypting secure audit registry...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold font-mono">
                            No matching audit logs found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredAuditLogs.map((log: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                            <td className="py-4 px-4 text-slate-800 font-bold font-mono text-xs break-all">
                              {log.operatorId}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${
                                log.actionType.includes("DELETE") || log.actionType.includes("REMOVE")
                                  ? "bg-rose-50 text-rose-700 border border-rose-100"
                                  : log.actionType.includes("RESET")
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : log.actionType.includes("FEE") || log.actionType.includes("PAYMENT")
                                  ? "bg-sky-50 text-sky-700 border border-sky-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}>
                                {log.actionType}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600 text-xs">
                              {renderEntityDetails(log)}
                            </td>
                            <td className="py-4 px-4 font-mono text-slate-400 text-[10px]">
                              {new Date(log.timestamp).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Local Feedback Alert Banner */}
      <AnimatePresence>
        {localFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-semibold text-xs px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{localFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Senior Diagnostic Feature: Emergency Medical Profile Card Overlay */}
      <AnimatePresence>
        {selectedMedicalLearner && (() => {
          const student = selectedMedicalLearner;
          
          // Match enrolment application by exact learner ID or firstnames/surname matching
          const matchedApp = enrolments.find(
            (app) => 
              app.childParticulars?.id === student.id || 
              (app.childParticulars?.firstNames?.toLowerCase().trim() === student.firstNames.toLowerCase().trim() &&
               app.childParticulars?.surname?.toLowerCase().trim() === student.surname.toLowerCase().trim())
          );
          
          // Create safe defaults for medical data
          const med: MedicalProfile = matchedApp?.medicalProfile ? {
            familyDoctor: matchedApp.medicalProfile.familyDoctor || 'Dr. M. K. Khumalo',
            doctorPhone: matchedApp.medicalProfile.doctorPhone || '+27 15 291 4455',
            diabetes: !!matchedApp.medicalProfile.diabetes,
            asthma: !!matchedApp.medicalProfile.asthma,
            epilepsy: !!matchedApp.medicalProfile.epilepsy,
            cardiacMurmur: !!matchedApp.medicalProfile.cardiacMurmur,
            otherHealthConditions: matchedApp.medicalProfile.otherHealthConditions || 'None reported',
            childhoodSicknesses: matchedApp.medicalProfile.childhoodSicknesses || 'Chickenpox, Measles (resolved)',
            lifeThreateningAllergies: matchedApp.medicalProfile.lifeThreateningAllergies || 'None',
            otherAllergies: matchedApp.medicalProfile.otherAllergies || 'Seasonal dust allergy',
            regularMedication: matchedApp.medicalProfile.regularMedication || 'None',
            regularMedicationDetails: matchedApp.medicalProfile.regularMedicationDetails || 'N/A',
            majorOperations: !!matchedApp.medicalProfile.majorOperations,
            majorOperationsDetails: matchedApp.medicalProfile.majorOperationsDetails || 'N/A',
            behaviorProblems: matchedApp.medicalProfile.behaviorProblems || 'None',
            speechHearingProblems: matchedApp.medicalProfile.speechHearingProblems || 'None',
            birthComplications: matchedApp.medicalProfile.birthComplications || 'None',
            immunisationUpToDate: matchedApp.medicalProfile.immunisationUpToDate !== false,
            relevantFamilyHistory: matchedApp.medicalProfile.relevantFamilyHistory || 'None',
            emergencyConsent: matchedApp.medicalProfile.emergencyConsent !== false
          } : {
            familyDoctor: 'Dr. M. K. Khumalo (Polokwane Paediatrics)',
            doctorPhone: '+27 15 291 4455',
            diabetes: false,
            asthma: student.id === 'student-thabo' || student.firstNames === 'Thabo',
            epilepsy: false,
            cardiacMurmur: false,
            otherHealthConditions: 'None reported',
            childhoodSicknesses: 'Chickenpox immunization received',
            lifeThreateningAllergies: student.id === 'student-leo' ? 'Bee stings' : 'None',
            otherAllergies: 'Seasonal dust allergy',
            regularMedication: 'None',
            regularMedicationDetails: 'N/A',
            majorOperations: false,
            majorOperationsDetails: 'N/A',
            behaviorProblems: 'None',
            speechHearingProblems: 'None',
            birthComplications: 'None',
            immunisationUpToDate: true,
            relevantFamilyHistory: 'None',
            emergencyConsent: true
          };

          const parentEmailNorm = student.parentEmail?.toLowerCase().trim();
          const parent = parentProfiles.find(p => p.email.toLowerCase().trim() === parentEmailNorm);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-slate-205 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                      <Heart className="w-6 h-6 fill-rose-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">Emergency Medical Card</h3>
                      <p className="text-xs text-slate-400 font-semibold">{student.firstNames} {student.surname} ({student.classType} Room)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMedicalLearner(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Allergies and Critical Alerts */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Critical Safety Alerts & Allergies
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                        <p className="text-[8.5px] uppercase font-bold text-rose-500">Life-Threatening Allergies</p>
                        <p className="text-xs font-black text-rose-950 mt-0.5">{med.lifeThreateningAllergies}</p>
                      </div>
                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                        <p className="text-[8.5px] uppercase font-bold text-amber-600">Other Allergies / Intolerances</p>
                        <p className="text-xs font-black text-amber-950 mt-0.5">{med.otherAllergies}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chronic Conditions</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Asthma', active: med.asthma },
                        { label: 'Diabetes', active: med.diabetes },
                        { label: 'Epilepsy', active: med.epilepsy },
                        { label: 'Cardiac', active: med.cardiacMurmur },
                      ].map((cond) => (
                        <div key={cond.label} className={`p-2.5 rounded-xl border text-center ${
                          cond.active 
                            ? 'bg-rose-500 border-rose-600 text-white font-black' 
                            : 'bg-slate-50 border-slate-150 text-slate-400 font-medium'
                        } text-[11px]`}>
                          {cond.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regular Medication & Check-ups */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Regular Medication</span>
                        <span className="text-slate-800 font-bold">{med.regularMedication === 'Yes' || med.regularMedication ? med.regularMedicationDetails : 'None'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Immunisation Status</span>
                        <span className={`font-bold ${med.immunisationUpToDate ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {med.immunisationUpToDate ? '✓ Up-to-Date' : '⚠️ Outstanding'}
                        </span>
                      </div>
                      <div className="sm:col-span-2 border-t border-slate-200/60 pt-2.5">
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Other Health Conditions</span>
                        <span className="text-slate-800 font-semibold">{med.otherHealthConditions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Family Practitioner</p>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                          Dr
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">{med.familyDoctor}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Primary Medical Care</p>
                        </div>
                      </div>
                      <span className="font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-lg font-bold">{med.doctorPhone}</span>
                    </div>
                  </div>

                  {/* Emergency Contacts & Consent */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Contacts</p>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-md border border-emerald-100">
                        ✓ Emergency Consent Signed
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {parent?.profile?.mother && parent.profile.mother.cellNo && (
                        <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs font-semibold">
                          <span>Mother: {parent.profile.mother.firstNames} {parent.profile.mother.surname}</span>
                          <a href={`tel:${parent.profile.mother.cellNo}`} className="text-indigo-600 hover:underline font-mono text-xs">
                            {parent.profile.mother.cellNo}
                          </a>
                        </div>
                      )}
                      {parent?.profile?.father && parent.profile.father.cellNo && (
                        <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs font-semibold">
                          <span>Father: {parent.profile.father.firstNames} {parent.profile.father.surname}</span>
                          <a href={`tel:${parent.profile.father.cellNo}`} className="text-indigo-600 hover:underline font-mono text-xs">
                            {parent.profile.father.cellNo}
                          </a>
                        </div>
                      )}
                      {(!parent?.profile?.mother?.cellNo && !parent?.profile?.father?.cellNo) && (
                        <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs font-semibold">
                          <span>Primary Parent Link: {parent?.name || 'Guardian'}</span>
                          <span className="font-mono text-slate-700 font-bold">{parent?.profile?.phone || '+27 82 555 1234'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-150 rounded-b-3xl flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedMedicalLearner(null)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    Acknowledge & Close
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Assign Transport Route Modal */}
      <AnimatePresence>
        {selectedTransportLearner && (() => {
          const student = selectedTransportLearner;
          
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-slate-205 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">Assign Transport Route</h3>
                      <p className="text-xs text-slate-400 font-semibold">{student.firstNames} {student.surname} ({student.classType} Room)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTransportLearner(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select an active transport route run for <strong>{student.firstNames}</strong>. Assigning a route updates the student profile and notifies the driver of a new passenger.
                  </p>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Select Transport Route</label>
                    <div className="space-y-2">
                      {/* Unassigned Option */}
                      <div 
                        onClick={() => {
                          const updated: Learner = {
                            ...student,
                            transportRouteId: undefined,
                            transportRouteName: undefined,
                            transportNeeded: false
                          };
                          if (onUpdateLearner) {
                            onUpdateLearner(updated);
                          }
                          setSelectedTransportLearner(null);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          !student.transportRouteId 
                            ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          !student.transportRouteId ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {!student.transportRouteId && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">No Transport / Self-arranged</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Student is picked up/dropped off by parents or private transport.</p>
                        </div>
                      </div>

                      {/* Routes from state */}
                      {transportRoutes.map((route) => {
                        const isSelected = student.transportRouteId === route.id;
                        return (
                          <div 
                            key={route.id}
                            onClick={() => {
                              const updated: Learner = {
                                ...student,
                                transportRouteId: route.id,
                                transportRouteName: route.name,
                                transportNeeded: true
                              };
                              if (onUpdateLearner) {
                                onUpdateLearner(updated);
                              }
                              setSelectedTransportLearner(null);
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected 
                                ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10' 
                                : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-extrabold text-slate-800">{route.name}</p>
                              <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                                <div>
                                  <span className="text-slate-400 block text-[8px] uppercase font-bold">Driver</span>
                                  <span className="font-semibold text-slate-700">{route.driver}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[8px] uppercase font-bold">Vehicle</span>
                                  <span className="font-semibold text-slate-700">{route.vehicle}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-slate-400 block text-[8px] uppercase font-bold">Stops</span>
                                  <span className="font-medium text-slate-600">{route.stops}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-150 rounded-b-3xl flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedTransportLearner(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 transition-colors text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Bulk Email Modal */}
      <AnimatePresence>
        {showBulkEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-205 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">Compose Bulk Parent Notification</h3>
                    <p className="text-xs text-slate-400 font-semibold">Sending to {selectedStudentIds.length} recipient{selectedStudentIds.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkEmailModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
                  disabled={isSendingBulkEmail}
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                {/* Recipients List Tags */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Recipients ({selectedStudentIds.length})</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-150">
                    {learners.filter(l => selectedStudentIds.includes(l.id)).map(student => (
                      <span key={student.id} className="inline-flex items-center gap-1 bg-white text-slate-700 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-bold">
                        {student.firstNames} {student.surname}
                        <button
                          type="button"
                          onClick={() => setSelectedStudentIds(prev => prev.filter(id => id !== student.id))}
                          className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Template Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Choose Notification Template</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'custom', name: 'Custom Message' },
                      { id: 'attendance', name: 'Attendance Alert' },
                      { id: 'announcement', name: 'General Announcement' },
                      { id: 'transport', name: 'Transport Route Update' },
                    ].map(tmpl => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleTemplateChange(tmpl.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          bulkEmailTemplate === tmpl.id
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Line */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Subject Line</label>
                  <input
                    type="text"
                    value={bulkEmailSubject}
                    onChange={(e) => setBulkEmailSubject(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={isSendingBulkEmail}
                  />
                </div>

                {/* Email Body Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Message Body</label>
                  <textarea
                    value={bulkEmailBody}
                    onChange={(e) => setBulkEmailBody(e.target.value)}
                    placeholder="Type your official announcement here..."
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed resize-none"
                    disabled={isSendingBulkEmail}
                  />
                </div>

                {/* Feedback Messages */}
                {bulkEmailErrorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bulkEmailErrorMsg}</span>
                  </div>
                )}

                {bulkEmailSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{bulkEmailSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-150 rounded-b-3xl flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkEmailModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 transition-colors text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  disabled={isSendingBulkEmail}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendBulkEmail}
                  disabled={isSendingBulkEmail || selectedStudentIds.length === 0}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-2"
                >
                  {isSendingBulkEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      Send Notifications
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enrolment Approval Confirmation Modal */}
      <AnimatePresence>
        {approvalModalApp && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Onboard Learner</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Enrolment Application Approval</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isApproving) setApprovalModalApp(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  disabled={isApproving}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  You are approving the registration and onboarding for the following learner immediately. This will create their student profile, allocate class resources, and set up tuition invoices.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Learner</span>
                      <span className="text-sm font-black text-slate-900">
                        {approvalModalApp.childParticulars?.firstNames} {approvalModalApp.childParticulars?.surname}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {approvalModalApp.childParticulars?.classType || 'Giraffes'} Room
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200/50 text-[11px] font-semibold text-slate-500">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Parent / Guardian</span>
                      <span className="text-slate-800 font-extrabold block truncate">
                        {approvalModalApp.parentParticulars?.email || approvalModalApp.parentParticulars?.mother?.email || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Monthly Tuition</span>
                      <span className="text-slate-800 font-extrabold block">
                        R {approvalModalApp.consents?.monthlyAmount || 2500}
                      </span>
                    </div>
                  </div>
                </div>

                {/* EMAIL NOTIFICATION CHECKBOX */}
                <div className="p-3.5 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl flex gap-3 select-none hover:bg-indigo-50 transition-colors">
                  <div className="pt-0.5">
                    <input
                      id="send-welcome-email-checkbox"
                      type="checkbox"
                      checked={sendWelcomeEmail}
                      onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                      disabled={isApproving}
                      className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                    />
                  </div>
                  <label htmlFor="send-welcome-email-checkbox" className="space-y-1 cursor-pointer">
                    <span className="text-xs font-extrabold text-slate-800 block leading-tight">Send 'Welcome' Email Notification</span>
                    <span className="text-[10px] text-slate-500 font-bold block leading-normal">
                      Triggers an automated 'Welcome to Kiddies Town' confirmation mail to the parent upon approval.
                    </span>
                  </label>
                </div>

                {approvalSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[11px] font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{approvalSuccessMsg}</span>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setApprovalModalApp(null)}
                  disabled={isApproving}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 transition-colors text-slate-700 font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsApproving(true);
                    setApprovalSuccessMsg(null);
                    try {
                      await onApproveEnrolment(approvalModalApp.id, sendWelcomeEmail);
                      setApprovalSuccessMsg(
                        sendWelcomeEmail 
                          ? "Enrolment approved! Automated Welcome Email dispatched to parent." 
                          : "Enrolment approved and student onboarded successfully!"
                      );
                      if (onRefreshData) {
                        await onRefreshData();
                      }
                      setTimeout(() => {
                        setApprovalModalApp(null);
                        setApprovalSuccessMsg(null);
                        setIsApproving(false);
                      }, 2000);
                    } catch (err) {
                      console.error(err);
                      setIsApproving(false);
                    }
                  }}
                  disabled={isApproving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-600/10 flex items-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      Confirm & Onboard
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
