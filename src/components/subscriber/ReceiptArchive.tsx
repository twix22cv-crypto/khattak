import React from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentReceipt } from '../../types';
import { Receipt, Eye, Printer, ShieldCheck, Calendar, Banknote } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptArchiveProps {
  onSelectReceipt: (receipt: PaymentReceipt) => void;
}

export const ReceiptArchive: React.FC<ReceiptArchiveProps> = ({ onSelectReceipt }) => {
  const { receipts, currentSubscriber } = useApp();

  if (!currentSubscriber) return null;

  const subscriberReceipts = receipts.filter(
    (r) => r.subscriberId === currentSubscriber.id || r.subscriberName.includes(currentSubscriber.name)
  );

  const paymentLabels: Record<string, string> = {
    zain_cash: 'زين كاش (ZainCash)',
    fib: 'المصرف الأول (FIB)',
    qi_card: 'كي كارد',
    cash: 'كاش (مع الجابي)',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-light text-white">أرشيف وصولات القبض الرقمية الموثقة</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono-num">
          {subscriberReceipts.length} وصل مدفوع
        </span>
      </div>

      {subscriberReceipts.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-[#080c18] border border-slate-800 shadow-xl">
          <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">لا توجد وصولات قبض سابقة مسجلة لهذا الحساب حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscriberReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#080c18] border border-slate-800 hover:border-slate-700 shadow-xl transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shrink-0 shadow-sm">
                  <QRCodeSVG value={receipt.qrPayload || receipt.receiptNumber} size={45} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-xs text-white">{receipt.monthYear}</span>
                    <span className="font-mono-num text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {receipt.receiptNumber}
                    </span>
                  </div>
                  <p className="text-sm font-light font-mono-num text-emerald-400 mt-1">
                    {receipt.amountPaid.toLocaleString()} <span className="text-xs text-slate-500 font-normal">د.ع</span>
                  </p>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {receipt.paidAt} • {paymentLabels[receipt.paymentMethod] || receipt.paymentMethod}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectReceipt(receipt)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#040710] hover:bg-white/5 text-slate-300 border border-slate-800 transition shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>عرض الوصل</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
