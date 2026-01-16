// ...new file...
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const DEFAULT = {
  "--color-primary": "#1752ff",
  "--color-primary-600": "#0f44d1",
  "--font-sans": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  "--radius-sm": "8px",
  "--surface-1": "#f8fafc",
  "--color-bg": "#ffffff",
};

const applyTokens = (tokens, dark = false) => {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
  if (dark) {
    root.style.setProperty("--color-bg", "#0b1220");
    root.style.setProperty("--surface-1", "#071022");
    root.style.setProperty("--color-primary-600", tokens["--color-primary-600"] || "#0f44d1");
    root.style.setProperty("color-scheme", "dark");
  } else {
    root.style.setProperty("--color-bg", tokens["--color-bg"] || "#ffffff");
    root.style.setProperty("--surface-1", tokens["--surface-1"] || "#f8fafc");
    root.style.setProperty("color-scheme", "light");
  }
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

  useEffect(() => {
    applyTokens(tokens, dark);
  }, []); // apply once on mount

  const update = (key, value) => {
    const next = { ...tokens, [key]: value };
    setTokens(next);
    applyTokens(next, dark);
    localStorage.setItem("ui_tokens", JSON.stringify(next));
  };

  const toggleDark = (v) => {
    setDark(v);
    applyTokens(tokens, v);
    localStorage.setItem("ui_dark", v ? "1" : "0");
  };

  const reset = () => {
    setTokens(DEFAULT);
    setDark(false);
    applyTokens(DEFAULT, false);
    localStorage.removeItem("ui_tokens");
    localStorage.removeItem("ui_dark");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Appearance / Theme</h1>
            <p className="text-sm text-slate-500 mt-1">Customize colors, typography and basic tokens.</p>
          </div>

          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => reset()}>Reset</button>
          </div>
        </div>

        <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 block mb-2">Primary color</label>
              <input
                type="color"
                value={tokens["--color-primary"]}
                onChange={(e) => update("--color-primary", e.target.value)}
                className="w-16 h-10 p-0 border-0 rounded"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 block mb-2">Primary dark</label>
              <input
                type="color"
                value={tokens["--color-primary-600"]}
                onChange={(e) => update("--color-primary-600", e.target.value)}
                className="w-16 h-10 p-0 border-0 rounded"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 block mb-2">Base font family</label>
              <select
                value={tokens["--font-sans"]}
                onChange={(e) => update("--font-sans", e.target.value)}
                className="input-box"
              >
                <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial">Inter</option>
                <option value="Roboto, system-ui, -apple-system, 'Segoe UI', Inter, Arial">Roboto</option>
                <option value="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto">System</option>
                <option value="'Poppins', Inter, system-ui, Arial">Poppins</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600 block mb-2">Border radius</label>
              <select
                value={tokens["--radius-sm"]}
                onChange={(e) => update("--radius-sm", e.target.value)}
                className="input-box"
              >
                <option value="6px">Small</option>
                <option value="8px">Default</option>
                <option value="12px">Large</option>
                <option value="16px">Pill</option>
              </select>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <label className="text-sm text-slate-600">Dark mode</label>
              <input type="checkbox" checked={dark} onChange={(e) => toggleDark(e.target.checked)} />
            </div>
          </div>

          <div>
            <div className="mb-3">
              <div className="text-sm text-slate-600">Preview</div>
            </div>

            <div className="bg-[var(--surface-1)] p-4 rounded-lg border border-gray-100">
              <div className="mb-4">
                <h3 className="text-lg font-semibold" style={{ fontFamily: tokens["--font-sans"] }}>Gigiman Admin</h3>
                <p className="text-sm text-slate-500">Preview of primary color, buttons and cards.</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <button
                  className="btn-primary"
                  style={{
                    background: `linear-gradient(90deg, ${tokens["--color-primary"]}, ${tokens["--color-primary-600"]})`,
                    borderRadius: tokens["--radius-sm"],
                    fontFamily: tokens["--font-sans"],
                  }}
                >
                  Primary
                </button>

                <button
                  className="btn-ghost"
                  style={{
                    borderRadius: tokens["--radius-sm"],
                    fontFamily: tokens["--font-sans"],
                  }}
                >
                  Ghost
                </button>
              </div>

              <div className="card p-3" style={{ borderRadius: tokens["--radius-sm"], fontFamily: tokens["--font-sans"] }}>
                <div className="text-sm text-slate-700">Card title</div>
                <div className="text-xs text-slate-500 mt-1">Card body preview. Background and spacing follow global tokens.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}