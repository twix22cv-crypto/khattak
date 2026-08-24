import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentReceipt } from '../../types';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ThermalReceiptProps {
  receipt: PaymentReceipt | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptProps> = ({ receipt, onClose }) => {
  const { generator } = useApp();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels: Record<string, string> = {
    zain_cash: 'زين كاش (ZainCash)',
    fib: 'المصرف العراقي الأول (FIB)',
    qi_card: 'كي كارد / ماستركارد',
    cash: 'دفع نقدي (كاش)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-500" />
            <h3 className="font-light text-white text-base">وصل قبض رسمي | فاتورة حرارية</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto flex justify-center bg-[#040710]/80">
          <div
            id="thermal-receipt-modal"
            className="bg-white text-slate-900 p-6 rounded-xl w-full max-w-[340px] shadow-2xl font-mono text-xs border border-dashed border-slate-300 relative"
            dir="rtl"
          >
            {/* Generator Header */}
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-400">
              <div className="font-black text-base text-slate-900 mb-0.5">
                {generator.name}
              </div>
              <div className="text-[11px] text-slate-600 font-sans">
                {generator.neighborhood}
              </div>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                هاتف الإدارة: {generator.phone}
              </div>
              <div className="inline-block mt-2 px-2.5 py-0.5 bg-slate-900 text-white font-bold text-[10px] rounded">
                وصل استلام اشتراك مولدة
              </div>
            </div>

            {/* Receipt Details */}
            <div className="py-3 space-y-1.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">رقم الوصل:</span>
                <span className="font-bold font-mono-num">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">اسم المشترك:</span>
                <span className="font-bold font-sans">{receipt.subscriberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">الاشتراك:</span>
                <span className="font-bold">{receipt.amperes} أمبير ({receipt.monthYear})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">طريقة الدفع:</span>
                <span className="font-bold">{paymentLabels[receipt.paymentMethod] || receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">التاريخ والوقت:</span>
                <span className="font-mono-num">{receipt.paidAt}</span>
              </div>
              {receipt.transactionRef && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500 font-sans">رمز الحركة:</span>
                  <span className="font-mono">{receipt.transactionRef}</span>
                </div>
              )}
            </div>

            {/* Amount Summary */}
            <div className="py-3 border-b-2 border-dashed border-slate-400 space-y-1 text-sm">
              <div className="flex justify-between items-center text-slate-900 font-black text-base pt-1">
                <span>المبلغ المستلم:</span>
                <span className="font-mono-num text-emerald-800">
                  {receipt.amountPaid.toLocaleString()} د.ع
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>المتبقي بذمة المشترك:</span>
                <span className="font-mono-num">
                  {receipt.remainingDebt > 0
                    ? `${receipt.remainingDebt.toLocaleString()} د.ع`
                    : '0 د.ع (خالص)'}
                </span>
              </div>
            </div>

            {/* QR Code & Official Stamp */}
            <div className="pt-4 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-2 border border-slate-200 rounded-md">
                <QRCodeSVG value={receipt.qrPayload || receipt.receiptNumber} size={90} />
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-sans">
                امسح الرمز للتحقق من صحة الفاتورة
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>منظومة خَـطَّـك الرقمية المعتمدة</span>
              </div>
              <div className="text-[9px] text-slate-400 mt-1">
                شكراً لالتزامكم بالتسديد في الموعد المحدد
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-500">
            متوافق مع الطابعات الحرارية عبر البلوتوث / USB
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#040710] text-slate-400 hover:text-white border border-slate-800 transition"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوصل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
