import AdminSidebar from "../components/AdminSiderbar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout ({ children }) {
  return (
    <div className="flex">
      
      <AdminSidebar />

      <div className="ml-60 w-full min-h-screen bg-gray-100">

        <AdminNavbar />

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}
