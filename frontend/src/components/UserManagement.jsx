import React, { useState } from 'react';
import { Edit, Trash2, Ban, Search } from 'lucide-react';

const UserManagement = () => {
  const [users] = useState([
    { id: 1, name: "Ariful Islam", email: "arif@example.com", balance: 540.50, status: "Active" },
    { id: 2, name: "Rakib Hasan", email: "rakib@example.com", balance: 10.25, status: "Banned" },
  ]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <input className="bg-gray-900 p-2 rounded" placeholder="Search..." />
      </div>
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4 text-center">Balance</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-800">
                <td className="p-4">{u.name}<br/><span className="text-xs text-gray-500">{u.email}</span></td>
                <td className="p-4 text-center text-green-400">${u.balance}</td>
                <td className="p-4 text-center">{u.status}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Edit size={18} className="text-blue-400 cursor-pointer" />
                  <Ban size={18} className="text-yellow-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;