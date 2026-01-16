
import React from "react";
import { User, Phone, Users, Building } from "lucide-react";

const EmployeeSection = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((emp) => {
          const initials = (emp.name || "U").split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase();
          return (
            <article
              key={emp.id || emp._id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-medium">
                    {initials}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-900">{emp.name || "N/A"}</div>
                    <div className="text-xs text-slate-500">ID: <span className="font-medium text-slate-700">{emp.id || "-"}</span></div>
                  </div>
                </div>

                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {emp.typeLabel}
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-600 space-y-2 mb-3">
                {emp.storeName && (
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Store</div>
                      <div className="font-medium text-slate-800">{emp.storeName}</div>
                    </div>
                  </div>
                )}

                {emp.team && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Team</div>
                      <div className="font-medium text-slate-800">{emp.team}</div>
                    </div>
                  </div>
                )}

                {typeof emp.members !== "undefined" && (
                  <div className="text-xs text-slate-500">Members: <span className="font-medium text-slate-700">{String(emp.members)}</span></div>
                )}

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <div className="text-sm text-slate-700">{emp.phoneNo || "-"}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div>Created: {emp.createdAt ? new Date(emp.createdAt).toLocaleString() : "-"}</div>
                <div className="italic">{emp.typeKey || ""}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeSection;
