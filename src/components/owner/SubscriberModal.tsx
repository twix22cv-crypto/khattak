import React, { useState, useEffect } from 'react';
import { Subscriber, LineType } from '../../types';
import { X, UserPlus, Save, MapPin, Zap, Phone, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberToEdit?: Subscriber | null;
}

export const SubscriberModal: React.FC<SubscriberModalProps> = ({
  isOpen,
  onClose,
  subscriberToEdit,
}) => {
  const { addSubscriber, updateSubscriber } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'المنصور',
    mahalla: '609',
    zuqaq: '',
    dar: '',
    amperes: 6,
    lineType: 'golden' as LineType,
    boxNumber: 'بوكس 1 (B-01)',
    breakerNumber: '',
    status: 'active' as Subscriber['status'],
    notes: '',
  });

  useEffect(() => {
    if (subscriberToEdit) {
      setFormData({
        name: subscriberToEdit.name,
        phone: subscriberToEdit.phone,
        district: subscriberToEdit.address.district,
        mahalla: subscriberToEdit.address.mahalla,
        zuqaq: subscriberToEdit.address.zuqaq,
        dar: subscriberToEdit.address.dar,
        amperes: subscriberToEdit.amperes,
        lineType: subscriberToEdit.lineType,
        boxNumber: subscriberToEdit.boxNumber,
        breakerNumber: subscriberToEdit.breakerNumber,
        status: subscriberToEdit.status,
        notes: subscriberToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '07',
        district: 'المنصور',
        mahalla: '609',
        zuqaq: '12',
        dar: '',
        amperes: 6,
        lineType: 'golden',
        boxNumber: 'بوكس 1 (B-01)',
        breakerNumber: `جوزة ${Math.floor(1 + Math.random() * 20)}`,
        status: 'active',
        notes: '',
      });
    }
  }, [subscriberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (subscriberToEdit) {
      updateSubscriber(subscriberToEdit.id, {
        name: formData.name,
        phone: formData.phone,
        address: {
          district: formData.district,
          mahalla: formData.mahalla,
          zuqaq: formData.zuqaq,
          dar: formData.dar,
        },
        amperes: Number(formData.amperes),
        lineType: formData.lineType,
        boxNumber: formData.boxNumber,
        breakerNumber: formData.breakerNumber,
        status: formData.status,
        notes: formData.notes,
      });
    } else {
      addSubscriber({
        name: formData.name,
        phone: formData.phone,
        address: {
          district: formData.district,
          mahalla: formData.mahalla,
          zuqaq: formData.zuqaq,
          dar: formData.dar,
        },
        amperes: Number(formData.amperes),
        lineType: formData.lineType,
        boxNumber: formData.boxNumber,
        breakerNumber: formData.breakerNumber || 'جوزة 01',
        status: formData.status,
        notes: formData.notes,
        avatar: formData.lineType === 'golden' ? '⚡' : '🏠',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#080c18] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subscriberToEdit ? (
              <Save className="w-5 h-5 text-amber-500" />
            ) : (
              <UserPlus className="w-5 h-5 text-amber-500" />
            )}
            <h3 className="font-light text-white text-base">
              {subscriberToEdit ? 'تعديل بيانات المشترك' : 'إضافة مشترك جديد للمولدة'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                اسم المشترك الثلاثي *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: حيدر علي البغدادي"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>رقم الهاتف (لإرسال الفاتورة) *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0770xxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-500/50 transition placeholder-slate-600"
              />
            </div>
          </div>

          {/* Amperes & Line Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>عدد الأمبيرات (Amp)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={formData.amperes}
                  onChange={(e) => setFormData({ ...formData, amperes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-500/50 transition"
                />
                <span className="text-xs text-amber-500 font-bold px-3 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shrink-0">
                  {formData.amperes} أمبير
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                نوع الخط والتشغيل
              </label>
              <select
                value={formData.lineType}
                onChange={(e) => setFormData({ ...formData, lineType: e.target.value as LineType })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
              >
                <option value="golden">⚡ خط ذهبي (24 ساعة متواصل)</option>
                <option value="regular">🏠 خط عادي (صباحي + مسائي)</option>
                <option value="night">🌙 خط ليلي فقط (مخفض)</option>
              </select>
            </div>
          </div>

          {/* Address Details (Mahalla, Zuqaq, Dar) */}
          <div className="p-4 bg-[#040710] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>عنوان المشترك الدقيق (المنطقة / المحلة / الزقاق)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">المنطقة</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">المحلة</label>
                <input
                  type="text"
                  placeholder="609"
                  value={formData.mahalla}
                  onChange={(e) => setFormData({ ...formData, mahalla: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">الزقاق</label>
                <input
                  type="text"
                  placeholder="14"
                  value={formData.zuqaq}
                  onChange={(e) => setFormData({ ...formData, zuqaq: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">رقم الدار</label>
                <input
                  type="text"
                  placeholder="22"
                  value={formData.dar}
                  onChange={(e) => setFormData({ ...formData, dar: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080c18] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Breaker Box Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-amber-500" />
                <span>رقم بوكس التوزيع في الشارع</span>
              </label>
              <select
                value={formData.boxNumber}
                onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
              >
                <option value="بوكس 1 (B-01)">بوكس 1 (B-01) - بداية الزقاق</option>
                <option value="بوكس 2 (B-02)">بوكس 2 (B-02) - منتصف الزقاق</option>
                <option value="بوكس 3 (B-03)">بوكس 3 (B-03) - نهاية الفرع</option>
                <option value="بوكس 4 (B-04)">بوكس 4 (B-04) - الشارع العام</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                رقم الجوزة (القاطع)
              </label>
              <input
                type="text"
                placeholder="مثال: جوزة 05"
                value={formData.breakerNumber}
                onChange={(e) => setFormData({ ...formData, breakerNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition placeholder-slate-600"
              />
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                حالة الخط
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Subscriber['status'] })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
              >
                <option value="active">🟢 خط شغال ومفعل</option>
                <option value="suspended">🟡 مفصول مؤقتاً (تراكم ديون)</option>
                <option value="disconnected">🔴 ملغي / مقطوع نهائياً</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                ملاحظات إضافية
              </label>
              <input
                type="text"
                placeholder="مثال: عيادة طبية، مشترك قديم..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#040710] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition placeholder-slate-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#040710] text-slate-400 hover:text-white border border-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
            >
              <Save className="w-4 h-4" />
              <span>{subscriberToEdit ? 'حفظ التعديلات' : 'تسجيل المشترك'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
