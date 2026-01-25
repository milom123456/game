import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/api/signup", formData);
      alert(res.data.message || "Signup সফল");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Full Name" required onChange={e => setFormData({...formData, fullName: e.target.value})} />
      <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
      <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
