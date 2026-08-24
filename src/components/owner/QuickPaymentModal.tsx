import React, { useState } from 'react';
import { Subscriber, PaymentMethod, PaymentReceipt } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, Banknote, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: Subscriber | null;
  onReceiptGenerated: (receipt: PaymentReceipt) => void;
}

export const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({
  isOpen,
  onClose,
  subscriber,
  onReceiptGenerated,
}) => {
  const { bills, processPayment, generator } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amount, setAmount] = useState<number>(0);
  const [refCode, setRefCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Find active unpaid/partial bill for this subscriber
  const activeBill = bills.find(
    (b) => b.subscriberId === subscriber?.id && (b.status === 'unpaid' || b.status === 'partial')
  );

  React.useEffect(() => {
    if (activeBill) {
      setAmount(activeBill.totalDue - activeBill.paidAmount);
    } else if (subscriber) {
      setAmount(subscriber.balanceDue || 72000);
    }
  }, [subscriber, activeBill, isOpen]);

  if (!isOpen || !subscriber) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    try {
      const billId = activeBill ? activeBill.id : `bill-custom-${Date.now()}`;
      const receipt = await processPayment(billId, amount, paymentMethod, refCode);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      onClose();
      onReceiptGenerated(receipt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalDue = activeBill
    ? activeBill.totalDue - activeBill.paidAmount
    : subscriber.balanceDue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-400" />
            <h3 className="font-light text-white text-base">تسجيل دفعة وقبض اشتراك</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-5 sm:p-6 space-y-4">
          {/* Subscriber Info Card */}
          <div className="p-4 bg-[#040710] rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-white">{subscriber.name}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {subscriber.phone} • {subscriber.amperes} أمبير • {subscriber.boxNumber}
              </p>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">المبلغ المطلوب</span>
              <span className="text-base font-light text-amber-500 font-mono-num">
                {totalDue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ع</span>
              </span>
            </div>
          </div>

          {/* Amount to collect (Full or Partial) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              المبلغ المستلم من المشترك (د.ع)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-lg font-light text-emerald-400 font-mono-num focus:outline-none focus:border-emerald-500/50 transition pl-16"
              />
              <span className="absolute left-3.5 top-3.5 text-xs font-medium text-slate-500">
                د.ع IQD
              </span>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAmount(totalDue)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
              >
                تسديد كامل ({totalDue.toLocaleString()} د.ع)
              </button>
              {totalDue > 50000 && (
                <button
                  type="button"
                  onClick={() => setAmount(Math.round(totalDue / 2))}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#040710] text-slate-400 hover:text-white border border-slate-800 transition"
                >
                  دفعة جزئية (50%)
                </button>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              طريقة الاستلام والدفع
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500/50 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>نقداً (كاش مع الجابي)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('zain_cash')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'zain_cash'
                    ? 'border-amber-500/50 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-[9px] font-black flex items-center justify-center border border-red-500/30">
                  Z
                </div>
                <span>زين كاش (ZainCash)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('fib')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'fib'
                    ? 'border-amber-500/50 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-black flex items-center justify-center border border-cyan-500/30">
                  F
                </div>
                <span>المصرف العراقي (FIB)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qi_card')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'qi_card'
                    ? 'border-amber-500/50 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-[#040710] text-slate-400 hover:bg-white/[0.02]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-yellow-400" />
                <span>كي كارد / ماستر</span>
              </button>
            </div>
          </div>

          {/* Transaction Reference (for digital payments) */}
          {paymentMethod !== 'cash' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                رقم الحوالة أو الإشعار الإلكتروني
              </label>
              <input
                type="text"
                placeholder="TXN-98213821"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500/50 placeholder-slate-600"
              />
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>سيتم توليد وصل قبض فوري</span>
            </div>
            <button
              type="submit"
              disabled={isProcessing || amount <= 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'جاري الحفظ...' : 'تأكيد واستخراج الوصل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
