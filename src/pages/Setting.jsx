import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Settings, Palette, Type, Box, RefreshCw, Moon, Sun, Check } from "lucide-react";

const DEFAULT = {
  "--indigo-600": "#3366ff",
  "--indigo-700": "#2952cc",
  "--font-sans": "'Outfit', sans-serif",
  "--radius-md": "20px",
};

export default function Setting() {
  const [tokens, setTokens] = useState(() => {
    try {
      const raw = localStorage.getItem("ui_tokens");
      return raw ? JSON.parse(raw) : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  const [dark, setDark] = useState(() => localStorage.getItem("ui_dark") === "1");

  const apply = (nextTokens, isDark) => {
    const root = document.documentElement;
    Object.entries(nextTokens).forEach(([k, v]) => root.style.setProperty(k, v));
    // In this version, we stick to the vibrant background defined in CSS, but could toggle a class for dark mode
  };

  const update = (key, value) => {
    const next = { ...tokens, [key]: value };
    setTokens(next);
    apply(next, dark);
    localStorage.setItem("ui_tokens", JSON.stringify(next));
  };

  const reset = () => {
    setTokens(DEFAULT);
    apply(DEFAULT, false);
    localStorage.removeItem("ui_tokens");
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 card-premium bg-white dark:bg-slate-900 !p-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Platform Aesthetics</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Interface personality and visual semantics protocols</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="btn-secondary-premium !w-auto !px-8"
          >
            <RefreshCw size={18} className="mr-3" /> Reset Factory Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Color Palette */}
            <div className="card-premium bg-white dark:bg-slate-900 space-y-8">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Palette size={20} className="stroke-[3px]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Chromatic Authority</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">PRIMARY SIGNATURE</label>
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/50 rounded-[24px] border border-slate-100 dark:border-slate-800">
                    <input
                      type="color"
                      value={tokens["--indigo-600"]}
                      onChange={(e) => update("--indigo-600", e.target.value)}
                      className="w-14 h-14 p-0 border-0 rounded-2xl cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{tokens["--indigo-600"]}</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">Main interactive logic color</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">ACCENT AMPLIFIER</label>
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/50 rounded-[24px] border border-slate-100 dark:border-slate-800">
                    <input
                      type="color"
                      value={tokens["--indigo-700"]}
                      onChange={(e) => update("--indigo-700", e.target.value)}
                      className="w-14 h-14 p-0 border-0 rounded-2xl cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{tokens["--indigo-700"]}</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">Active node & hover states</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Shape */}
            <div className="card-premium bg-white dark:bg-slate-900 space-y-10">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Type size={20} className="stroke-[3px]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Topology & Geometry</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">CORE TYPEFACE</label>
                  <div className="grid grid-cols-1 gap-3">
                    {["'Outfit', sans-serif", "'Inter', sans-serif", "'Poppins', sans-serif"].map((font) => (
                      <button
                        key={font}
                        onClick={() => update("--font-sans", font)}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${tokens["--font-sans"] === font ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100/50 dark:shadow-none' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950/20 text-slate-400 dark:text-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500/30'}`}
                      >
                        <span className="text-sm font-black uppercase tracking-widest" style={{ fontFamily: font }}>{font.split("'")[1]}</span>
                        {tokens["--font-sans"] === font && <Check size={18} className="stroke-[3px]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">SHELF GEOMETRY</label>
                  <div className="grid grid-cols-1 gap-3">
                    {["12px", "20px", "32px"].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => update("--radius-md", radius)}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${tokens["--radius-md"] === radius ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100/50 dark:shadow-none' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950/20 text-slate-400 dark:text-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500/30'}`}
                      >
                        <span className="text-sm font-black uppercase tracking-widest">
                          {radius === "12px" ? 'INDUSTRIAL' : radius === "20px" ? 'AERODYNAMIC' : 'ORGANIC'}
                        </span>
                        <div className="w-8 h-8 border-2 border-indigo-600/30 dark:border-indigo-400/30 shadow-inner" style={{ borderRadius: radius }}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Preview */}
          <div className="space-y-8">
            {/* Real-time Preview */}
            <div className="space-y-8">
              <div className="card-premium bg-white dark:bg-slate-900 !p-10 sticky top-10 space-y-10 overflow-hidden shadow-2xl shadow-indigo-100/20 dark:shadow-none">
                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] dark:opacity-10 rotate-12">
                  <Box size={200} />
                </div>

                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800 pb-8">Real-time Simulation</h3>

                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[var(--radius-md)] border border-white dark:border-slate-800 shadow-inner">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2" style={{ fontFamily: tokens["--font-sans"] }}>Sub-system Test</h4>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed italic">Visualizing global interface tokens in current runtime context.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      className="w-full py-5 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${tokens["--indigo-600"]}, ${tokens["--indigo-700"]})`,
                        borderRadius: tokens["--radius-md"]
                      }}
                    >
                      Authorize Node
                    </button>
                    <button
                      className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                      style={{ borderRadius: tokens["--radius-md"] }}
                    >
                      Secondary View
                    </button>
                  </div>

                  <div className="bg-indigo-600/5 dark:bg-indigo-400/10 p-8 rounded-[var(--radius-md)] border border-indigo-600/10 dark:border-indigo-400/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.6)]" style={{ backgroundColor: tokens["--indigo-600"] }}></div>
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Throughput Velocity</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ backgroundColor: tokens["--indigo-600"] }}></div>
                      </div>
                      <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 transition-all duration-1000 opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: tokens["--indigo-600"] }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] text-center italic">Engine v3.0 Core Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
