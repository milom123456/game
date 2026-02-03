import React, { useState } from 'react';
import { LayoutDashboard, Wallet, Gamepad2, History, ExternalLink, X } from 'lucide-react';

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition ${
      active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'
    }`}
  >
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

const UserDashboard = () => {
  const [balance] = useState(1250); 
  const [activeWall, setActiveWall] = useState(null);
  const userId = "USER_786"; // এটি আপনার ডাটাবেস থেকে আসা আসল ইউজার আইডি হতে হবে

  const offerWalls = [
    { 
      id: 1, 
      name: "Notik.me", 
      url: `https://notik.me/coins?api_key=YOUR_KEY&pub_id=YOUR_ID&user_id=${userId}`, 
      color: "bg-orange-500" 
    },
    { 
      id: 2, 
      name: "AdGate Media", 
      url: `https://wall.adgatemedia.com/affiliate/YOUR_ID/${userId}`, 
      color: "bg-blue-500" 
    },
    { 
      id: 3, 
      name: "CPAGrip", 
      // এখানে আপনার আসল টুল বা অফার আইডি বসান
      url: `https://www.cpagrip.com/show.php?l=0&u=2489929&id=OFFER_ID&tracking_id=${userId}`, 
      color: "bg-green-600" 
    }
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700 hidden md:flex">
        <h2 className="text-2xl font-bold text-blue-500 mb-10 italic">OFFERWELL</h2>
        <nav className="flex-1 space-y-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={!activeWall} onClick={() => setActiveWall(null)} />
          <NavItem icon={<Gamepad2 size={20}/>} label="All Offers" active={!!activeWall} />
          <NavItem icon={<Wallet size={20}/>} label="Cashout" />
          <NavItem icon={<History size={20}/>} label="History" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">স্বাগতম! 👋</h1>
            <p className="text-gray-400">অফার পূর্ণ করে ইনকাম শুরু করুন।</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-blue-500/30 flex items-center gap-4">
            <Wallet className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-xl font-bold text-green-400">${(balance / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {activeWall ? (
          <div className="bg-white rounded-2xl h-[75vh] w-full relative overflow-hidden">
            <button onClick={() => setActiveWall(null)} className="absolute top-4 right-4 bg-red-600 p-2 rounded-full text-white z-50">
              <X size={20} />
            </button>
            <iframe src={activeWall} className="w-full h-full border-none" title="Offerwall" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard title="Completed" value="12" color="bg-purple-500" />
              <StatCard title="Pending" value="03" color="bg-yellow-500" />
              <StatCard title="Total Earned" value="$54.00" color="bg-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-6">Featured Offerwalls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerWalls.map((wall) => (
                <div key={wall.id} onClick={() => setActiveWall(wall.url)} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl ${wall.color} flex items-center justify-center mb-4`}>
                    <ExternalLink size={24} />
                  </div>
                  <h4 className="text-xl font-bold mb-1">{wall.name}</h4>
                  <p className="text-blue-400 font-bold flex items-center gap-2">Open Wall <ExternalLink size={14} /></p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;