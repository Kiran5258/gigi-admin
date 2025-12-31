import React from "react";
import { User } from "lucide-react";

const EmployeeSection = ({ title, data }) => {
  if (data.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((emp) => (
          <div
            key={emp._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex item-center gap-3 mb-3">
                <h3 className="font-medium">{emp.id}</h3>
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <User size={22} />
              <h3 className="font-medium">{emp.name || "N/A"}</h3>
            </div>

            {/* Store / Team */}
            {emp.storeName && (
              <p className="text-sm text-gray-600">
                Store: <span className="font-medium">{emp.storeName}</span>
              </p>
            )}

            {emp.team && (
              <p className="text-sm text-gray-600">
                Team: <span className="font-medium">{emp.team}</span>
              </p>
            )}

            {emp.members && (
              <p className="text-sm text-gray-600">
                Members: {emp.members}
              </p>
            )}

            {/* Phone */}
            <p className="text-sm text-gray-600">
              Phone: {emp.phoneNo || "-"}
            </p>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-2">
              {emp.typeLabel}
            </p>
            <p className="text-xs text-gray-400 mt-2">
                Created:{new Date(emp.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSection;
