import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketType } from '../../types';
import { X, ZapOff, Activity, AlertCircle, TrendingUp, Send, CheckCircle2 } from 'lucide-react';

interface QuickReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickReportModal: React.FC<QuickReportModalProps> = ({ isOpen, onClose }) => {
  const { currentSubscriber, createTicket, showToast } = useApp();

  const [selectedType, setSelectedType] = useState<TicketType>('breaker_tripped');
  const [description, setDescription] = useState('');
  const [targetAmpere, setTargetAmpere] = useState<number>(8);

  if (!isOpen || !currentSubscriber) return null;

  const issueOptions: {
    type: TicketType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      type: 'breaker_tripped',
      title: 'الجوزة فصلت / نزلت ⚡',
      description: 'فصلت الجوزة في بوكس الشارع بسبب لود زائد أو تشغيل جهاز',
      icon: <ZapOff className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/30 hover:border-rose-500 bg-rose-500/5',
    },
    {
      type: 'low_voltage',
      title: 'الفولتية هابطة جداً (ضعيفة) 📉',
      description: 'الفولتية أقل من 190V والأجهزة والمكيفات لا تعمل بكفاءة',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 hover:border-amber-500 bg-amber-500/5',
    },
    {
      type: 'broken_cable',
      title: 'خلل أو قطع في كيبل السحب 🔌',
      description: 'الكيبل من البوكس للبيت مقطوع أو به شرارة / احتراق',
      icon: <AlertCircle className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-500/30 hover:border-orange-500 bg-orange-500/5',
    },
    {
      type: 'change_ampere',
      title: 'طلب زيادة أو تقليل الأمبيرات 📈',
      description: 'تعديل سعة خطك للشهر القادم حسب احتياج المنزل',
      icon: <TrendingUp className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/30 hover:border-sky-500 bg-sky-500/5',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const option = issueOptions.find((o) => o.type === selectedType);
    let titleText = option ? option.title : 'إبلاغ عن عطل';
    let fullDesc = description;

    if (selectedType === 'change_ampere') {
      titleText = `طلب تعديل الخط إلى (${targetAmpere} أمبير)`;
      fullDesc = `يرجى تعديل سعة خطي من ${currentSubscriber.amperes} أمبير إلى ${targetAmpere} أمبير. ${description}`;
    }

    createTicket(currentSubscriber.id, selectedType, titleText, fullDesc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZapOff className="w-5 h-5 text-red-400" />
            <h3 className="font-light text-white text-base">إبلاغ فوري لإدارة المولدة</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Sub Info Note */}
          <div className="p-3.5 rounded-xl bg-[#040710] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>المشترك: <strong className="text-white font-medium">{currentSubscriber.name}</strong></span>
            <span className="font-mono text-amber-500 font-medium">
              {currentSubscriber.boxNumber} ({currentSubscriber.breakerNumber})
            </span>
          </div>

          {/* Issue Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              ما المشكلة التي تواجهها في خطك؟
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {issueOptions.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedType(opt.type)}
                    className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500/50 bg-amber-500/10 text-white shadow-sm'
                        : `bg-[#040710] text-slate-300 border-slate-800 hover:border-slate-700`
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {opt.icon}
                      <span className="font-medium text-xs text-white">{opt.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-snug">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ampere Upgrade Selector (if change_ampere) */}
          {selectedType === 'change_ampere' && (
            <div className="p-4 bg-[#040710] rounded-xl border border-sky-500/20 space-y-2">
              <label className="block text-xs font-semibold text-sky-300">
                اختر عدد الأمبيرات المطلوب للشهر القادم:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="2"
                  max="40"
                  value={targetAmpere}
                  onChange={(e) => setTargetAmpere(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-sm text-white font-mono-num font-bold text-center focus:outline-none focus:border-sky-500/50"
                />
                <span className="text-xs text-slate-400">
                  (اشتراكك الحالي: {currentSubscriber.amperes} أمبير)
                </span>
              </div>
            </div>
          )}

          {/* Additional details text */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              تفاصيل إضافية لمساعد الفني (اختياري)
            </label>
            <textarea
              rows={3}
              placeholder="مثال: فصلت الجوزة بعد تشغيل جهاز معين، أو الفولتية واصلة 175V..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              يصل البلاغ مباشرة لهاتف صاحب المولدة
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
            >
              <Send className="w-4 h-4" />
              <span>إرسال البلاغ الفوري</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
