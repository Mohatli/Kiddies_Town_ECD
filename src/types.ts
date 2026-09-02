export type ClassType = 'Roses' | 'Giraffes' | 'Tigers'; // Roses: 2-3 yrs, Giraffes: 3-4 yrs, Tigers: 4-5 yrs

export interface Learner {
  id: string;
  surname: string;
  firstNames: string;
  preferredName: string;
  dob: string;
  idNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  homeLanguage: string;
  religion?: string;
  gradeThisYear?: string;
  schoolAttending?: string;
  previousSchool?: string;
  classType: ClassType;
  attendanceStatus: 'Present' | 'Absent' | 'Excused' | 'Pending';
  arrivedTime?: string;
  parentEmail?: string;
  enrolmentApproved?: boolean;
  transportNeeded?: boolean;
  transportRouteId?: string;
  transportRouteName?: string;
  status?: string;
  parentName?: string;
}

export interface ParentProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  maritalStatus: string;
  childLivesWith: string;
  mother: ParentParticulars;
  father: ParentParticulars;
}

export interface ParentParticulars {
  title: string;
  surname: string;
  firstNames: string;
  idNumber: string;
  occupation: string;
  employer: string;
  telWork: string;
  telHome: string;
  cellNo: string;
  email: string;
  homeAddress: string;
  postalAddress: string;
  workAddress: string;
}

export interface MedicalProfile {
  familyDoctor: string;
  doctorPhone: string;
  diabetes: boolean;
  asthma: boolean;
  epilepsy: boolean;
  cardiacMurmur: boolean;
  otherHealthConditions: string;
  childhoodSicknesses: string;
  lifeThreateningAllergies: string;
  otherAllergies: string;
  regularMedication: string;
  regularMedicationDetails: string;
  majorOperations: boolean;
  majorOperationsDetails: string;
  behaviorProblems: string;
  speechHearingProblems: string;
  birthComplications: string;
  immunisationUpToDate: boolean;
  relevantFamilyHistory: string;
  emergencyConsent: boolean;
}

export interface TransportDetails {
  needed: boolean;
  pickUpPoint?: string;
  pickUpTime?: string;
  dropOffPerson?: string;
  collectPerson?: string;
  otherAuthorizedCollectors: { name: string; phone: string }[];
}

export interface Consents {
  indemnitySigned: boolean;
  popiActSigned: boolean;
  financialAgreementSigned: boolean;
  outingsPermission: boolean;
  monthlyPayerSignatureName: string;
  paymentDay: '15th' | '20th' | '25th' | '31st';
  monthlyAmount: number;
  signedAt: string;
  signedDate: string;
}

export interface EnrolmentApplication {
  id: string;
  childParticulars: Partial<Learner>;
  parentParticulars: Partial<ParentProfile>;
  medicalProfile: Partial<MedicalProfile>;
  transportDetails: Partial<TransportDetails>;
  consents: Partial<Consents>;
  uploadedFiles: {
    birthCertificate: boolean;
    immunisationCard: boolean;
    parentIds: boolean;
    proofOfResidence: boolean;
  };
  step: number; // 1 to 6
  status: 'In Review' | 'Pending Approval' | 'Approved' | 'Rejected';
  dateApplied: string;
}

export interface ProgressReport {
  id: string;
  learnerId: string;
  academicYear: number;
  term: 1 | 2 | 3 | 4;
  released: boolean;
  releasedDate?: string;
  recordedDaysAbsent: number;
  indicators: {
    // A = Achieved, D = Developing, E = Emerging, N/O = Not Observed, N/A = Not Applicable
    classroomBehavior: {
      A1_controlAndSafe: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
      A2_bathroomIndependent: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    communicationSkills: {
      B1_speaksClearly: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    readingWritingSkills: {
      C1_recognizesLetters: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    numbersMathArithmetic: {
      D1_countsRecognizes: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    musicArtSkills: {
      E1_dancesMusicSings: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    socialEmotionalSkills: {
      F1_sharesAndPlays: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    coloursAndShapes: {
      G1_colorsShapes: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    fineMotorSkills: {
      H1_pencilCrayonScissors: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
      H2_blocksPuzzles: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
      H3_bounceKickThrow: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
      H4_buttonsShoesClothes: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    approachesToLearn: {
      I1_enjoysLearning: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
    computerSkills: {
      J1_tabletLaptopVoice: 'A' | 'D' | 'E' | 'N/O' | 'N/A';
    };
  };
  shortSummary: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6'; // Joyful, Melodious, Honest, Brilliant, Quiet, Sad
  teacherComments: string;
  teacherName: string;
  principalName: string;
}

export interface PaymentItem {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'In Arrears' | 'Pending Verification';
  receiptNo?: string;
  parentEmail?: string;
  learnerId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'Teacher' | 'Parent' | 'Admin';
  senderName: string;
  text: string;
  timestamp: string;
  parentEmail?: string;
}

export interface WeeklyTheme {
  weekNo: number;
  title: string;
  description: string;
  activities: string[];
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'Event' | 'Extra-mural' | 'Holiday' | 'Incursion';
  description: string;
  rsvps: { parentName: string; count: number; status: 'Yes' | 'No' | 'Maybe' }[];
}

export interface DailyRegisterEntry {
  learnerId: string;
  status: 'Present' | 'Absent' | 'Excused' | 'Pending';
  arrivedTime?: string;
}

/** One submitted daily attendance register, keyed by calendar date. */
export interface DailyRegister {
  date: string; // YYYY-MM-DD
  submittedBy?: string;
  submittedAt?: string;
  entries: DailyRegisterEntry[];
}

export interface JournalPost {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  postedBy: string;
}
