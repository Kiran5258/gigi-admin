import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { axiosInstance } from '../config/axios'
import { Loader, User } from 'lucide-react';
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
                <h1 className="text-3xl font-bold mb-6">All Employees</h1>

                {loading ? (
                    <Loader/>
                ) : normalizedEmployees.length === 0 ? (
                    <p>No employee found</p>
                ) : (
                    <>
                        <EmployeeSection title="Single Employee" data={singleEmployees} />
                        <EmployeeSection title="Multiple Employee" data={multipleEmployees} />
                        <EmployeeSection title="Tool Shop" data={toolshopEmployees} />
                    </>
                )}
            </div>
        </AdminLayout>
    )
}
