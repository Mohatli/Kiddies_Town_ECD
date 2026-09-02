import { z } from 'zod';

export const step1Schema = z.object({
  enrolmentType: z.string().min(1, 'Enrolment type is required'),
  careRequired: z.string().min(1, 'Care required is required'),
  firstNames: z.string().min(1, 'First names are required'),
  surname: z.string().min(1, 'Surname is required'),
  prefName: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required'),
  idNumber: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  language: z.string().min(1, 'Home language is required'),
  religion: z.string().optional(),
  systemClass: z.string().optional(),
});

export const step2Schema = z.object({
  maritalStatus: z.string().min(1, 'Marital status is required'),
  childLivesWith: z.string().min(1, 'Required'),
  mName: z.string().min(1, 'Required'),
  mSurname: z.string().min(1, 'Required'),
  mId: z.string().optional(),
  mCell: z.string().min(1, 'Required'),
  mEmail: z.string().email('Invalid email').min(1, 'Required'),
  mOcc: z.string().optional(),
  mEmp: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
});

export const step3Schema = z.object({
  familyDoc: z.string().optional(),
  docPhone: z.string().optional(),
  hasAsthma: z.boolean().default(false),
  hasDiabetes: z.boolean().default(false),
  hasEpilepsy: z.boolean().default(false),
  hasMurmur: z.boolean().default(false),
  allergiesText: z.string().optional(),
  emergencyConsent: z.boolean().default(false),
});

export const step4Schema = z.object({
  isTransportNeeded: z.boolean().default(false),
  pickUpPoint: z.string().optional(),
  pickUpTime: z.string().optional(),
  dropOffPerson: z.string().optional(),
  collectPerson: z.string().optional(),
});

const accepted = (message: string) =>
  z.boolean().refine((v) => v === true, { message });

export const step5Schema = z.object({
  signIndemnity: accepted('The indemnity agreement must be accepted'),
  signPopi: accepted('The POPI Act consent must be accepted'),
  signFinance: accepted('The financial agreement must be accepted'),
  paymentDay: z.enum(['15th', '20th', '25th', '31st']),
  signerName: z.string().min(1, 'Signature name is required'),
});

export const step6Schema = z.object({
  uploadedBirth: z.boolean().default(false),
  uploadedImmun: z.boolean().default(false),
  uploadedIds: z.boolean().default(false),
  uploadedResidence: z.boolean().default(false),
});

export const fullEnrolmentSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

export type EnrolmentFormValues = z.infer<typeof fullEnrolmentSchema>;
