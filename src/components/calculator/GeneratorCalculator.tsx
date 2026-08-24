import React, { useState } from 'react';
import {
  Calculator,
  Fuel,
  TrendingUp,
  Zap,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  HelpCircle,
} from 'lucide-react';

export const GeneratorCalculator: React.FC = () => {
  // Inputs
  const [capacityKva, setCapacityKva] = useState<number>(500);
  const [dailyHours, setDailyHours] = useState<number>(8); // Hours of generator run per day
  const [totalAmperes, setTotalAmperes] = useState<number>(800);
  const [pricePerAmpere, setPricePerAmpere] = useState<number>(12000); // IQD
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState<number>(750); // IQD
  const [subsidizedQuotaLiters, setSubsidizedQuotaLiters] = useState<number>(2000); // حصة الكاز المدعوم من المنتجات النفطية
  const [subsidizedPrice, setSubsidizedPrice] = useState<number>(400); // IQD
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(650000); // IQD (دهن وفلاتر وصيانة)
  const [operatorWages, setOperatorWages] = useState<number>(800000); // IQD (أجور العمال والجابي)

  // Calculations
  // Standard diesel consumption: ~0.20 to 0.23 Liters per kVA per hour at 70% load
  const litersPerHour = capacityKva * 0.21;
  const monthlyRunningHours = dailyHours * 30;
  const totalLitersMonthly = Math.round(litersPerHour * monthlyRunningHours);

  // Subsidized vs Commercial Fuel breakdown
  const subsidizedLiters = Math.min(totalLitersMonthly, subsidizedQuotaLiters);
  const commercialLiters = Math.max(0, totalLitersMonthly - subsidizedLiters);

  const fuelCostSubsidized = subsidizedLiters * subsidizedPrice;
  const fuelCostCommercial = commercialLiters * dieselPricePerLiter;
  const totalFuelCost = fuelCostSubsidized + fuelCostCommercial;

  // Revenue
  const totalRevenue = totalAmperes * pricePerAmpere;

  // Expenses
  const totalExpenses = totalFuelCost + monthlyMaintenance + operatorWages;

  // Net Profit
  const netProfitIqd = totalRevenue - totalExpenses;
  const netProfitUsd = Math.round(netProfitIqd / 1500);

  const profitMarginPercent =
    totalRevenue > 0 ? Math.round((netProfitIqd / totalRevenue) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#080c18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight">
              حاسبة أرباح المولدة ومصاريف الكاز في العراق
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            أداة دقيقة لحساب استهلاك الديزل (حصة شركة توزيع المنتجات النفطية + الكاز التجاري) وهوامش الأرباح
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 font-medium shrink-0">
          تقدير واقعي: 0.21 لتر/kVA/ساعة
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#080c18] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>مواصفات المولدة وساعات التشغيل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  قدرة المولدة (kVA)
                </label>
                <input
                  type="number"
                  step="50"
                  value={capacityKva}
                  onChange={(e) => setCapacityKva(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm font-bold text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  ساعات تشغيل المولدة يومياً
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-500 font-mono-num w-16 text-center">
                    {dailyHours} ساعة
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  إجمالي الأمبيرات المحجوزة
                </label>
                <input
                  type="number"
                  step="20"
                  value={totalAmperes}
                  onChange={(e) => setTotalAmperes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm font-bold text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  سعر الأمبير للشهر (د.ع)
                </label>
                <input
                  type="number"
                  step="500"
                  value={pricePerAmpere}
                  onChange={(e) => setPricePerAmpere(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm font-bold text-amber-500 font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Fuel & Maintenance Inputs */}
          <div className="p-6 rounded-2xl bg-[#080c18] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-500" />
              <span>أسعار الديزل (الكاز) والصيانة</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  سعر الكاز التجاري (د.ع/لتر)
                </label>
                <input
                  type="number"
                  value={dieselPricePerLiter}
                  onChange={(e) => setDieselPricePerLiter(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs font-bold text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  حصة الكاز الحكومي المدعوم (لتر)
                </label>
                <input
                  type="number"
                  step="500"
                  value={subsidizedQuotaLiters}
                  onChange={(e) => setSubsidizedQuotaLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs font-bold text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  مصاريف الدهن والفلاتر شهرياً (د.ع)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={monthlyMaintenance}
                  onChange={(e) => setMonthlyMaintenance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  أجور الجابي والعمال (د.ع)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={operatorWages}
                  onChange={(e) => setOperatorWages(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white font-mono-num focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results & Feasibility Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Net Profit Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 shadow-2xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              صافي الربح الشهري التقديري للمولدة:
            </span>

            <div>
              <span className="text-3xl sm:text-4xl font-light font-mono-num text-amber-500 block">
                {netProfitIqd.toLocaleString()} <span className="text-sm text-slate-400 font-normal">د.ع</span>
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono-num mt-1 block">
                ≈ ${netProfitUsd.toLocaleString()} USD (سعر الصرف 1,500)
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">هامش الربح الصافي:</span>
              <span className="font-bold font-mono-num text-emerald-400 text-sm">
                {profitMarginPercent}%
              </span>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="p-5 rounded-2xl bg-[#080c18] border border-slate-800 space-y-3 text-xs shadow-xl">
            <h4 className="font-bold text-white pb-2 border-b border-slate-800/60">
              تفاصيل الإيرادات والمصاريف الشهرية:
            </h4>

            <div className="flex justify-between text-emerald-400 font-medium">
              <span>إجمالي الإيرادات ({totalAmperes} أمبير):</span>
              <span className="font-mono-num font-bold">+{totalRevenue.toLocaleString()} د.ع</span>
            </div>

            <div className="flex justify-between text-red-400">
              <span>
                مصاريف الكاز ({totalLitersMonthly.toLocaleString()} لتر):
              </span>
              <span className="font-mono-num font-bold">-{totalFuelCost.toLocaleString()} د.ع</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>صيانة ودهن وفلاتر:</span>
              <span className="font-mono-num">-{monthlyMaintenance.toLocaleString()} د.ع</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>أجور العمال والجابي:</span>
              <span className="font-mono-num">-{operatorWages.toLocaleString()} د.ع</span>
            </div>

            <div className="p-3 bg-[#040710] rounded-xl border border-slate-800 mt-3 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">معدل حرق الديزل بالساعة:</span>
                <span className="font-mono-num font-bold text-amber-500">
                  {Math.round(litersPerHour)} لتر / ساعة
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">الكاز المدعوم من الدولة:</span>
                <span className="font-mono-num">{subsidizedLiters.toLocaleString()} لتر (400 د.ع)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">الكاز التجاري المشترى:</span>
                <span className="font-mono-num">{commercialLiters.toLocaleString()} لتر ({dieselPricePerLiter} د.ع)</span>
              </div>
            </div>
          </div>

          {/* Khattak Value Proposition for Owner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>فوائد استخدام منظومة خَـطَّـك:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
              <li>تقليل الديون المتراكمة بنسبة تزيد عن 45% عبر إشعارات الدفع الآلية.</li>
              <li>توفير 15-20 ساعة شهرياً كان يقضيها الجابي بالتحصيل الورقي والجدال.</li>
              <li>تقليل الاتصالات الهاتفية المزعجة بنسبة 80% بفضل تعميم إشعارات الأعطال الفورية.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
