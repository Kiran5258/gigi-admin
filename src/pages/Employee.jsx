import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { axiosInstance } from '../config/axios'
import Loader from '../components/Loader';
import EmployeeSection from '../components/EmployeeSection';

export const Employee = () => {
    const [employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployee();
    }, []);
    const fetchEmployee = async () => {
        try {
            const res = await axiosInstance.get("/admin/get-all-employee");
            setEmployee(res.data.employee || []);
        } catch (err) {
            console.error("Employee fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const normalizeEmployee = (emp) => {
        switch (emp.employeeType) {
            case "single_employee":
                return {
                    id: emp.empId,
                    name: emp.fullName,
                    phoneNo: emp.phoneNo,
                    team: emp.teamAccepted,
                    typeLabel: "Single Employee",
                    typeKey: "single_employee",
                    createdAt: emp.createdAt,
                };

            case "multiple_employee":
                return {
                    id: emp.TeamId,
                    name: emp.ownerName,
                    storeName: emp.storeName,
                    members: emp.members,
                    phoneNo: emp.phoneNo,
                    typeLabel: "Multiple Employee",
                    typeKey: "multiple_employee",
                    createdAt: emp.createdAt,
                };

            case "tool_shop":
                return {
                    id: emp.toolShopId,
                    name: emp.ownerName,
                    storeName: emp.shopName,
                    gstNo: emp.gstNo,
                    phoneNo: emp.phoneNo,
                    typeLabel: "Tool Shop",
                    typeKey: "tool_shop",
                    createdAt: emp.createdAt,
                };

            default:
                return null;
        }
    };

    const normalizedEmployees = employee
        .map(normalizeEmployee)
        .filter(Boolean);

    const singleEmployees = normalizedEmployees.filter(
        (e) => e.typeKey === "single_employee"
    );
    const multipleEmployees = normalizedEmployees.filter(
        (e) => e.typeKey === "multiple_employee"
    );
    const toolshopEmployees = normalizedEmployees.filter(
        (e) => e.typeKey === "tool_shop"
    );
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-slate-800">All Employees</h1>
                  <div className="flex gap-2">
                    <button className="btn-primary">Invite</button>
                    <button className="btn-ghost">Export</button>
                  </div>
                </div>

                {loading ? (
                    <div className="py-16 flex items-center justify-center">
                      <Loader full />
                    </div>
                ) : normalizedEmployees.length === 0 ? (
                    <div className="card text-center py-12 text-slate-600">No employee found</div>
                ) : (
                    <div className="space-y-8">
                        <EmployeeSection title="Single Employee" data={singleEmployees} />
                        <EmployeeSection title="Multiple Employee" data={multipleEmployees} />
                        <EmployeeSection title="Tool Shop" data={toolshopEmployees} />
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
