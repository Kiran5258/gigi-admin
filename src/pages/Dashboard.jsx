// ...existing code...
import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard");
        const data = res.ok ? await res.json() : null;
        if (mounted) setStats(data);
      } catch {
        if (mounted) setStats(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <AdminLayout>
      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="text-sm text-slate-500">Revenue</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">₹{stats?.revenue ?? "0"}</div>
            </div>

            <div className="card">
              <div className="text-sm text-slate-500">Orders</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">{stats?.orders ?? 0}</div>
            </div>

            <div className="card">
              <div className="text-sm text-slate-500">Services</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">{stats?.services ?? 0}</div>
            </div>

            <div className="card">
              <div className="text-sm text-slate-500">Active Employees</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">{stats?.employees ?? 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Revenue Trend</h3>
              <div className="h-48 bg-slate-50 rounded-md flex items-center justify-center text-slate-400">Chart placeholder</div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Top Services</h3>
              <ul className="space-y-3">
                {(stats?.topServices || []).map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{s.title}</div>
                      <div className="text-xs text-slate-500">{s.domain}</div>
                    </div>
                    <div className="text-sm text-slate-600">₹{s.price}</div>
                  </li>
                ))}
                {(!stats?.topServices || stats.topServices.length === 0) && (
                  <li className="text-slate-500 text-sm">No data</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
// ...existing code...