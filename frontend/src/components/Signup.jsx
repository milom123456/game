import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const navigate = useNavigate();

    // API URL আপনার এনভায়রনমেন্ট অনুযায়ী পরিবর্তন হতে পারে
    const API_URL = 'https://offerwell-production.up.railway.app/api/signup';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData);
            alert(response.data.message || "Signup Successful!");
            navigate('/login'); 
        } catch (err) {
            // সার্ভার থেকে আসা নির্দিষ্ট এরর মেসেজ দেখানো
            alert(err.response?.data?.message || err.response?.data?.error || "Signup Failed");
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white p-4">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Create Account</h2>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        autoComplete="name"
                        className="w-full p-3 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition"
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                    
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        autoComplete="email"
                        className="w-full p-3 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        autoComplete="new-password"
                        className="w-full p-3 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full mt-6 bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
                >
                    Sign Up
                </button>
                
                <p className="mt-4 text-center text-gray-400 text-sm">
                    Already have an account? <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer hover:underline">Login</span>
                </p>
            </form>
        </div>
    );
};

export default Signup;