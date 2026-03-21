import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
import AddDomainService from "./pages/AddDomainService";
import AddServiceList from "./pages/AddServiceList";
import { Employee } from "./pages/Employee";
import { Service } from "./pages/Service";
import ServiceList from "./pages/ServiceList";
import Setting from "./pages/Setting";
import ManageCategory from "./pages/ManageCategory.jsx";
import EditDomain from "./pages/EditDomain";
import DomainpartsList from "./pages/DomainpartsList";
import DomainpartDetail from "./pages/DomainpartDetail";
import AddDomainPart from "./pages/AddDomainPart";
import EditDomainPart from "./pages/EditDomainPart";
import InviteAdmin from "./pages/InviteAdmin";
import InviteSignup from "./pages/InviteSignup";
import ManageBanner from "./pages/ManageBanner";
import ManageUsers from "./pages/ManageUsers";
import UserHistory from "./pages/UserHistory";
import Analytics from "./pages/Analytics";
import ManageCoupons from "./pages/ManageCoupons";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Run checkAuth and sync theme
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={authUser ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/add-domain-service"
          element={authUser ? <AddDomainService /> : <Navigate to="/login" />} />
        <Route
          path="/edit-domain-service/:domainserviceId"
          element={authUser ? <EditDomain /> : <Navigate to="/login" />} />
        <Route
          path="/add-service-list"
          element={authUser ? <AddServiceList /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees"
          element={authUser ? <Employee /> : <Navigate to="/login" />}
        />
        <Route
          path="/services"
          element={authUser ? <Service /> : <Navigate to="/login" />} />
        <Route path="/manage-category" element={<ManageCategory />} />
        <Route path="/service-list/:serviceId/category/:categoryId/edit" element={<ManageCategory />} />
        <Route
          path="/auth/showsubservice/:domainServiceId"
          element={<ServiceList />}
        />
        <Route path="/domainparts" element={authUser ? <DomainpartsList /> : <Navigate to="/login" />} />
        <Route path="/domainpart/:DomainpartId" element={authUser ? <DomainpartDetail /> : <Navigate to="/login" />} />
        <Route path="/edit-domain-part/:DomainpartId" element={authUser ? <EditDomainPart /> : <Navigate to="/login" />} />
        <Route path="/add-domain-part" element={authUser ? <AddDomainPart /> : <Navigate to="/login" />} />
        <Route path="/invite-admin" element={authUser ? <InviteAdmin /> : <Navigate to="/login" />} />
        <Route path="/signup-invite" element={<InviteSignup />} />
        <Route path="/manage-banner" element={authUser ? <ManageBanner /> : <Navigate to="/login" />} />
        <Route path="/coupons" element={authUser ? <ManageCoupons /> : <Navigate to="/login" />} />
        <Route path="/users" element={authUser ? <ManageUsers /> : <Navigate to="/login" />} />
        <Route path="/user-history/:userId" element={authUser ? <UserHistory /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <Setting /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
