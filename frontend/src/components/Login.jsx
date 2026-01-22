import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const API_URL = 'https://offerwell-production.up.railway.app/api/login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData);
            
            if (response.data.success) {
                // টোকেন এবং ইউজার ডাটা লোকাল স্টোরেজে সেভ করা
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                alert("Login Successful!");
                navigate('/dashboard'); 
            }
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Email or Password");
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white p-4">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">Welcome Back</h2>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        autoComplete="email"
                        className="w-full p-3 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-emerald-500 transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        autoComplete="current-password"
                        className="w-full p-3 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-emerald-500 transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full mt-6 bg-emerald-600 p-3 rounded-lg font-bold hover:bg-emerald-700 transition duration-300"
                >
                    Login
                </button>

                <p className="mt-4 text-center text-gray-400 text-sm">
                    Don't have an account? <span onClick={() => navigate('/signup')} className="text-emerald-500 cursor-pointer hover:underline">Create Account</span>
                </p>
            </form>
        </div>
    );
};

export default Login;