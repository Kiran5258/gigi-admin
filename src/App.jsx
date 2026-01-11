import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import AddDomainService from "./pages/AddDomainService";
import AddServiceList from "./pages/AddServiceList";
import { Employee } from "./pages/Employee";
import { Service } from "./pages/Service";
import ServiceList from "./pages/ServiceList";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Run checkAuth ONCE
  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {/* If logged in → go to dashboard */}
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Dashboard Protected Route */}
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/add-domain-service"
          element={authUser ? <AddDomainService /> : <Navigate to="/login" />} />
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

        <Route
          path="/auth/service-list/:domainServiceId"
          element={<ServiceList />}
        />

      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
