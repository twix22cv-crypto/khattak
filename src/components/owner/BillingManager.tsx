import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MonthlyBill, PaymentReceipt, Subscriber } from '../../types';
import {
  Receipt,
  FileCheck2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Send,
  Printer,
  Sparkles,
  Search,
} from 'lucide-react';

interface BillingManagerProps {
  onOpenThermalReceipt: (receipt: PaymentReceipt) => void;
  onOpenQuickPayment: (sub: Subscriber) => void;
}

export const BillingManager: React.FC<BillingManagerProps> = ({
  onOpenThermalReceipt,
  onOpenQuickPayment,
}) => {
  const {
    generator,
    updateGeneratorInfo,
    bills,
    generateMonthlyBills,
    subscribers,
    receipts,
    showToast,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('آب 2026');
  const [ampPriceInput, setAmpPriceInput] = useState<number>(generator.currentMonthAmpPrice || 12000);
  const [govRateInput, setGovRateInput] = useState<number>(generator.officialGovRate || 10000);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentBills = bills.filter((b) => b.monthYear === selectedMonth);

  const totalBilled = currentBills.reduce((acc, b) => acc + b.totalDue, 0);
  const totalCollected = currentBills.reduce((acc, b) => acc + b.paidAmount, 0);
  const pendingAmount = Math.max(0, totalBilled - totalCollected);
  const collectionPercentage = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const handleUpdatePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneratorInfo({
      currentMonthAmpPrice: ampPriceInput,
      officialGovRate: govRateInput,
    });
  };

  const handleIssueBatchBills = () => {
    if (
      window.confirm(
        `هل تريد إصدار الفواتير الآلية لكافة المشتركين (${subscribers.length} مشترك) لشهر ${selectedMonth} بسعر ${ampPriceInput.toLocaleString()} د.ع للأمبير؟`
      )
    ) {
      generateMonthlyBills(selectedMonth, ampPriceInput);
    }
  };

  const filteredBills = currentBills.filter((bill) => {
    const sub = subscribers.find((s) => s.id === bill.subscriberId);
    const matchesSearch =
      sub?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub?.phone.includes(searchQuery) ||
      sub?.boxNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return bill.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Pricing Configuration Banner */}
      <div className="p-6 rounded-2xl bg-[#080c18] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-light text-white">تسعيرة الأمبير للشهر الحالي ({selectedMonth})</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            يتم احتساب الفاتورة الشهرية تلقائياً: (عدد الأمبيرات × سعر الأمبير) + الديون السابقة
          </p>
        </div>

        <form onSubmit={handleUpdatePricing} className="flex flex-wrap items-center gap-3">
          <div className="bg-[#040710] px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">سعر الأمبير الذهبي (د.ع)</span>
            <input
              type="number"
              step="500"
              value={ampPriceInput}
              onChange={(e) => setAmpPriceInput(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-amber-500 font-mono-num focus:outline-none w-24"
            />
          </div>

          <div className="bg-[#040710] px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">التسعيرة الحكومية الإرشادية</span>
            <input
              type="number"
              step="500"
              value={govRateInput}
              onChange={(e) => setGovRateInput(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-300 font-mono-num focus:outline-none w-24"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#040710] hover:bg-white/5 text-slate-200 border border-slate-800 transition"
          >
            تثبيت التسعيرة
          </button>

          <button
            type="button"
            onClick={handleIssueBatchBills}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>إصدار فواتير الشهر</span>
          </button>
        </form>
      </div>

      {/* Progress & Collection Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">إجمالي المبالغ المفصلة</span>
          <span className="text-2xl font-light text-white font-mono-num mt-1 block">
            {totalBilled.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ع</span>
          </span>
          <span className="text-[11px] text-slate-500">{currentBills.length} فاتورة صادرة</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">المبالغ المستلمة</span>
          <span className="text-2xl font-light text-emerald-400 font-mono-num mt-1 block">
            {totalCollected.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ع</span>
          </span>
          <span className="text-[11px] text-emerald-500/80 font-bold">
            نسبة التحصيل: {collectionPercentage}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">المبالغ المعلقة</span>
          <span className="text-2xl font-light text-red-400 font-mono-num mt-1 block">
            {pendingAmount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ع</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {currentBills.filter((b) => b.status !== 'paid').length} مشترك متبقي
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">معدل التحصيل العام</span>
          <div className="w-full bg-[#040710] rounded-full h-2.5 my-2 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono-num flex justify-between">
            <span>0 د.ع</span>
            <span>{totalBilled.toLocaleString()} د.ع</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#080c18] rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="بحث عن مشترك، رقم الهاتف، البوكس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 shrink-0 font-bold">تصفية:</span>
          {['all', 'unpaid', 'paid', 'partial', 'overdue'].map((st) => {
            const labels: Record<string, string> = {
              all: 'الكل',
              unpaid: 'غير مسدد',
              paid: 'مسدد بالكامل',
              partial: 'مسدد جزئياً',
              overdue: 'متأخر',
            };
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#040710] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-2xl">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-800/30 text-slate-500 border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4 sm:px-6">المشترك</th>
              <th className="p-4 sm:px-6">الأمبيرات</th>
              <th className="p-4 sm:px-6">قيمة الاشتراك</th>
              <th className="p-4 sm:px-6">ديون سابقة</th>
              <th className="p-4 sm:px-6">المبلغ الكلي</th>
              <th className="p-4 sm:px-6">المدفوع</th>
              <th className="p-4 sm:px-6">الحالة</th>
              <th className="p-4 sm:px-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  لا توجد فواتير مطابقة للبحث أو التصفية
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => {
                const sub = subscribers.find((s) => s.id === bill.subscriberId);
                const isPaid = bill.status === 'paid';
                const isPartial = bill.status === 'partial';
                const isOverdue = bill.status === 'overdue';

                const matchedReceipt = receipts.find((r) => r.billId === bill.id);

                return (
                  <tr key={bill.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 sm:px-6 font-medium text-white">
                      <div>{sub?.name || 'مشترك'}</div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {sub?.phone} • {sub?.boxNumber}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 font-mono-num font-bold text-amber-500">
                      {bill.amperes} A
                    </td>
                    <td className="p-4 sm:px-6 font-mono-num">{bill.baseAmount.toLocaleString()} د.ع</td>
                    <td className="p-4 sm:px-6 font-mono-num text-red-400">
                      {bill.previousDebt > 0 ? `${bill.previousDebt.toLocaleString()} د.ع` : '—'}
                    </td>
                    <td className="p-4 sm:px-6 font-mono-num font-medium text-white">
                      {bill.totalDue.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 sm:px-6 font-mono-num text-emerald-400">
                      {bill.paidAmount.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isPartial
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : isOverdue
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isPaid
                          ? 'مسدد'
                          : isPartial
                          ? 'مسدد جزئياً'
                          : isOverdue
                          ? 'متأخر'
                          : 'غير مسدد'}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!isPaid && sub && (
                          <button
                            onClick={() => onOpenQuickPayment(sub)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                          >
                            قبض
                          </button>
                        )}
                        {matchedReceipt && (
                          <button
                            onClick={() => onOpenThermalReceipt(matchedReceipt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
                            title="عرض / طباعة الوصل الحراري"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
