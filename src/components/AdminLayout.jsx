// ...existing code...
import AdminSidebar from "../components/AdminSiderbar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout ({ children }) {
  return (
    <div className="app-shell">
      <AdminSidebar />

      <div className="ml-64 min-h-screen">
        <AdminNavbar />
        <main className="p-6">
          <div className="card">{children}</div>
        </main>
      </div>
    </div>
  );
}