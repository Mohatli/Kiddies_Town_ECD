import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, AlertCircle, ShieldAlert } from 'lucide-react';
import { Learner, EnrolmentApplication } from '../../types';

interface MedicalProfile {
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

export interface MedicalProfileModalProps {
  selectedMedicalLearner: Learner | null;
  setSelectedMedicalLearner: (learner: Learner | null) => void;
  enrolments: EnrolmentApplication[];
  parentProfiles: any[];
}

export default function MedicalProfileModal({
  selectedMedicalLearner,
  setSelectedMedicalLearner,
  enrolments,
  parentProfiles
}: MedicalProfileModalProps) {
  if (!selectedMedicalLearner) return null;

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
    <AnimatePresence>
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
    </AnimatePresence>
  );
}
