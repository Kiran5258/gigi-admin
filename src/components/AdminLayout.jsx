// ...existing code...
import AdminSidebar from "../components/AdminSiderbar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Positioned via Fixed in CSS but space accounted here */}
      <div className="hidden lg:block w-80 shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminNavbar />
        <main className="flex-1 p-8 lg:p-12">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}