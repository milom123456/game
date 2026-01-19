import React, { useState } from 'react';
import { LayoutDashboard, Wallet, Gamepad2, History, User, LogOut } from 'lucide-react';

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'}`}>
    {icon} <span>{label}</span>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
    <div className={`h-1 w-12 mt-3 rounded ${color}`}></div>
  </div>
);

const OfferCard = ({ title, reward, type, image }) => (
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition cursor-pointer flex items-center gap-4">
    <img src={image} alt={title} className="w-12 h-12 rounded-lg bg-gray-700" />
    <div className="flex-1">
      <h4 className="font-medium">{title}</h4>
      <span className="text-xs text-blue-400 uppercase font-bold">{type}</span>
    </div>
    <div className="text-right">
      <p className="text-green-400 font-bold">${reward}</p>
      <button className="text-[10px] bg-blue-600 px-2 py-1 rounded mt-1">Earn Now</button>
    </div>
  </div>
);

const UserDashboard = () => {
  const [balance] = useState(1250); 

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700 hidden md:flex">
        <h2 className="text-2xl font-bold text-blue-500 mb-10 italic">CASHFLOW</h2>
        <nav className="flex-1 space-y-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Gamepad2 size={20}/>} label="All Offers" />
          <NavItem icon={<Wallet size={20}/>} label="Cashout" />
          <NavItem icon={<History size={20}/>} label="History" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">স্বাগতম, User! 👋</h1>
            <p className="text-gray-400">আজকের অফারগুলো চেক করুন।</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-blue-500/30 flex items-center gap-4">
            <Wallet className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-xl font-bold text-green-400">${(balance / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Completed" value="12" color="bg-purple-500" />
          <StatCard title="Pending" value="03" color="bg-yellow-500" />
          <StatCard title="Total Earned" value="$54.00" color="bg-blue-500" />
        </div>

        <h3 className="text-xl font-semibold mb-4">Featured Offers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <OfferCard title="adgatemia" reward="15.00" type="Game" image="https://via.placeholder.com/50" />
          <OfferCard title="Quick Survey" reward="0.80" type="Survey" image="https://via.placeholder.com/50" />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;