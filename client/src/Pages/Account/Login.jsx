// src/Login.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirect = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("/api/user/login", {
      email,
      password,
    });
    const user = response.data.loggedInUser;
    if (response.status === 200) {
      redirect("/");
      toast(response.data.message, {
        theme: "dark",
      });
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get("/api/admin/authenticate", {
        withCredentials: true,
      });
      const admin = response.data.loggedInAdmin;
      if (admin || admin.role === "admin") {
        redirect("/");
      }
    };
    authorize();
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && (
          <div className="mb-4 text-red-500">
            Invalid username, password or not authorized
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEamil(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
