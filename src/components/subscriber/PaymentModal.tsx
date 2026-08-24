import React, { useState } from 'react';
import { MonthlyBill, PaymentMethod, PaymentReceipt, Subscriber } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: MonthlyBill | null;
  subscriber: Subscriber;
  onSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bill,
  subscriber,
  onSuccess,
}) => {
  const { processPayment, generator } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('zain_cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'choose' | 'details' | 'success'>('choose');
  const [lastReceipt, setLastReceipt] = useState<PaymentReceipt | null>(null);

  // Form Fields
  const [walletPhone, setWalletPhone] = useState(subscriber.phone);
  const [pinCode, setPinCode] = useState('');
  const [cardNumber, setCardNumber] = useState('5312 •••• •••• 8841');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('412');
  const [preferredTime, setPreferredTime] = useState('مساءً (5:00 - 8:00 م)');

  if (!isOpen || !bill) return null;

  const dueAmount = bill.totalDue - bill.paidAmount;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate network request for payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const refCode =
        paymentMethod === 'zain_cash'
          ? `ZC-TX-${Math.floor(10000000 + Math.random() * 90000000)}`
          : paymentMethod === 'fib'
          ? `FIB-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`
          : paymentMethod === 'qi_card'
          ? `QI-CARD-${Math.floor(10000000 + Math.random() * 90000000)}`
          : `CASH-REQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const receipt = await processPayment(bill.id, dueAmount, paymentMethod, refCode);

      setLastReceipt(receipt);
      setStep('success');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccess(receipt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-light text-white text-base">
              {step === 'success' ? 'تم التسديد بنجاح!' : 'بوابة الدفع الإلكتروني المباشر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step !== 'success' ? (
          <form onSubmit={handleProcess} className="p-5 sm:p-6 space-y-4">
            {/* Bill Summary Card */}
            <div className="p-4 rounded-xl bg-[#040710] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">فاتورة شهر ({bill.monthYear})</span>
                <span className="text-sm font-medium text-white">
                  {bill.amperes} أمبير ({subscriber.lineType === 'golden' ? 'ذهبي' : 'عادي'})
                </span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">المبلغ المطلوب</span>
                <span className="text-xl font-light text-amber-500 font-mono-num">
                  {dueAmount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ع</span>
                </span>
              </div>
            </div>

            {/* Choose Gateway */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">
                اختر طريقة الدفع المناسبة:
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Zain Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('zain_cash')}
                  className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'zain_cash'
                      ? 'border-red-500/50 bg-red-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-red-400 text-xs">زين كاش</span>
                    <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black flex items-center justify-center border border-red-500/30">
                      Z
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">
                    خصم فوري من المحفظة
                  </span>
                </button>

                {/* FIB */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('fib')}
                  className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'fib'
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-cyan-400 text-xs">مصرف FIB</span>
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black flex items-center justify-center border border-cyan-500/30">
                      F
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">
                    المصرف العراقي الأول
                  </span>
                </button>

                {/* Qi Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qi_card')}
                  className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'qi_card'
                      ? 'border-yellow-500/50 bg-yellow-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-yellow-400 text-xs">كي كارد / ماستر</span>
                    <CreditCard className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">
                    الرافدين / الرشيد / الماستر
                  </span>
                </button>

                {/* Cash Request */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-emerald-400 text-xs">طلب جابي كاش</span>
                    <Banknote className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">
                    زيارة الجابي للدار
                  </span>
                </button>
              </div>
            </div>

            {/* Gateway Specific Input Fields */}
            {paymentMethod === 'zain_cash' && (
              <div className="p-4 bg-[#040710] rounded-xl border border-red-500/20 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>تأكيد محفظة زين كاش</span>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">رقم المحفظة</label>
                  <input
                    type="tel"
                    required
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">الرمز السري للمحفظة (PIN)</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono tracking-widest focus:outline-none focus:border-red-500/50 text-center"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'fib' && (
              <div className="p-4 bg-[#040710] rounded-xl border border-cyan-500/20 text-center space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-cyan-400">
                  مسح رمز الاستجابة السريع عبر تطبيق FIB
                </div>
                <div className="p-2.5 bg-white rounded-xl inline-block my-1 shadow">
                  <QRCodeSVG value={`FIB:PAY:${dueAmount}:ACCOUNT:${generator.bankAccounts.fibIban}`} size={110} />
                </div>
                <div className="text-[10px] text-slate-500">
                  أو سيتم تحويل الفاتورة مباشرة لحسابك بالـ FIB
                </div>
              </div>
            )}

            {paymentMethod === 'qi_card' && (
              <div className="p-4 bg-[#040710] rounded-xl border border-yellow-500/20 space-y-2 animate-in fade-in">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">رقم البطاقة</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:border-yellow-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">رمز الأمان (CVV)</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:border-yellow-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 bg-[#040710] rounded-xl border border-emerald-500/20 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>تأكيد موعد قدوم الجابي للدار</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  العنوان: {subscriber.address.district} - محلة {subscriber.address.mahalla} زقاق {subscriber.address.zuqaq} دار {subscriber.address.dar}
                </p>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">الوقت المفضل لتواجدكم بالبيت:</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option>مساءً (5:00 - 8:00 م)</option>
                    <option>ظهراً (1:00 - 3:00 م)</option>
                    <option>صباحاً (9:00 - 11:00 ص)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Footer Pay Button */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>دفع مشفر وآمن 100%</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? 'جاري المعالجة...'
                    : paymentMethod === 'cash'
                    ? 'تأكيد طلب الجابي'
                    : `تسديد ${dueAmount.toLocaleString()} د.ع`}
                </span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </form>
        ) : (
          /* Payment Success State */
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-light text-white">تم تسديد الفاتورة بنجاح!</h4>
              <p className="text-xs text-slate-400 mt-1">
                تم استلام مبلغ <strong className="text-emerald-400 font-mono-num">{dueAmount.toLocaleString()} د.ع</strong> وحفظ الوصل الرقمي في أرشيفك.
              </p>
            </div>

            {lastReceipt && (
              <div className="p-4 rounded-xl bg-[#040710] border border-slate-800 text-xs space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الوصل:</span>
                  <span className="font-mono-num font-bold text-white">{lastReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">طريقة الدفع:</span>
                  <span className="font-bold text-amber-500">{lastReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رمز المعاملة:</span>
                  <span className="font-mono text-slate-300">{lastReceipt.transactionRef}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
            >
              إغلاق وعرض أرشيف الوصولات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
