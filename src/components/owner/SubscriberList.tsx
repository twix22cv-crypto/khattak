import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscriber, PaymentReceipt } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Zap,
  Edit2,
  Trash2,
  Banknote,
  PowerOff,
  Power,
  Share2,
  MapPin,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SubscriberListProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (sub: Subscriber) => void;
  onOpenQuickPayment: (sub: Subscriber) => void;
}

export const SubscriberList: React.FC<SubscriberListProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenQuickPayment,
}) => {
  const { subscribers, deleteSubscriber, updateSubscriber, showToast, generator } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [lineFilter, setLineFilter] = useState<string>('all');
  const [boxFilter, setBoxFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Unique boxes list for filter
  const boxes = Array.from(new Set(subscribers.map((s) => s.boxNumber)));

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery) ||
      sub.boxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.address.zuqaq.includes(searchQuery) ||
      sub.address.dar.includes(searchQuery);

    const matchesLine = lineFilter === 'all' || sub.lineType === lineFilter;
    const matchesBox = boxFilter === 'all' || sub.boxNumber === boxFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesLine && matchesBox && matchesStatus;
  });

  const totalAmperes = filteredSubscribers.reduce((acc, s) => acc + s.amperes, 0);

  const toggleSubscriberStatus = (sub: Subscriber) => {
    const newStatus = sub.status === 'active' ? 'suspended' : 'active';
    updateSubscriber(sub.id, { status: newStatus });
    showToast(
      'تغيير حالة الخط',
      `تم ${newStatus === 'active' ? 'إعادة تشغيل خط' : 'فصل خط جوزة'} المشترك ${sub.name}`,
      newStatus === 'active' ? 'success' : 'warning'
    );
  };

  const shareInvoiceWhatsApp = (sub: Subscriber) => {
    const text = `السلام عليكم أخ ${sub.name} 🌹\nفاتورة اشتراك مولدة ${generator.name}\nعدد الأمبيرات: ${sub.amperes} أمبير\nالمبلغ المطلوب: ${sub.balanceDue.toLocaleString()} د.ع\n\nيمكنك التسديد الآن بسهولة عبر زين كاش أو FIB أو عند قدوم الجابي.\nشكراً لتعاونكم!`;
    navigator.clipboard.writeText(text);
    showToast('تم نسخ رسالة الفاتورة 📲', 'يمكنك إرسالها الآن للمشترك عبر واتساب أو SMS', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Search Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#080c18] border border-slate-800">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="بحث بالاسم، الهاتف، البوكس، الزقاق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Line Type Filter */}
          <select
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">كافة أنواع الخطوط</option>
            <option value="golden">⚡ خط ذهبي (24 ساعة)</option>
            <option value="regular">🏠 خط عادي</option>
            <option value="night">🌙 خط ليلي</option>
          </select>

          {/* Box Filter */}
          <select
            value={boxFilter}
            onChange={(e) => setBoxFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">كافة البوكسات</option>
            {boxes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">كافة الحالات</option>
            <option value="active">🟢 شغال</option>
            <option value="suspended">🟡 مفصول (ديون)</option>
            <option value="disconnected">🔴 ملغي</option>
          </select>
        </div>

        {/* View Switcher & Add Subscriber */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center bg-[#040710] border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض جدول مفصل"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض بطاقات"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono-num hidden sm:block">
            {filteredSubscribers.length} مشترك •{' '}
            <span className="text-amber-500 font-bold">{totalAmperes} أمبير</span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة مشترك جديد</span>
          </button>
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">لا يوجد مشتركين مطابقين لمعايير البحث الحالية.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Sophisticated Table View */
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/30">
                  <th className="p-4 sm:px-6">رمز المشترك</th>
                  <th className="p-4 sm:px-6">الاسم والعنوان</th>
                  <th className="p-4 sm:px-6">البوكس والقاطع</th>
                  <th className="p-4 sm:px-6 text-center">السعة</th>
                  <th className="p-4 sm:px-6 text-center">الحالة</th>
                  <th className="p-4 sm:px-6">المبلغ المطلوب</th>
                  <th className="p-4 sm:px-6 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {filteredSubscribers.map((sub) => {
                  const isActive = sub.status === 'active';
                  const isSuspended = sub.status === 'suspended';

                  return (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:px-6 font-mono text-xs text-slate-500">
                        SUB-{sub.id.padStart(4, '0')}
                      </td>
                      <td className="p-4 sm:px-6">
                        <div className="flex flex-col">
                          <span className="text-white font-medium flex items-center gap-1.5">
                            <span>{sub.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            {sub.address.district} - م{sub.address.mahalla} ز{sub.address.zuqaq} د{sub.address.dar} •{' '}
                            <span className="font-mono text-amber-500/80">{sub.phone}</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <span className="font-mono text-xs text-slate-300 bg-[#040710] px-2.5 py-1 rounded-lg border border-slate-800">
                          {sub.boxNumber} • {sub.breakerNumber}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-center">
                        <span className="font-bold text-amber-500 font-mono-num text-sm">
                          {sub.amperes} Amp
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {sub.lineType === 'golden' ? 'ذهبي 24h' : sub.lineType === 'night' ? 'ليلي' : 'عادي'}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-center">
                        {isActive ? (
                          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 inline-block">
                            ACTIVE
                          </span>
                        ) : isSuspended ? (
                          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20 inline-block">
                            DEBTOR
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-500/20 inline-block">
                            DISCONNECTED
                          </span>
                        )}
                      </td>
                      <td className="p-4 sm:px-6 font-mono-num font-medium">
                        {sub.balanceDue > 0 ? (
                          <span className="text-red-400 font-bold">{sub.balanceDue.toLocaleString()} د.ع</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">0 د.ع (واصل)</span>
                        )}
                      </td>
                      <td className="p-4 sm:px-6 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenQuickPayment(sub)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                          >
                            تسديد
                          </button>
                          <button
                            onClick={() => toggleSubscriberStatus(sub)}
                            className={`p-1.5 rounded-lg text-xs transition ${
                              isActive
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            }`}
                            title={isActive ? 'فصل الجوزة' : 'إعادة توصيل الخط'}
                          >
                            {isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => shareInvoiceWhatsApp(sub)}
                            className="p-1.5 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 transition"
                            title="مشاركة الفاتورة"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(sub)}
                            className="p-1.5 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 transition"
                            title="تعديل"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف المشترك ${sub.name}؟`)) {
                                deleteSubscriber(sub.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-xs bg-white/5 text-slate-400 hover:text-red-400 transition"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscribers.map((sub) => {
            const isActive = sub.status === 'active';
            const isSuspended = sub.status === 'suspended';

            const lineLabels = {
              golden: { label: 'خط ذهبي 24h', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
              regular: { label: 'خط عادي', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
              night: { label: 'خط ليلي', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
            };

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    : isSuspended
                    ? 'bg-slate-900/40 border-red-500/30'
                    : 'bg-slate-900/20 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  {/* Top Row: Name, Line Type & Amperes Badge */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg shrink-0">
                        {sub.avatar || '👤'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{sub.name}</span>
                        </h4>
                        <span
                          className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded border ${
                            lineLabels[sub.lineType]?.color
                          }`}
                        >
                          {lineLabels[sub.lineType]?.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono-num font-bold text-sm">
                        {sub.amperes} Amp
                      </div>
                      <span
                        className={`text-[9px] font-bold block mt-1 ${
                          isActive
                            ? 'text-emerald-400'
                            : isSuspended
                            ? 'text-red-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {isActive ? '● ACTIVE' : isSuspended ? '● DEBTOR' : '● DISCONNECTED'}
                      </span>
                    </div>
                  </div>

                  {/* Details: Address & Box/Breaker */}
                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>العنوان:</span>
                      </div>
                      <span className="font-medium text-slate-200">
                        {sub.address.district} - م{sub.address.mahalla} ز{sub.address.zuqaq} د{sub.address.dar}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>البوكس والقاطع:</span>
                      </div>
                      <span className="font-mono text-slate-300">
                        {sub.boxNumber} • {sub.breakerNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>الهاتف:</span>
                      </div>
                      <a
                        href={`tel:${sub.phone}`}
                        className="font-mono text-amber-400 hover:underline"
                      >
                        {sub.phone}
                      </a>
                    </div>
                  </div>

                  {/* Balance / Due Amount Card */}
                  <div className="p-3 rounded-xl bg-[#040710] border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">المبلغ المطلوب:</span>
                    <span
                      className={`text-sm font-bold font-mono-num ${
                        sub.balanceDue > 0 ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {sub.balanceDue > 0 ? `${sub.balanceDue.toLocaleString()} د.ع` : '0 د.ع (واصل)'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Toggle Breaker Power button */}
                    <button
                      onClick={() => toggleSubscriberStatus(sub)}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                      title={isActive ? 'فصل الجوزة (قطع الخط)' : 'إعادة توصيل الخط'}
                    >
                      {isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                    </button>

                    {/* WhatsApp Invoice share */}
                    <button
                      onClick={() => shareInvoiceWhatsApp(sub)}
                      className="p-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition"
                      title="مشاركة الفاتورة عبر واتساب"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => onOpenEditModal(sub)}
                      className="p-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition"
                      title="تعديل البيانات"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف المشترك ${sub.name}؟`)) {
                          deleteSubscriber(sub.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-400 hover:text-red-400 transition"
                      title="حذف المشترك"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Collect payment button */}
                  <button
                    onClick={() => onOpenQuickPayment(sub)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.2)] transition shrink-0"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>تسجيل دفعة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
