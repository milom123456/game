import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center italic">Join CASHFLOW</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Start earning real cash today!</p>
        <form className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Full Name</label>
            <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email</label>
            <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Password</label>
            <input type="password" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="••••••••" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition mt-4">Create Account</button>
        </form>
        <p className="text-gray-500 text-center mt-6">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;