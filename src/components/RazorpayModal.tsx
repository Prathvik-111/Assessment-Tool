/**
 * SmartAssess AI: Razorpay Payment Gateway (Test Mode)
 * Aesthetic Modal matching Razorpay Brand and System Navy/Teal/SkyBlue/White Palette.
 * Supports Test UPI, Test Credit/Debit Card, Netbanking, OTP simulation, and instant course enrollment.
 */

import React, { useState } from 'react';
import { Course, User } from '../types/index.ts';
import { dbService } from '../services/db.ts';
import {
  CreditCard,
  QrCode,
  Building,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Clock,
  RotateCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RazorpayModalProps {
  course: Course;
  student: User;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentTab = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  course,
  student,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('UPI');
  const [upiId, setUpiId] = useState('student@razorpay');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState(student.name);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('PhonePe');

  // Flow states
  const [stage, setStage] = useState<'SELECT' | 'OTP' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [otpValue, setOtpValue] = useState('123456');
  const [paymentResult, setPaymentResult] = useState<{
    orderId: string;
    paymentId: string;
    paidAt: string;
    amount: number;
  } | null>(null);

  const [copiedText, setCopiedText] = useState(false);

  const price = course.price || 1499;

  const handleAutoFillTestCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardHolder(student.name || 'Test Candidate');
  };

  const handleInitiatePayment = () => {
    setStage('OTP');
  };

  const handleConfirmOtp = () => {
    setStage('PROCESSING');
    setTimeout(() => {
      const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const paymentId = `pay_rzp_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

      // Record payment and auto-enroll in DB
      dbService.recordPayment({
        studentId: student.id,
        studentName: student.name,
        courseId: course.id,
        courseTitle: course.title,
        courseCode: course.code,
        amount: price,
        currency: 'INR',
        paymentMethod: activeTab,
        orderId,
        paymentId,
      });

      setPaymentResult({
        orderId,
        paymentId,
        paidAt: new Date().toISOString(),
        amount: price,
      });

      setStage('SUCCESS');
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111e]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#eee5d3] overflow-hidden my-auto"
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0d9488] flex items-center justify-center font-black text-white text-base shadow-sm">
                R
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">Razorpay</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-[#0c2340]">
                    TEST MODE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">SmartAssess AI Official Checkout</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-300 block uppercase font-medium">Enrolling in Course</span>
              <h3 className="text-sm font-bold text-white truncate max-w-xs">{course.title}</h3>
              <span className="text-[10px] text-[#38bdf8] font-mono">{course.code}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Total Amount</span>
              <div className="text-2xl font-black text-[#38bdf8]">
                ₹{price.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-amber-300/90 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Test Mode active: Simulation only. No real money or bank accounts are debited.</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {stage === 'SELECT' && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#f8f5ee] rounded-2xl border border-[#eee5d3] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('UPI')}
                  className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    activeTab === 'UPI'
                      ? 'bg-white text-[#0b192c] shadow-xs border border-[#eee5d3]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#0d9488]" />
                  <span className="text-[10px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('CARD')}
                  className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    activeTab === 'CARD'
                      ? 'bg-white text-[#0b192c] shadow-xs border border-[#eee5d3]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#0284c7]" />
                  <span className="text-[10px]">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('NETBANKING')}
                  className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    activeTab === 'NETBANKING'
                      ? 'bg-white text-[#0b192c] shadow-xs border border-[#eee5d3]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px]">NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('WALLET')}
                  className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    activeTab === 'WALLET'
                      ? 'bg-white text-[#0b192c] shadow-xs border border-[#eee5d3]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px]">Wallet</span>
                </button>
              </div>

              {/* Tab 1: UPI */}
              {activeTab === 'UPI' && (
                <div className="space-y-4">
                  <div className="bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl p-4 text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center relative">
                      <QrCode className="w-24 h-24 text-[#0c2340]" />
                      <span className="text-[8px] font-black uppercase text-[#0d9488] tracking-widest bg-emerald-50 px-1 rounded">
                        TEST UPI QR
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Scan or use Test UPI ID:</span>
                      <div className="flex items-center justify-center space-x-1.5 mt-1 font-mono text-xs font-bold text-[#0b192c]">
                        <span>student@razorpay</span>
                        <button
                          onClick={() => handleCopy('student@razorpay')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Or Enter Virtual Payment Address (VPA):
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Card */}
              {activeTab === 'CARD' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">Test Card Accepted</span>
                    <button
                      type="button"
                      onClick={handleAutoFillTestCard}
                      className="text-[11px] font-bold text-[#0284c7] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#0284c7]" />
                      <span>Auto-fill Test Card</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4111 1111 1111 1111"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Student Name"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: NetBanking */}
              {activeTab === 'NETBANKING' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-700 block">Select Test Bank:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          selectedBank === bank
                            ? 'bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488]'
                            : 'bg-white border-[#eee5d3] text-slate-700 hover:bg-[#f8f5ee]'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Wallet */}
              {activeTab === 'WALLET' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-700 block">Select Digital Wallet:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['PhonePe', 'Paytm', 'Amazon Pay', 'MobiKwik'].map(wallet => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-3 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          selectedWallet === wallet
                            ? 'bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488]'
                            : 'bg-white border-[#eee5d3] text-slate-700 hover:bg-[#f8f5ee]'
                        }`}
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="w-full py-3.5 rounded-2xl bg-[#0c2340] hover:bg-[#132a47] text-white font-extrabold text-sm shadow-lg shadow-[#0c2340]/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#38bdf8]" />
                <span>Pay ₹{price.toLocaleString()} via Razorpay (Test)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stage 2: OTP Simulation */}
          {stage === 'OTP' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0b192c]">Razorpay Test Bank 3D-Secure</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter test one-time password to authenticate simulated transaction of ₹{price.toLocaleString()}.
                </p>
              </div>

              <div className="bg-[#f8f5ee] border border-[#eee5d3] p-4 rounded-2xl max-w-xs mx-auto">
                <span className="text-[11px] text-slate-500 block mb-1">Pre-filled Test OTP:</span>
                <input
                  type="text"
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value)}
                  className="w-full text-center font-mono font-black text-xl tracking-widest py-2 bg-white border border-[#eee5d3] rounded-xl text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default test OTP is 123456</span>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStage('SELECT')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#eee5d3] text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  className="px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify & Pay ₹{price.toLocaleString()}</span>
                </button>
              </div>
            </div>
          )}

          {/* Stage 3: Processing */}
          {stage === 'PROCESSING' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-[#0c2340]/20 border-t-[#0d9488] animate-spin mx-auto" />
              <div>
                <h3 className="font-extrabold text-base text-[#0b192c]">Communicating with Razorpay Test Gateway...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Authorizing transaction and unlocking course modules in database.
                </p>
              </div>
            </div>
          )}

          {/* Stage 4: Success */}
          {stage === 'SUCCESS' && paymentResult && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Payment Verified
                </span>
                <h3 className="font-extrabold text-xl text-[#0b192c] mt-2">
                  Enrollment Successful!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  You have officially enrolled in <strong className="text-[#0b192c]">{course.title}</strong>. All modules and proctored examinations are now unlocked.
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-[#f8f5ee] border border-[#eee5d3] p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Payment ID:</span>
                  <span className="font-mono font-bold text-[#0b192c]">{paymentResult.paymentId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Order ID:</span>
                  <span className="font-mono text-[#0b192c]">{paymentResult.orderId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-[#0d9488]">₹{paymentResult.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-[#0b192c]">{activeTab} (Test Mode)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-sm shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Go to Course Assessments & Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="bg-[#f8f5ee] border-t border-[#eee5d3] px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>256-bit TLS Encrypted</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
