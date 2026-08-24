import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseRecord, PaymentMethod } from '../../types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Fuel,
  Wrench,
  Users,
  DollarSign,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

export const FinancialLedger: React.FC = () => {
  const { receipts, expenses, addExpense, deleteExpense, bills, subscribers } = useApp();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord['category']>('diesel');
  const [liters, setLiters] = useState<number>(1000);
  const [pricePerL, setPricePerL] = useState<number>(750);
  const [notes, setNotes] = useState('');

  // Calculate totals
  const totalRevenue = receipts.reduce((acc, r) => acc + r.amountPaid, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Breakdown by payment gateway
  const zainCashTotal = receipts
    .filter((r) => r.paymentMethod === 'zain_cash')
    .reduce((acc, r) => acc + r.amountPaid, 0);

  const fibTotal = receipts
    .filter((r) => r.paymentMethod === 'fib')
    .reduce((acc, r) => acc + r.amountPaid, 0);

  const qiCardTotal = receipts
    .filter((r) => r.paymentMethod === 'qi_card')
    .reduce((acc, r) => acc + r.amountPaid, 0);

  const cashTotal = receipts
    .filter((r) => r.paymentMethod === 'cash')
    .reduce((acc, r) => acc + r.amountPaid, 0);

  const digitalTotal = zainCashTotal + fibTotal + qiCardTotal;
  const digitalPercentage = totalRevenue > 0 ? Math.round((digitalTotal / totalRevenue) * 100) : 0;

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    addExpense({
      title: expenseTitle,
      amount: expenseAmount,
      category: expenseCategory,
      litersOfDiesel: expenseCategory === 'diesel' ? liters : undefined,
      pricePerLiter: expenseCategory === 'diesel' ? pricePerL : undefined,
      notes,
    });

    setExpenseTitle('');
    setExpenseAmount(0);
    setNotes('');
    setShowAddExpense(false);
  };

  const handleDieselLitersChange = (l: number, p: number) => {
    setLiters(l);
    setPricePerL(p);
    setExpenseAmount(l * p);
    if (!expenseTitle || expenseTitle.includes('كاز')) {
      setExpenseTitle(`شراء كاز ديزل (${l.toLocaleString()} لتر)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3 High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">إجمالي الإيرادات المحصلة</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-light text-emerald-400 font-mono-num block">
            {totalRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-400">د.ع</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {receipts.length} حركة دفع مسجلة
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">إجمالي المصاريف والتشغيل</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-3xl font-light text-red-400 font-mono-num block">
            {totalExpenses.toLocaleString()} <span className="text-sm font-normal text-slate-400">د.ع</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ديزل، صيانة، فلاتر وأجور
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">صافي الأرباح التقديري</span>
            <Wallet className="w-5 h-5 text-amber-500" />
          </div>
          <span className={`text-3xl font-light font-mono-num block ${netProfit >= 0 ? 'text-amber-500' : 'text-red-400'}`}>
            {netProfit.toLocaleString()} <span className="text-sm font-normal text-slate-400">د.ع</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            بعد خصم كافة الالتزامات والمحروقات
          </span>
        </div>
      </div>

      {/* Payment Gateway Breakdown (Digital vs Cash) */}
      <div className="p-6 rounded-2xl bg-[#080c18] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-light text-white">توزيع الدفع الإلكتروني مقابل الكاش</h3>
            <p className="text-xs text-slate-400">
              الدفع الرقمي يقلل الوقت ويوفر وصولات إلكترونية لا تضيع
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold font-mono-num">
            {digitalPercentage}% دفع إلكتروني
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#040710] rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>نقدي (كاش الجابي)</span>
            </div>
            <span className="text-lg font-light text-white font-mono-num">
              {cashTotal.toLocaleString()} <span className="text-xs text-slate-500">د.ع</span>
            </span>
          </div>

          <div className="p-4 bg-[#040710] rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>زين كاش (ZainCash)</span>
            </div>
            <span className="text-lg font-light text-red-400 font-mono-num">
              {zainCashTotal.toLocaleString()} <span className="text-xs text-slate-500">د.ع</span>
            </span>
          </div>

          <div className="p-4 bg-[#040710] rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>المصرف الأول (FIB)</span>
            </div>
            <span className="text-lg font-light text-cyan-400 font-mono-num">
              {fibTotal.toLocaleString()} <span className="text-xs text-slate-500">د.ع</span>
            </span>
          </div>

          <div className="p-4 bg-[#040710] rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>كي كارد / ماستر</span>
            </div>
            <span className="text-lg font-light text-yellow-400 font-mono-num">
              {qiCardTotal.toLocaleString()} <span className="text-xs text-slate-500">د.ع</span>
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Management Section */}
      <div className="p-6 rounded-2xl bg-[#080c18] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-light text-white">سجل مصاريف التشغيل والمحروقات</h3>
          </div>
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مصروف جديد</span>
          </button>
        </div>

        {/* Add Expense Form Drawer */}
        {showAddExpense && (
          <form
            onSubmit={handleSaveExpense}
            className="p-5 bg-[#040710] rounded-xl border border-slate-800 space-y-3 animate-in fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  نوع المصروف
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="diesel">⛽ شراء كاز (ديزل)</option>
                  <option value="oil_filters">🛠️ دهن محرك وفلاتر</option>
                  <option value="repairs">⚡ صيانة قواطع وكيبلات</option>
                  <option value="operator_wage">👷 أجور الجابي والعمال</option>
                  <option value="platform_fee">📱 اشتراك منظومة خطك</option>
                  <option value="other">📦 مصاريف نثرية أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  بيان المصروف *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شراء كاز حوضية 2,000 لتر"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  المبلغ الإجمالي (د.ع) *
                </label>
                <input
                  type="number"
                  required
                  step="5000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono-num font-bold focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Quick Diesel Helper */}
            {expenseCategory === 'diesel' && (
              <div className="p-3 bg-[#080c18] rounded-xl border border-slate-800 flex flex-wrap items-center gap-3">
                <span className="text-xs text-amber-500 font-bold">حاسبة الكاز السريعة:</span>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <span>الكمية:</span>
                  <input
                    type="number"
                    value={liters}
                    onChange={(e) => handleDieselLitersChange(Number(e.target.value), pricePerL)}
                    className="w-20 px-2 py-1 bg-[#040710] border border-slate-800 rounded text-center font-mono-num text-white"
                  />
                  <span>لتر ×</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <span>سعر اللتر:</span>
                  <input
                    type="number"
                    value={pricePerL}
                    onChange={(e) => handleDieselLitersChange(liters, Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-[#040710] border border-slate-800 rounded text-center font-mono-num text-white"
                  />
                  <span>د.ع =</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono-num">
                  {(liters * pricePerL).toLocaleString()} د.ع
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddExpense(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#080c18] text-slate-400 hover:text-white border border-slate-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                حفظ المصروف
              </button>
            </div>
          </form>
        )}

        {/* Expenses List */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#040710]">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-800/30 text-slate-500 border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest">
              <tr>
                <th className="p-4 sm:px-6">التاريخ</th>
                <th className="p-4 sm:px-6">نوع المصروف</th>
                <th className="p-4 sm:px-6">البيان</th>
                <th className="p-4 sm:px-6">التفاصيل</th>
                <th className="p-4 sm:px-6">المبلغ (د.ع)</th>
                <th className="p-4 sm:px-6 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 sm:px-6 font-mono-num text-slate-400">{exp.date}</td>
                  <td className="p-4 sm:px-6">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      {exp.category === 'diesel'
                        ? 'كاز ديزل'
                        : exp.category === 'oil_filters'
                        ? 'دهن وفلاتر'
                        : exp.category === 'repairs'
                        ? 'صيانة'
                        : exp.category === 'operator_wage'
                        ? 'أجور عمال'
                        : 'أخرى'}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 font-medium text-white">{exp.title}</td>
                  <td className="p-4 sm:px-6 text-slate-400 text-[11px]">{exp.notes || '—'}</td>
                  <td className="p-4 sm:px-6 font-mono-num font-medium text-red-400">
                    {exp.amount.toLocaleString()} د.ع
                  </td>
                  <td className="p-4 sm:px-6 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
