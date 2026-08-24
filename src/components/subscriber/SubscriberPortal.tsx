import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentModal } from './PaymentModal';
import { QuickReportModal } from './QuickReportModal';
import { ReceiptArchive } from './ReceiptArchive';
import { ThermalReceiptModal } from '../owner/ThermalReceiptModal';
import { MonthlyBill, PaymentReceipt } from '../../types';
import {
  Zap,
  Activity,
  Receipt,
  AlertTriangle,
  CreditCard,
  Building,
  Bell,
  MapPin,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const SubscriberPortal: React.FC = () => {
  const {
    currentSubscriber,
    generator,
    bills,
    alerts,
    subscribers,
    setCurrentSubscriberId,
    currentSubscriberId,
  } = useApp();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  if (!currentSubscriber) return null;

  // Find unpaid or latest bill
  const subBills = bills.filter((b) => b.subscriberId === currentSubscriber.id);
  const activeUnpaidBill = subBills.find((b) => b.status === 'unpaid' || b.status === 'partial' || b.status === 'overdue');
  const latestBill = activeUnpaidBill || subBills[0];

  const isLineActive = currentSubscriber.status === 'active';
  const isGeneratorRunning = generator.state === 'running';

  const lineLabels = {
    golden: '⚡ خط ذهبي (تشغيل 24 ساعة)',
    regular: '🏠 خط عادي (صباحي + مسائي)',
    night: '🌙 خط ليلي فقط',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Persona Switcher Banner (Helpful for demo & multi-user testing) */}
      <div className="p-4 bg-[#080c18] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-2 text-slate-300">
          <Users className="w-4 h-4 text-amber-500" />
          <span className="text-slate-400">أنت تشاهد التطبيق الآن بصفتك:</span>
          <strong className="text-white font-medium">{currentSubscriber.name}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] uppercase tracking-wider">تبديل الحساب:</span>
          <select
            value={currentSubscriberId}
            onChange={(e) => setCurrentSubscriberId(e.target.value)}
            className="bg-[#040710] border border-slate-800 text-amber-400 font-semibold px-3 py-1.5 rounded-xl text-xs cursor-pointer focus:outline-none focus:border-amber-500/50"
          >
            {subscribers.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#080c18] text-white">
                {s.name} ({s.amperes}A - {s.balanceDue > 0 ? `${s.balanceDue.toLocaleString()} د.ع مطلوب` : 'واصل'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main "Your Line" Hero Status Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#080c18] border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentSubscriber.avatar || '⚡'}</span>
              <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">{currentSubscriber.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {currentSubscriber.address.district} - محلة {currentSubscriber.address.mahalla} زقاق {currentSubscriber.address.zuqaq} دار {currentSubscriber.address.dar}
              </span>
            </p>
          </div>

          {/* Breaker Box info */}
          <div className="text-left bg-[#040710] px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">موقع القاطع في الشارع</span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {currentSubscriber.boxNumber} • {currentSubscriber.breakerNumber}
            </span>
          </div>
        </div>

        {/* Live Power Source & Ampere Gauges */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          {/* Ampere Capacity */}
          <div className="p-4 rounded-xl bg-[#040710] border border-slate-800 text-center flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              سعة خطك المخصص
            </span>
            <div className="my-2.5">
              <span className="text-3xl font-light font-mono-num text-amber-500">
                {currentSubscriber.amperes}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-1">أمبير</span>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {lineLabels[currentSubscriber.lineType]}
            </span>
          </div>

          {/* Current Power Source Status */}
          <div className="p-4 rounded-xl bg-[#040710] border border-slate-800 text-center flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Building className="w-3.5 h-3.5 text-sky-400" />
              مصدر الكهرباء المغذي
            </span>
            <div className="my-2.5">
              <span
                className={`text-base font-light ${
                  generator.state === 'running'
                    ? 'text-emerald-400'
                    : generator.state === 'national_grid'
                    ? 'text-sky-400'
                    : 'text-rose-400'
                }`}
              >
                {generator.state === 'running'
                  ? 'المولدة شغالة ⚡'
                  : generator.state === 'national_grid'
                  ? 'الكهرباء الوطنية 🏛️'
                  : 'صيانة دورية 🛠️'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              مولدة: {generator.name}
            </span>
          </div>

          {/* Voltage & Grid Stability */}
          <div className="p-4 rounded-xl bg-[#040710] border border-slate-800 text-center flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              الفولتية الواصلة لمنزلك
            </span>
            <div className="my-2.5">
              <span className="text-3xl font-light font-mono-num text-white">
                {generator.currentVoltage > 0 ? `${generator.currentVoltage}V` : '0V'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              تردد 50Hz مستقر
            </span>
          </div>
        </div>

        {/* 1-Tap Emergency Trigger */}
        <div className="pt-5 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="text-xs text-slate-400 text-center sm:text-right">
            هل فصلت الجوزة في الشارع أو تواجه ضعف بالفولتية؟
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition shadow-lg shadow-red-500/10 w-full sm:w-auto justify-center"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>الجوزة فصلت! إبلاغ صاحب المولدة</span>
          </button>
        </div>
      </div>

      {/* Monthly Bill & Instant Payment Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#080c18] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-light text-white">
              فاتورة الاشتراك للشهر الحالي ({latestBill ? latestBill.monthYear : 'آب 2026'})
            </h3>
          </div>
          {latestBill && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                latestBill.status === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : latestBill.status === 'partial'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {latestBill.status === 'paid'
                ? 'تم التسديد بالكامل ✅'
                : latestBill.status === 'partial'
                ? 'مسدد جزئياً ⏳'
                : 'بانتظار التسديد 💳'}
            </span>
          )}
        </div>

        {latestBill && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#040710] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-300 pb-2.5 border-b border-slate-800/60">
              <span className="text-slate-400">تفاصيل الاشتراك:</span>
              <span className="font-mono-num font-medium text-white">
                {latestBill.amperes} أمبير × {latestBill.pricePerAmpere.toLocaleString()} د.ع ={' '}
                {latestBill.baseAmount.toLocaleString()} د.ع
              </span>
            </div>

            {latestBill.previousDebt > 0 && (
              <div className="flex justify-between items-center text-xs text-red-400 pb-2.5 border-b border-slate-800/60">
                <span>ديون سابقة متبقية:</span>
                <span className="font-mono-num font-bold">
                  +{latestBill.previousDebt.toLocaleString()} د.ع
                </span>
              </div>
            )}

            {latestBill.paidAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-400 pb-2.5 border-b border-slate-800/60">
                <span>المبلغ المسدد مسبقاً:</span>
                <span className="font-mono-num font-medium">
                  -{latestBill.paidAmount.toLocaleString()} د.ع
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-sm text-slate-300">المبلغ المطلوب تسديده:</span>
              <span className="text-2xl font-light font-mono-num text-amber-500">
                {(latestBill.totalDue - latestBill.paidAmount).toLocaleString()} <span className="text-xs text-slate-400">د.ع</span>
              </span>
            </div>
          </div>
        )}

        {/* Payment CTA */}
        {latestBill && latestBill.status !== 'paid' ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>دفع الفاتورة الآن عبر زين كاش / FIB</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-medium justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>شكراً لك! اشتراكك مسدد بالكامل لهذا الشهر ولا توجد أي ديون بذمتك.</span>
          </div>
        )}
      </div>

      {/* Neighborhood Generator Announcements & Outages */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#080c18] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-light text-white">إعلانات وتنبيهات مولدة الحي</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-num font-semibold">{alerts.length} تنبيه</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border transition ${
                alt.isUrgent
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-[#040710] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-xs text-white flex items-center gap-2">
                  {alt.isUrgent && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>}
                  <span>{alt.title}</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono-num shrink-0">
                  {alt.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
              <div className="text-[10px] text-amber-500 mt-2 font-semibold">
                — {alt.author}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipts Archive */}
      <ReceiptArchive
        onSelectReceipt={(receipt) => {
          setSelectedReceipt(receipt);
        }}
      />

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={latestBill}
        subscriber={currentSubscriber}
        onSuccess={(receipt) => {
          setSelectedReceipt(receipt);
        }}
      />

      <QuickReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <ThermalReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
