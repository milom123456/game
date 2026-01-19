import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Clock, CheckCircle } from 'lucide-react';

const StatBox = ({ title, value, icon }) => (
  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <div className="bg-gray-800 p-3 rounded-lg">{icon}</div>
  </div>
);

const AdminDashboard = () => {
  const data = [
    { name: 'Mon', revenue: 400 }, { name: 'Tue', revenue: 700 },
    { name: 'Wed', revenue: 500 }, { name: 'Thu', revenue: 1200 },
    { name: 'Fri', revenue: 900 }, { name: 'Sat', revenue: 1500 },
    { name: 'Sun', revenue: 1800 },
  ];

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatBox title="Total Revenue" value="$4,520" icon={<DollarSign className="text-green-500"/>} />
        <StatBox title="Active Users" value="1,240" icon={<Users className="text-blue-500"/>} />
        <StatBox title="Pending Cashouts" value="14" icon={<Clock className="text-yellow-500"/>} />
        <StatBox title="Completed" value="8,432" icon={<CheckCircle className="text-purple-500"/>} />
      </div>
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <XAxis dataKey="name" stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;