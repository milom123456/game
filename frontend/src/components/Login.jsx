import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken?.(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96 mx-auto mt-10">
      <input
        type="email"
        placeholder="Email"
        required
        className="p-2 border rounded"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="p-2 border rounded"
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default Login;
