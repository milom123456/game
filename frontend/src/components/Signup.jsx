import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://offerwell-production.up.railway.app/api/signup', formData);
            alert(response.data.message);
            navigate('/login'); // সফল হলে লগইন পেজে নিয়ে যাবে
        } catch (err) {
            alert(err.response?.data?.error || "Signup Failed");
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Create Account</h2>
                <input 
                    type="text" placeholder="Full Name" required 
                    className="w-full p-3 mb-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                <input 
                    type="email" placeholder="Email Address" required 
                    className="w-full p-3 mb-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" placeholder="Password" required 
                    className="w-full p-3 mb-6 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button className="w-full bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-700 transition">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;