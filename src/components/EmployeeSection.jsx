import React from "react";
import { Phone, Users, Building, ShieldAlert, ShieldCheck, Box, History, Lock, Unlock } from "lucide-react";

const EmployeeSection = ({ title, data, onBlock, onUnblock }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h2>
        <div className="px-4 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-black text-[10px] tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">
          {data.length} NODES
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((emp) => {
          const initials = (emp.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
          const isBlocked = emp.isBlocked;

          return (
            <article
              key={emp.dbId}
              className={`card-premium !p-0 overflow-hidden group flex flex-col justify-between transition-all duration-500 hover:border-indigo-200 dark:hover:border-indigo-500/30
                ${isBlocked ? "border-rose-100 dark:border-rose-900/50 bg-rose-50/5 dark:bg-rose-950/10" : "bg-white dark:bg-slate-900"}`}
            >
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl shadow-xl transition-all duration-500 group-hover:scale-110
                             ${isBlocked ? "bg-rose-500 text-white shadow-rose-100 dark:shadow-rose-900/40" : "bg-indigo-600 text-white shadow-indigo-100 dark:shadow-indigo-900/40"}`}>
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[150px]">
                        {emp.name || "UNNAMED ENTITY"}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{emp.id || "ID-UNASSIGNED"}</p>
                    </div>
                  </div>

                  {isBlocked ? (
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800 animate-pulse">
                      <ShieldAlert size={18} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <ShieldCheck size={18} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {emp.storeName && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-[20px] group-hover:bg-white dark:group-hover:bg-slate-800 border border-slate-100 dark:border-transparent transition-all shadow-sm">
                      <Building size={16} className="text-indigo-400 dark:text-indigo-500" />
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{emp.storeName}</span>
                    </div>
                  )}

                  {emp.typeKey === "multiple_employee" && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-[20px] group-hover:bg-white dark:group-hover:bg-slate-800 border border-slate-100 dark:border-transparent transition-all shadow-sm">
                      <Users size={16} className="text-indigo-400 dark:text-indigo-500" />
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{emp.members} Crew Members</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-[20px] group-hover:bg-white dark:group-hover:bg-slate-800 border border-slate-100 dark:border-transparent transition-all shadow-sm">
                    <Phone size={16} className="text-indigo-400 dark:text-indigo-500" />
                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 tracking-widest">{emp.phoneNo}</span>
                  </div>

                  {isBlocked && emp.blockedUntil && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-2xl border border-rose-100 dark:border-rose-800 flex gap-3 items-center">
                      <History size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
                      <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                        Isolation lock until {new Date(emp.blockedUntil).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {emp.capabilities && emp.capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-slate-50 dark:border-slate-800">
                      {emp.capabilities.map((it, idx) => (
                        <span key={idx} className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[9px] px-3 py-1 rounded-full font-black uppercase border border-indigo-50 dark:border-indigo-900 shadow-sm tracking-widest group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          {it}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/30">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Entry Datum</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{new Date(emp.createdAt).toLocaleDateString()}</span>
                </div>

                {isBlocked ? (
                  <button
                    onClick={() => onUnblock(emp.dbId, emp.typeKey)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 hover:bg-emerald-600 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <Unlock size={12} /> RESTORE
                  </button>
                ) : (
                  <button
                    onClick={() => onBlock(emp.dbId, emp.typeKey)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-100 dark:shadow-rose-900/20 hover:bg-rose-600 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <Unlock size={12} /> ISOLATE
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeSection;
