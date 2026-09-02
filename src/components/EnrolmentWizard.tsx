import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ParentProfile, EnrolmentApplication, ClassType } from '../types';
import { fullEnrolmentSchema, EnrolmentFormValues } from './enrollment/enrollmentSchemas';
import Step1ChildParticulars from './enrollment/Step1ChildParticulars';
import Step2ParentDetails from './enrollment/Step2ParentDetails';
import Step3MedicalProfile from './enrollment/Step3MedicalProfile';
import Step4TransportDetails from './enrollment/Step4TransportDetails';
import Step5Consents from './enrollment/Step5Consents';
import Step6DocumentUpload from './enrollment/Step6DocumentUpload';

interface EnrolmentWizardProps {
  onComplete: (app: EnrolmentApplication) => void;
  parentProfile?: ParentProfile;
}

export default function EnrolmentWizard({ onComplete, parentProfile }: EnrolmentWizardProps) {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [blockedAttempt, setBlockedAttempt] = useState(false);

  const methods = useForm<EnrolmentFormValues>({
    resolver: zodResolver(fullEnrolmentSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      step1: {
        enrolmentType: 'New Enrolment',
        careRequired: 'Full Day',
        firstNames: '',
        surname: '',
        prefName: '',
        dob: '',
        idNumber: '',
        gender: 'Male',
        language: 'English',
        religion: 'Christian',
        systemClass: 'N/A'
      },
      step2: {
        maritalStatus: 'Married',
        childLivesWith: 'Both Parents',
        mName: '',
        mSurname: '',
        mId: '',
        mCell: '',
        mEmail: '',
        mOcc: '',
        mEmp: '',
        address: ''
      },
      step3: {
        familyDoc: '',
        docPhone: '',
        hasAsthma: false,
        hasDiabetes: false,
        hasEpilepsy: false,
        hasMurmur: false,
        allergiesText: '',
        emergencyConsent: false
      },
      step4: {
        isTransportNeeded: false,
        pickUpPoint: '',
        pickUpTime: '07:00 AM',
        dropOffPerson: '',
        collectPerson: ''
      },
      step5: {
        signIndemnity: false,
        signPopi: false,
        signFinance: false,
        paymentDay: '15th',
        signerName: ''
      },
      step6: {
        uploadedBirth: false,
        uploadedImmun: false,
        uploadedIds: false,
        uploadedResidence: false
      }
    }
  });

  const { handleSubmit, trigger, reset, setValue, formState: { errors } } = methods;

  const stepErrorCount = (() => {
    const stepErrors = (errors as Record<string, any>)[`step${step}`];
    if (!stepErrors) return 0;
    return Object.values(stepErrors).filter(Boolean).length;
  })();

  useEffect(() => {
    if (parentProfile) {
      if (parentProfile.maritalStatus) setValue('step2.maritalStatus', parentProfile.maritalStatus);
      if (parentProfile.childLivesWith) setValue('step2.childLivesWith', parentProfile.childLivesWith);
      if (parentProfile.address) setValue('step2.address', parentProfile.address);
      
      if (parentProfile.mother) {
        if (parentProfile.mother.firstNames) setValue('step2.mName', parentProfile.mother.firstNames);
        if (parentProfile.mother.surname) setValue('step2.mSurname', parentProfile.mother.surname);
        if (parentProfile.mother.idNumber) setValue('step2.mId', parentProfile.mother.idNumber);
        if (parentProfile.mother.cellNo) setValue('step2.mCell', parentProfile.mother.cellNo);
        if (parentProfile.mother.email) setValue('step2.mEmail', parentProfile.mother.email);
        if (parentProfile.mother.occupation) setValue('step2.mOcc', parentProfile.mother.occupation);
        if (parentProfile.mother.employer) setValue('step2.mEmp', parentProfile.mother.employer);
      }
    }
  }, [parentProfile, setValue]);

  const handleNext = async () => {
    let stepKey: keyof EnrolmentFormValues = 'step1';
    if (step === 1) stepKey = 'step1';
    if (step === 2) stepKey = 'step2';
    if (step === 3) stepKey = 'step3';
    if (step === 4) stepKey = 'step4';
    if (step === 5) stepKey = 'step5';

    const isValid = await trigger(stepKey);
    setBlockedAttempt(!isValid);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const onInvalid = () => setBlockedAttempt(true);

  const onSubmit = (data: EnrolmentFormValues) => {
    const finalApp: EnrolmentApplication = {
      id: 'enrol-new-' + Date.now(),
      childParticulars: {
        id: 'student-new-' + Date.now(),
        surname: data.step1.surname || 'Unknown',
        firstNames: data.step1.firstNames || 'Unknown',
        preferredName: data.step1.prefName || data.step1.firstNames || 'Unknown',
        dob: data.step1.dob || '2020-01-01',
        idNumber: data.step1.idNumber || '1203095345082',
        gender: data.step1.gender as 'Male'|'Female'|'Other',
        homeLanguage: data.step1.language,
        religion: data.step1.religion,
        classType: (data.step1.systemClass === 'N/A' || !data.step1.systemClass ? 'Tigers' : data.step1.systemClass) as ClassType,
        attendanceStatus: 'Pending'
      },
      parentParticulars: {
        name: `${data.step2.mName || 'Parent'} ${data.step2.mSurname || ''}`,
        email: data.step2.mEmail,
        phone: data.step2.mCell,
        address: data.step2.address,
        maritalStatus: data.step2.maritalStatus,
        childLivesWith: data.step2.childLivesWith
      },
      medicalProfile: {
        familyDoctor: data.step3.familyDoc,
        doctorPhone: data.step3.docPhone,
        diabetes: data.step3.hasDiabetes,
        asthma: data.step3.hasAsthma,
        epilepsy: data.step3.hasEpilepsy,
        cardiacMurmur: data.step3.hasMurmur,
        lifeThreateningAllergies: data.step3.allergiesText,
        emergencyConsent: data.step3.emergencyConsent
      },
      transportDetails: {
        needed: data.step4.isTransportNeeded,
        pickUpPoint: data.step4.pickUpPoint,
        pickUpTime: data.step4.pickUpTime,
        dropOffPerson: data.step4.dropOffPerson,
        collectPerson: data.step4.collectPerson,
        otherAuthorizedCollectors: []
      },
      consents: {
        indemnitySigned: data.step5.signIndemnity,
        popiActSigned: data.step5.signPopi,
        financialAgreementSigned: data.step5.signFinance,
        monthlyAmount: 2500,
        paymentDay: data.step5.paymentDay,
        monthlyPayerSignatureName: data.step5.signerName
      },
      uploadedFiles: {
        birthCertificate: data.step6.uploadedBirth,
        immunisationCard: data.step6.uploadedImmun,
        parentIds: data.step6.uploadedIds,
        proofOfResidence: data.step6.uploadedResidence
      },
      step: 6,
      status: 'Pending Approval',
      dateApplied: new Date().toISOString().split('T')[0]
    };

    onComplete(finalApp);
    setIsSuccess(true);
  };

  const stepsList = [
    { no: 1, label: 'Child Particulars' },
    { no: 2, label: 'Parent Details' },
    { no: 3, label: 'Medical Profile' },
    { no: 4, label: 'Logistics' },
    { no: 5, label: 'Consents' },
    { no: 6, label: 'Upload & Review' }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Application Filed Successfully!</h2>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-md mx-auto mt-2.5">
            Thank you for enrolling at Kiddies Town ECD & Academy. Your registration has been dispatched to the school board. You will receive an SMS and email notification upon approval.
          </p>

          <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 max-w-sm mx-auto text-left text-xs font-medium text-slate-600 space-y-2">
            <p className="font-bold text-indigo-950 text-center text-sm mb-2">Registration Overview</p>
            <p>Learner Name: <span className="font-bold text-slate-800">{methods.getValues('step1.firstNames')} {methods.getValues('step1.surname')}</span></p>
            <p>Allocated Class: <span className="font-bold text-indigo-700">{methods.getValues('step1.systemClass')} Room</span></p>
            <p>Parent Contact: <span className="font-mono text-slate-800">{methods.getValues('step2.mCell')}</span></p>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              reset();
            }}
            className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl text-xs cursor-pointer"
          >
            Register Another Child
          </button>
        </motion.div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit as any, onInvalid)}>
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 mb-8 text-center sm:text-left">
              <span className="text-[10px] font-bold font-mono text-indigo-600 tracking-widest uppercase bg-slate-100 px-2.5 py-1 rounded">
                School Enrolment Wizard
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-3">Kiddies Town Enrolment Form</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Please fill in all sections below to submit an application for your child.</p>
            </div>

            {/* Stepper Dots Indicators */}
            <div className="flex justify-between items-center gap-1.5 mb-10 overflow-x-auto pb-4 sm:pb-0">
              {stepsList.map((s) => {
                const isActive = s.no === step;
                const isCompleted = s.no < step;
                return (
                  <div key={s.no} className="flex items-center gap-1.5 shrink-0 select-none">
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4 text-white stroke-[3.5]" /> : s.no}
                    </div>
                    <span className={`text-[11px] font-bold hidden md:block ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 font-semibold'
                    }`}>
                      {s.label}
                    </span>
                    {s.no < 6 && <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />}
                  </div>
                );
              })}
            </div>

            {blockedAttempt && stepErrorCount > 0 && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-2.5 p-3.5 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-[11px] font-bold leading-relaxed">
                  This step has {stepErrorCount} field{stepErrorCount === 1 ? '' : 's'} that need attention before you can continue.
                  Please review the highlighted fields below.
                </p>
              </div>
            )}

            {/* RENDERING SEPARATE STEPS INLINED FOR COMPACT EXQUISITE CODE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6 text-xs font-semibold text-slate-600"
              >
                {step === 1 && <Step1ChildParticulars />}
                {step === 2 && <Step2ParentDetails />}
                {step === 3 && <Step3MedicalProfile />}
                {step === 4 && <Step4TransportDetails />}
                {step === 5 && <Step5Consents />}
                {step === 6 && <Step6DocumentUpload />}
              </motion.div>
            </AnimatePresence>

            {/* Stepper Buttons control */}
            <div className="flex justify-between items-center mt-10 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                className={`px-4.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 bg-white hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                PreviousStep
              </button>

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  Continue to Next Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-black tracking-wide rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  SUBMIT APPLICATION
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
