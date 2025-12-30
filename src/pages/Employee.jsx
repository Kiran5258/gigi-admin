import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { axiosInstance } from '../config/axios'
import { User } from 'lucide-react';

export const Employee = () => {
    const [employee, setEmployee] = useState([]);

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
    return (
        <AdminLayout>
            <div className='p-6'>
                <h1 className='text-3xl font-bold mb-3'>All Employees</h1>
                {Employee ? (
                    <div className='grid grid-cols-3 gap-6 mt-6'>
                        {employee.map((emp) => (
                            <div key={emp._id} className='bg-white p-6 rounded-xl shadow text-center'>
                                <User/>
                                <h2 className="text-xl font-semibold">{emp.fullname}</h2>
                                <p className="text-gray-600">{emp.phoneNo}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='mt-4'>
                        <p>No employee</p>
                        <Loader />
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
