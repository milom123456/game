import React, { useState } from 'react';
import { Bitcoin, CreditCard, Gift, ArrowRight, Info } from 'lucide-react';

const Cashout = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const payoutMethods = [
    { id: 1, name: 'Litecoin', icon: <Bitcoin className="text-orange-400" />, min: 0.50 },
    { id: 2, name: 'PayPal', icon: <CreditCard className="text-blue-400" />, min: 5.00 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Cashout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {payoutMethods.map(m => (
            <div key={m.id} onClick={() => setSelectedMethod(m)} className={`p-6 bg-gray-800 rounded-xl cursor-pointer border-2 ${selectedMethod?.id === m.id ? 'border-blue-500' : 'border-transparent'}`}>
              <div className="flex justify-between">{m.icon} <span className="text-xs">Min: ${m.min}</span></div>
              <h3 className="text-xl font-bold mt-2">{m.name}</h3>
            </div>
          ))}
        </div>
        {selectedMethod && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <input className="w-full bg-gray-900 p-3 rounded mb-4" placeholder="Amount (USD)" />
            <input className="w-full bg-gray-900 p-3 rounded mb-4" placeholder="Address" />
            <button className="w-full bg-blue-600 py-3 rounded-xl font-bold">Withdraw Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cashout;