import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // সার্ভার থেকে আসা এরর দেখানো
                alert(data.message || data.error || "Login failed");
                console.log("Error details:", data.message || data.error);
            } else {
                console.log("Login successful!", data);

                // যদি backend JWT দেয়, localStorage এ রাখা যায়
                if (data.token) localStorage.setItem("token", data.token);

                // সফল হলে ড্যাশবোর্ডে পাঠানো
                navigate('/dashboard'); 
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            alert("Server is not responding. Check if backend is running.");
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">Welcome Back</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    className="w-full p-3 mb-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-emerald-500"
                    autoComplete="username"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    autoComplete="current-password"
                    className="w-full p-3 mb-6 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-emerald-500"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit" className="w-full bg-emerald-600 p-3 rounded-lg font-bold hover:bg-emerald-700 transition">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
