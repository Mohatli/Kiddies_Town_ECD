import { Learner, ParentProfile, ProgressReport, PaymentItem, ChatMessage, WeeklyTheme, SchoolEvent, JournalPost, EnrolmentApplication } from '../types';

export const initialLearners: Learner[] = [
  {
    id: 'student-jake',
    surname: 'Mbeki',
    firstNames: 'Jake',
    preferredName: 'Jake',
    dob: '2019-03-15',
    idNumber: '1903155345084',
    gender: 'Male',
    homeLanguage: 'English / Zulu',
    religion: 'Christian',
    gradeThisYear: 'Grade R',
    schoolAttending: 'Kiddies Town ECD & Academy',
    previousSchool: 'None',
    classType: 'Tigers',
    attendanceStatus: 'Present',
    arrivedTime: '07:45',
    parentEmail: 'parent@kiddiestown.co.za'
  },
  {
    id: 'student-jill',
    surname: 'Mbeki',
    firstNames: 'Jill',
    preferredName: 'Jill',
    dob: '2021-06-20',
    idNumber: '2106201234083',
    gender: 'Female',
    homeLanguage: 'English / Zulu',
    religion: 'Christian',
    gradeThisYear: 'Toddler',
    schoolAttending: 'Kiddies Town ECD & Academy',
    previousSchool: 'None',
    classType: 'Roses',
    attendanceStatus: 'Present',
    arrivedTime: '08:00',
    parentEmail: 'parent@kiddiestown.co.za'
  }
];

export const initialParentProfile: ParentProfile = {
  name: 'Sarah Mbeki',
  email: 'sarah.mbeki@mail.com',
  phone: '+27 81 545 3500',
  address: '7 Grimm Street, Ster Park, Polokwane',
  maritalStatus: 'Married',
  childLivesWith: 'Both Parents',
  mother: {
    title: 'Mrs.',
    surname: 'Mbeki',
    firstNames: 'Sarah',
    idNumber: '8610120150085',
    occupation: 'Financial Analyst',
    employer: 'Standard Bank',
    telWork: '015 023 0600',
    telHome: '015 023 1122',
    cellNo: '081 545 3500',
    email: 'sarah.mbeki@mail.com',
    homeAddress: '7 Grimm Street, Ster Park, Polokwane',
    postalAddress: 'P.O. Box 77, Polokwane, 0700',
    workAddress: '29 Hans Van Rensburg St, Polokwane'
  },
  father: {
    title: 'Mr.',
    surname: 'Mbeki',
    firstNames: 'Thabo',
    idNumber: '8402140134081',
    occupation: 'Software Consultant',
    employer: 'FTech Consulting',
    telWork: '015 023 0600',
    telHome: '015 023 1122',
    cellNo: '079 386 6233',
    email: 'thabo@ftechconsulting.co.za',
    homeAddress: '7 Grimm Street, Ster Park, Polokwane',
    postalAddress: 'P.O. Box 77, Polokwane, 0700',
    workAddress: '29 Hillside Manor, Pretoria North, 0182'
  }
};

export const initialParentProfiles: Record<string, ParentProfile> = {
  "parent@kiddiestown.co.za": { ...initialParentProfile, email: 'parent@kiddiestown.co.za' },
  "thabo.parent@mail.com": {
    name: 'Lerato Junior',
    email: 'thabo.parent@mail.com',
    phone: '+27 82 555 1234',
    address: '42 Jorissen Street, Polokwane',
    maritalStatus: 'Single Parent',
    childLivesWith: 'Mother',
    mother: {
      title: 'Ms.',
      surname: 'Junior',
      firstNames: 'Lerato',
      idNumber: '8905150150082',
      occupation: 'Business Analyst',
      employer: 'Nedbank',
      telWork: '015 123 4567',
      telHome: '015 123 8899',
      cellNo: '082 555 1234',
      email: 'thabo.parent@mail.com',
      homeAddress: '42 Jorissen Street, Polokwane',
      postalAddress: 'P.O. Box 88, Polokwane',
      workAddress: 'Polokwane'
    },
    father: {
      title: 'Mr.',
      surname: 'Junior',
      firstNames: 'Thabo',
      idNumber: '8701120150083',
      occupation: 'Unknown',
      employer: 'Self',
      telWork: '',
      telHome: '',
      cellNo: '',
      email: '',
      homeAddress: '',
      postalAddress: '',
      workAddress: ''
    }
  },
  "amara.parent@mail.com": {
    name: 'Sipho Khumalo',
    email: 'amara.parent@mail.com',
    phone: '+27 83 777 9876',
    address: '15 Hospital Road, Polokwane',
    maritalStatus: 'Married',
    childLivesWith: 'Both Parents',
    mother: {
      title: 'Mrs.',
      surname: 'Khumalo',
      firstNames: 'Amara',
      idNumber: '9007151345081',
      occupation: 'Teacher',
      employer: 'Dept of Education',
      telWork: '015 999 0001',
      telHome: '015 999 0002',
      cellNo: '083 111 2222',
      email: 'amara.mother@mail.com',
      homeAddress: '15 Hospital Road, Polokwane',
      postalAddress: 'P.O. Box 112, Polokwane',
      workAddress: 'Polokwane High School'
    },
    father: {
      title: 'Mr.',
      surname: 'Khumalo',
      firstNames: 'Sipho',
      idNumber: '8806201345082',
      occupation: 'Structural Engineer',
      employer: 'Khumalo & Sons',
      telWork: '015 999 3333',
      telHome: '015 999 0002',
      cellNo: '083 777 9876',
      email: 'amara.parent@mail.com',
      homeAddress: '15 Hospital Road, Polokwane',
      postalAddress: 'P.O. Box 112, Polokwane',
      workAddress: 'Polokwane'
    }
  },
  "kabo.parent@mail.com": {
    name: 'Lesego Molefe',
    email: 'kabo.parent@mail.com',
    phone: '+27 72 444 5556',
    address: '88 Landros Mare Street, Polokwane',
    maritalStatus: 'Married',
    childLivesWith: 'Both Parents',
    mother: {
      title: 'Mrs.',
      surname: 'Molefe',
      firstNames: 'Lesego',
      idNumber: '9108181234081',
      occupation: 'Graphic Designer',
      employer: 'Aether Studio',
      telWork: '015 555 4433',
      telHome: '015 555 1111',
      cellNo: '072 444 5556',
      email: 'kabo.parent@mail.com',
      homeAddress: '88 Landros Mare Street, Polokwane',
      postalAddress: 'P.O. Box 334, Polokwane',
      workAddress: 'Polokwane'
    },
    father: {
      title: 'Mr.',
      surname: 'Molefe',
      firstNames: 'Kabo',
      idNumber: '8912121234082',
      occupation: 'IT Technician',
      employer: 'SITA',
      telWork: '015 555 2222',
      telHome: '015 555 1111',
      cellNo: '071 333 4444',
      email: 'kabo.father@mail.com',
      homeAddress: '88 Landros Mare Street, Polokwane',
      postalAddress: 'P.O. Box 334, Polokwane',
      workAddress: 'SITA Office'
    }
  },
  "smith.parent@mail.com": {
    name: 'John Smith',
    email: 'smith.parent@mail.com',
    phone: '+27 84 333 2221',
    address: '14 Gemini Avenue, Polokwane',
    maritalStatus: 'Married',
    childLivesWith: 'Both Parents',
    mother: {
      title: 'Mrs.',
      surname: 'Smith',
      firstNames: 'Sarah',
      idNumber: '9109021234082',
      occupation: 'Accountant',
      employer: 'PwC',
      telWork: '015 444 5555',
      telHome: '015 444 1111',
      cellNo: '084 123 4567',
      email: 'smith.mother@mail.com',
      homeAddress: '14 Gemini Avenue, Polokwane',
      postalAddress: 'P.O. Box 11, Polokwane',
      workAddress: 'PwC Office'
    },
    father: {
      title: 'Mr.',
      surname: 'Smith',
      firstNames: 'John',
      idNumber: '8904021234083',
      occupation: 'Pharmacist',
      employer: 'Dis-Chem',
      telWork: '015 444 2222',
      telHome: '015 444 1111',
      cellNo: '084 333 2221',
      email: 'smith.parent@mail.com',
      homeAddress: '14 Gemini Avenue, Polokwane',
      postalAddress: 'P.O. Box 11, Polokwane',
      workAddress: 'Dis-Chem Polokwane'
    }
  },
  "david.parent@mail.com": {
    name: 'Mary Jones',
    email: 'david.parent@mail.com',
    phone: '+27 82 999 8888',
    address: '25 Grobler Street, Polokwane',
    maritalStatus: 'Single Parent',
    childLivesWith: 'Mother',
    mother: {
      title: 'Ms.',
      surname: 'Jones',
      firstNames: 'Mary',
      idNumber: '9004101234083',
      occupation: 'Real Estate Agent',
      employer: 'Pam Golding',
      telWork: '015 333 4444',
      telHome: '015 333 5555',
      cellNo: '082 999 8888',
      email: 'david.parent@mail.com',
      homeAddress: '25 Grobler Street, Polokwane',
      postalAddress: 'P.O. Box 99, Polokwane',
      workAddress: 'Pam Golding Polokwane'
    },
    father: {
      title: 'Mr.',
      surname: 'Jones',
      firstNames: 'David',
      idNumber: '8803101234084',
      occupation: 'Unknown',
      employer: 'Self',
      telWork: '',
      telHome: '',
      cellNo: '',
      email: '',
      homeAddress: '',
      postalAddress: '',
      workAddress: ''
    }
  }
};

export const initialProgressReports: ProgressReport[] = [
  {
    id: 'report-term1',
    learnerId: 'student-jake',
    academicYear: new Date().getFullYear(),
    term: 1,
    released: true,
    releasedDate: `${new Date().getFullYear()}-03-24`,
    recordedDaysAbsent: 1,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'D' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'D',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'D'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K1',
    teacherComments: 'Jake had an outstanding first term! He adapts very well to group classroom dynamics and loves active play. He demonstrates strong mathematical indicators and loves counting.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  },
  {
    id: 'report-term2',
    learnerId: 'student-jake',
    academicYear: new Date().getFullYear(),
    term: 2,
    released: true,
    releasedDate: `${new Date().getFullYear()}-06-22`,
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'A' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'A',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'D'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K4',
    teacherComments: 'An exceptional second term for Jake! His reading and spelling skills have improved enormously. He is very kind to his peers and is a pleasure to have in the class.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  },
  {
    id: 'report-jill-term1',
    learnerId: 'student-jill',
    academicYear: new Date().getFullYear(),
    term: 1,
    released: true,
    releasedDate: `${new Date().getFullYear()}-03-24`,
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'A' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'A',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'A'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K3',
    teacherComments: 'Jill had an incredible first term in the toddler group! She behaves beautifully, handles all toys safely, and is very respectful towards staff and fellow learners. She is a total joy.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  }
];

export const initialPaymentHistory: PaymentItem[] = [
  {
    id: 'pay-5',
    description: `Monthly Fees / October Aftercare - Jake Mbeki`,
    date: `${new Date().getFullYear()}-10-01`,
    amount: 2500,
    status: 'In Arrears',
    learnerId: 'student-jake'
  },
  {
    id: 'pay-4',
    description: 'Monthly Fees / September - Jake Mbeki',
    date: `${new Date().getFullYear()}-09-01`,
    amount: 2500,
    status: 'Paid',
    receiptNo: `REC-${new Date().getFullYear()}09-0021`,
    learnerId: 'student-jake'
  },
  {
    id: 'pay-3',
    description: 'Monthly Fees / August - Jill Mbeki',
    date: `${new Date().getFullYear()}-08-01`,
    amount: 2500,
    status: 'Paid',
    receiptNo: `REC-${new Date().getFullYear()}08-1112`,
    learnerId: 'student-jill'
  }
];

export const initialChatHistory: ChatMessage[] = [
  {
    id: 'char-1',
    sender: 'Teacher',
    senderName: 'Teacher Anne',
    text: 'Jake and Jill are both doing incredible in class today! Jake completed his counting exercises with 100% accuracy and Jill was exceptionally creative in her finger-painting session.',
    timestamp: '11:14 AM'
  },
  {
    id: 'char-2',
    sender: 'Parent',
    senderName: 'Sarah Mbeki',
    text: 'That is wonderful to hear, Anne! Thank you so much for the update. Do they need any emergency clothing items packed for Friday?',
    timestamp: '11:20 AM'
  },
  {
    id: 'char-3',
    sender: 'Teacher',
    senderName: 'Teacher Anne',
    text: 'Yes, please pack a light change of clothes and water bottles for both of them. We are doing mud finger-painting on Friday morning!',
    timestamp: '11:25 AM'
  }
];

export const initialWeeklyThemes: WeeklyTheme[] = [
  {
    weekNo: 1,
    title: 'Welcome to Kiddies Town & Daily Routines',
    description: 'Introducing young learners to the classroom, playground safety, and the daily school schedule at 7 Grimm Street. Emphasizing hygiene (toilet routine) and social interaction.',
    activities: [
      'Daily Programme walking tour',
      'Meet your classroom peers (Roses, Giraffes, Tigers)',
      'Classroom safety rules puppet show',
      'Proper hand washing with bubbles'
    ]
  },
  {
    weekNo: 2,
    title: 'Primary Colors, Shapes & Toy Block Magic',
    description: 'Aligning with our Kiddies Town primary brand colors (red, green, blue, yellow balloons). Learners master basic geometry, sorting blocks, and finger science.',
    activities: [
      'Messy finger painting with primary colors',
      'Triangles and circles block stacking',
      'Colored water drops mix-matching experiment',
      'Giant geometric puzzle completion'
    ]
  },
  {
    weekNo: 3,
    title: 'My Wonderful Family & Home Languages',
    description: 'Celebrating diversity in Polokwane! Learners share stories of Mrs./Mr. parent roles, occupations, and home patterns in English, Sesotho, isiZulu, and Setswana.',
    activities: [
      'Moms & Dads drawing frame',
      'My favorite home phrase in Sesotho or isiZulu',
      "Occupations roleplaying (teacher, software consultant, banker)",
      'Grandparents storytelling circle'
    ]
  },
  {
    weekNo: 4,
    title: 'Safari Adventures: Giraffes, Tigers & Roses',
    description: 'Inspired by our class names! Active studies on wild animals of Limpopo, identifying sounds, footprint markings in the sandbox, and sensory touch.',
    activities: [
      'Mock dinosaur bones sandbox hunt',
      'Paper plate lion head crafting with woolly manes',
      'Learning why tall giraffes reach tree-top leaves',
      'Safari animal footsteps muddy prints matching'
    ]
  },
  {
    weekNo: 5,
    title: 'Healthy Bodies, Active Sports & Oral Hygiene',
    description: 'Teaches clean habits, healthy fruits vs sweets, and physical activities on the outdoor soccer pitch to develop fine and gross motor indicators.',
    activities: [
      'Tooth brushing mock drills on cardboard faces',
      'Ster Park playground soccer mini friendly',
      'Vitamins sorting (apples vs sweet candies)',
      'Jungle-gym coordination balance race'
    ]
  }
];

// Seeded relative to the current year so the calendar always shows a realistic
// mix of past and upcoming events (two behind us, two ahead).
const YEAR = new Date().getFullYear();

export const initialSchoolEvents: SchoolEvent[] = [
  {
    id: 'event-1',
    title: 'Year End Photo Day',
    date: `${YEAR}-07-31`,
    time: '08:30 AM',
    category: 'Event',
    description: 'Please ensure children wear full school uniform for the individual and class photographs.',
    rsvps: [
      { parentName: 'Sarah Mbeki', count: 1, status: 'Yes' },
      { parentName: 'Zanele Ndlovu', count: 1, status: 'Yes' }
    ]
  },
  {
    id: 'event-2',
    title: 'Soccer Extra-Mural Friendly',
    date: `${YEAR}-08-12`,
    time: '14:00 PM',
    category: 'Extra-mural',
    description: 'Friendly match with Bluebird Academy. Parents are welcome to attend and cheer and offer support.',
    rsvps: [
      { parentName: 'Sarah Mbeki', count: 2, status: 'Yes' }
    ]
  },
  {
    id: 'event-3',
    title: 'Music Lesson & Recorder Day',
    date: `${YEAR}-09-04`,
    time: '09:00 AM',
    category: 'Incursion',
    description: 'Special visiting multi-instrumentalist will show flutes, drums, and kids play standard triangles.',
    rsvps: []
  },
  {
    id: 'event-4',
    title: `Graduation Ceremony ${YEAR}`,
    date: `${YEAR}-11-15`,
    time: '10:00 AM',
    category: 'Event',
    description: 'A grand celebration for our 5-year old Tigers graduating to Grade 1. All families invited.',
    rsvps: []
  }
];

export const initialJournalPosts: JournalPost[] = [
  {
    id: 'journal-1',
    date: `19 Oct ${YEAR}`,
    title: 'Creative Arts: Finger Painting',
    description: 'Leo explored colors today using his fingers to create a beautiful savanna landscape with abstract trees.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  },
  {
    id: 'journal-2',
    date: `15 Oct ${YEAR}`,
    title: 'Fine Motor: Block Building Castle',
    description: 'Active blocks work. The Tigers class worked together to build a grand castle with towers and drawbridges! Teamwork was beautiful.',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  },
  {
    id: 'journal-3',
    date: `12 Oct ${YEAR}`,
    title: 'Science Exploration: Dinosaur Hunt',
    description: 'Kids searched in the sandbox sandbox utilizing brushes to uncover hidden bone replicas and dinosaur eggs!',
    imageUrl: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  }
];

export const initialEnrolments: EnrolmentApplication[] = [];
