import React from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketType } from '../../types';
import {
  Wrench,
  ZapOff,
  Activity,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export const TicketManager: React.FC = () => {
  const { tickets, updateTicketStatus, subscribers } = useApp();

  const typeDetails: Record<
    TicketType,
    { label: string; icon: React.ReactNode; color: string }
  > = {
    breaker_tripped: {
      label: 'الجوزة فصلت / طفرت',
      icon: <ZapOff className="w-4 h-4 text-rose-400" />,
      color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    },
    low_voltage: {
      label: 'ضعف الفولتية',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    broken_cable: {
      label: 'كيبل مقطوع / تالف',
      icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
      color: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    },
    change_ampere: {
      label: 'طلب تعديل الأمبيرات',
      icon: <TrendingUp className="w-4 h-4 text-sky-400" />,
      color: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    },
    billing_inquiry: {
      label: 'استفسار عن الفاتورة',
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
    other: {
      label: 'طلب فني آخر',
      icon: <Wrench className="w-4 h-4 text-slate-400" />,
      color: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    },
  };

  const openTickets = tickets.filter((t) => t.status === 'open');
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">بلاغات عاجلة جديدة</span>
            <span className="text-3xl font-light text-red-400 font-mono-num">{openTickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ZapOff className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">قيد الفحص والإصلاح</span>
            <span className="text-3xl font-light text-amber-500 font-mono-num">{inProgressTickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block">تم الإصلاح والتشغيل</span>
            <span className="text-3xl font-light text-emerald-400 font-mono-num">{resolvedTickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <h3 className="text-base font-light text-white">صندوق الشكاوى والأعطال الواردة</h3>

        {tickets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#080c18] border border-slate-800 shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm text-slate-400">لا توجد شكاوى أو أعطال معلقة حالياً. الشبكة مستقرة!</p>
          </div>
        ) : (
          tickets.map((tkt) => {
            const typeInfo = typeDetails[tkt.type] || typeDetails.other;
            const sub = subscribers.find((s) => s.id === tkt.subscriberId);

            return (
              <div
                key={tkt.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-xl ${
                  tkt.status === 'open'
                    ? 'bg-[#080c18] border-red-500/30'
                    : tkt.status === 'in_progress'
                    ? 'bg-[#080c18] border-amber-500/30'
                    : 'bg-slate-900/30 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${typeInfo.color}`}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{tkt.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeInfo.color}`}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        بواسطة: <span className="text-slate-200 font-medium">{tkt.subscriberName}</span> •{' '}
                        <span className="font-mono text-amber-500">{tkt.boxNumber}</span>
                        {sub?.address && (
                          <span className="text-slate-500">
                            {' '}
                            (م{sub.address.mahalla} ز{sub.address.zuqaq} د{sub.address.dar})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-500 font-mono-num">
                      {tkt.createdAt}
                    </span>
                    {tkt.subscriberPhone && (
                      <a
                        href={`tel:${tkt.subscriberPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#040710] hover:bg-white/5 text-slate-300 border border-slate-800"
                      >
                        <Phone className="w-3 h-3 text-amber-500" />
                        <span className="font-mono-num">{tkt.subscriberPhone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="py-3 text-xs text-slate-300 leading-relaxed">
                  "{tkt.description}"
                </div>

                {/* Footer Action buttons */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/40">
                  <div className="text-[11px] text-slate-400">
                    الحالة الحالية:{' '}
                    <span
                      className={`font-bold ${
                        tkt.status === 'open'
                          ? 'text-red-400'
                          : tkt.status === 'in_progress'
                          ? 'text-amber-500'
                          : 'text-emerald-400'
                      }`}
                    >
                      {tkt.status === 'open'
                        ? 'جديدة بانتظار التحرك'
                        : tkt.status === 'in_progress'
                        ? 'الفني متوجه للبوكس'
                        : 'تم حل المشكلة'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tkt.status !== 'in_progress' && tkt.status !== 'resolved' && (
                      <button
                        onClick={() => updateTicketStatus(tkt.id, 'in_progress')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition"
                      >
                        بدء المعالجة
                      </button>
                    )}
                    {tkt.status !== 'resolved' && (
                      <button
                        onClick={() => updateTicketStatus(tkt.id, 'resolved')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم الإصلاح وتوصيل الخط</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
