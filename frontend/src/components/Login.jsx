import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center italic">CASHFLOW</h2>
        <form className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email Address</label>
            <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="name@company.com" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Password</label>
            <input type="password" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="••••••••" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition mt-4">Login</button>
        </form>
        <p className="text-gray-500 text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;