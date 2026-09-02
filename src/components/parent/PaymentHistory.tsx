import React, { useState } from 'react';
import { CreditCard, Landmark, Upload, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { PaymentItem, Learner } from '../../types';

interface PaymentHistoryProps {
  outstandingFees: number;
  parentLearners: Learner[];
  parentPayments: PaymentItem[];
  onAddPayment: (item: PaymentItem) => void;
}

export default function PaymentHistory({ outstandingFees, parentLearners, parentPayments, onAddPayment }: PaymentHistoryProps) {
  const [payDescription, setPayDescription] = useState('Monthly Fees / October Aftercare');
  const [payAmount, setPayAmount] = useState('2500');
  const [payRef, setPayRef] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    
    const newPay: PaymentItem = {
      id: 'pay-manual-' + Date.now(),
      description: payDescription,
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      status: 'Pending Verification',
      receiptNo: payRef ? `REF-${payRef.toUpperCase()}` : `REF-${Math.floor(Math.random() * 900000 + 100000)}`
    };

    onAddPayment(newPay);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayDescription('Monthly Fees / October Aftercare');
      setPayAmount('2500');
      setPayRef('');
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="xl:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-7 shadow-xl shadow-slate-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest relative z-10">Total Outstanding</span>
            <h3 className="text-3xl font-black mt-4 relative z-10">R{outstandingFees.toLocaleString()}.00</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-3 relative z-10 bg-slate-800/50 w-fit px-2 py-1 rounded-md">Due by 1st of each month</p>
          </div>

          <div className="glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest relative z-10">Next Monthly Fee</span>
            <h3 className="text-3xl font-black text-slate-900 mt-4 relative z-10">
              {parentLearners.length > 0 ? `R${(parentLearners.length * 2500).toLocaleString()}.00` : "R0.00"}
            </h3>
            <p className="text-[11px] font-bold text-indigo-600 mt-3 relative z-10 bg-indigo-50 w-fit px-2 py-1 rounded-md">
              {parentLearners.length > 0 ? `Due 01 Nov 2025 (x${parentLearners.length})` : "No children enrolled"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest relative z-10">Last Processed</span>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mt-4 relative z-10">
              {parentLearners.length > 0 ? `R${(parentLearners.length * 2500).toLocaleString()}.00` : "N/A"}
            </h3>
            <p className="text-[11px] font-bold text-emerald-700 mt-3 relative z-10 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              {parentLearners.length > 0 ? "Processed on 01 Sep 2025" : "No children enrolled"}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" /> Payment & Invoices History
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-white bg-white/40 shadow-inner">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 bg-slate-50/50 uppercase tracking-widest text-[10px] font-black text-slate-500">
                  <th className="py-4 px-5">Description</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-right">Amount</th>
                  <th className="py-4 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 font-medium">
                {parentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500 italic bg-white/30">
                      No invoice history or receipts located. Submit an admissions application to enroll!
                    </td>
                  </tr>
                ) : (
                  parentPayments.map((item, i) => (
                    <tr key={item.id} className={`transition-colors hover:bg-white/60 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/30'}`}>
                      <td className="py-4 px-5 text-slate-900 font-bold">{item.description}</td>
                      <td className="py-4 px-5 font-mono text-xs text-slate-500">{item.date}</td>
                      <td className="py-4 px-5 text-right font-black text-slate-900">
                        R{item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right flex justify-end">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit ${
                          item.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Pending Verification'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Paid' ? 'bg-emerald-500' : item.status === 'Pending Verification' ? 'bg-blue-500' : 'bg-rose-500'
                          }`} />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl" />
          <h3 className="font-black text-base border-b border-slate-700/50 pb-4 mb-5 flex items-center gap-3 text-white relative z-10">
            <span className="p-2 bg-indigo-500/20 rounded-lg">
              <Landmark className="w-5 h-5 text-indigo-400" />
            </span>
            Kiddies Town Bank Details
          </h3>

          <div className="space-y-4 font-mono text-xs text-slate-300 relative z-10">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Capitec Bank</p>
              <p className="font-bold text-white text-sm">A/C: 17 046 859 05</p>
              <p className="text-[10px] text-slate-400 font-sans mt-1">Linked Cell: 079 386 6233</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Nedbank Account</p>
              <p className="font-bold text-white text-sm">A/C: 110 679 2211</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">First National Bank (FNB)</p>
              <p className="font-bold text-white text-sm">A/C: 6274 1889 490</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Standard Bank</p>
              <p className="font-bold text-white text-sm">A/C: 1013 675 3726</p>
            </div>
          </div>

          <div className="bg-rose-500/10 p-4 rounded-xl mt-6 border border-rose-500/20 text-[11px] font-medium leading-relaxed text-rose-200 relative z-10">
            <span className="font-black text-rose-400 block mb-1">⚠️ Important Note</span>
            Please use child's registered name and surname as payment reference. Mail proof to <span className="underline font-bold">admin@kiddiestown.co.za</span> or WhatsApp.
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h4 className="font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Submit Proof
          </h4>
          <p className="text-xs font-medium text-slate-500 mb-6">Log a direct bank transfer details for admin validations</p>

          {paySuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center shadow-lg shadow-emerald-100"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h5 className="font-black text-sm">Payment logged successfully!</h5>
              <p className="text-xs mt-2 font-medium text-emerald-700">Our Financial Administrator was notified. Your status is now "Pending Verification".</p>
            </motion.div>
          ) : (
            <form onSubmit={handleManualPaymentSubmit} className="space-y-4 text-sm font-medium">
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Fee Category</label>
                <select
                  value={payDescription}
                  onChange={(e) => setPayDescription(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="Monthly Fees / October Aftercare">Monthly Fees / October Aftercare</option>
                  <option value="Monthly Fees / November Full Day">Monthly Fees / November Full Day</option>
                  <option value="School Registration Fee (New Year 2025)">Registration Fee (R600)</option>
                  <option value="Excursion / Outing Fee">Excursion / Outing Fee</option>
                </select>
                <ChevronDown className="absolute right-4 top-[30px] w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Amount Transferred (ZAR)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. 2500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reference Code / Slip No</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. FNB1200388"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-xl text-white font-black tracking-wide mt-4 cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
              >
                Submit Proof and Log Reference
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
