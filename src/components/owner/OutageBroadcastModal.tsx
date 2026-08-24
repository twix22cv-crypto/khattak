import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutageAlert } from '../../types';
import {
  Megaphone,
  X,
  Send,
  AlertTriangle,
  Zap,
  Wrench,
  Clock,
  CheckCircle2,
  Copy,
  MessageSquare,
} from 'lucide-react';

interface OutageBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutageBroadcastModal: React.FC<OutageBroadcastModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sendAlert, showToast, subscribers, generator } = useApp();

  const [title, setTitle] = useState('انقطاع الوطنية وتشغيل المولدة ⚡');
  const [message, setMessage] = useState(
    'أهالي منطقتنا الكرام، تم انقطاع خط الكهرباء الوطنية، وبدأنا بتشغيل المولدة لكافة المشتركين. الفولتية مستقرة 225V. يرجى ترشيد الاستهلاك لتجنب نزول الجوزات.'
  );
  const [alertType, setAlertType] = useState<OutageAlert['type']>('generator_started');
  const [isUrgent, setIsUrgent] = useState(false);
  const [targetAudience, setTargetAudience] = useState<'all' | 'unpaid' | 'box1' | 'box2'>('all');

  if (!isOpen) return null;

  const quickTemplates = [
    {
      title: 'انقطاع الوطنية وتشغيل المولدة ⚡',
      message:
        'أهالي منطقتنا الكرام، طفت الكهرباء الوطنية وبدأنا تشغيل المولدة. الفولتية مستقرة. نتمنى لكم يوماً طيباً.',
      type: 'generator_started' as const,
      urgent: false,
    },
    {
      title: 'رجوع الكهرباء الوطنية وإطفاء المولدة 🏛️',
      message:
        'الحمد لله رجعت الوطنية، وتم إطفاء محرك المولدة ووضعه على وضع الاستعداد التلقائي.',
      type: 'grid_online' as const,
      urgent: false,
    },
    {
      title: 'صيانة دورية وتبديل فلاتر ودهن 🛠️',
      message:
        'تنويه لمشتركينا الكرام: ستتوقف المولدة غداً صباحاً لمدة ساعة واحدة (من 6:00 إلى 7:00 ص) لغرض تبديل الفلاتر وإدامة المحرك.',
      type: 'maintenance' as const,
      urgent: true,
    },
    {
      title: 'عطل مفاجئ بالكيبل الرئيسي وجاري الإصلاح ⚠️',
      message:
        'نعتذر عن الانقطاع المفاجئ، حدث خلل بقاطع الدورة الرئيسي في بوكس الشارع والفريق الفني متواجد الآن للإصلاح خلال 20 دقيقة بإذن الله.',
      type: 'breakdown' as const,
      urgent: true,
    },
    {
      title: 'تذكير بتسديد اشتراك المولدة للشهر الحالي 💳',
      message: `نرجو من الإخوة المشتركين الكرام المبادرة بتسديد اشتراك هذا الشهر (${generator.currentMonthAmpPrice.toLocaleString()} د.ع للأمبير) عبر زين كاش أو FIB أو مع الجابي لتجنب قطع الخط.`,
      type: 'payment_reminder' as const,
      urgent: false,
    },
  ];

  const handleApplyTemplate = (tmpl: (typeof quickTemplates)[0]) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setAlertType(tmpl.type);
    setIsUrgent(tmpl.urgent);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendAlert(title, message, alertType, isUrgent);
    showToast(
      'تم إرسال التعميم بنجاح 📢',
      `وصل الإشعار إلى كافة مشتركي المولدة (${subscribers.length} مشترك)`,
      'success'
    );
    onClose();
  };

  const copyForWhatsApp = () => {
    const fullText = `📢 *إشعار من إدارة ${generator.name}*\n\n📌 *${title}*\n\n${message}\n\n📞 للإبلاغ عن الأعطال: ${generator.phone}\n⚡ تطبيق خَـطَّـك لإدارة المولدات`;
    navigator.clipboard.writeText(fullText);
    showToast('تم النسخ للحافظة 📋', 'يمكنك لصق الرسالة الآن في كروب واتساب الحي أو التلغرام', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-500" />
            <h3 className="font-light text-white text-base">مركز تعميم الإشعارات والتنبيهات</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleBroadcast} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Quick Templates Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              نماذج سريعة جاهزة بلهجة أهل المنطقة:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#040710] hover:bg-white/5 text-slate-300 border border-slate-800 whitespace-nowrap shrink-0 transition"
                >
                  {t.title.split(' ')[0]} {t.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              عنوان الإشعار *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              نص الرسالة والتعميم *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500/50 placeholder-slate-600"
            />
          </div>

          {/* Target Audience & Urgent Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                الفئة المستهدفة للإرسال
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#040710] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">كافة المشتركين بالحي ({subscribers.length})</option>
                <option value="unpaid">المتأخرين عن التسديد فقط</option>
                <option value="box1">مشتركي بوكس 1 (B-01)</option>
                <option value="box2">مشتركي بوكس 2 (B-02)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 text-xs text-amber-500/90 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded bg-[#040710] border-slate-800 text-amber-500 focus:ring-amber-500/30 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  تعميم عاجل ومهم جداً
                </span>
              </label>
            </div>
          </div>

          {/* Actions & WhatsApp Copy */}
          <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={copyForWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ لقروب الواتساب</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#040710] text-slate-400 hover:text-white border border-slate-800 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
              >
                <Send className="w-4 h-4" />
                <span>إرسال التعميم الفوري</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
