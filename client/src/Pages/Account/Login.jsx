import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const redirect = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        redirect("/");
        toast(response.data.message, {
          theme: "dark",
        });
      } else {
        toast(response.data.message, { theme: "dark" });
      }
    } catch (error) {
      if (error.response) {
        toast(error.response.data.message || "An error occurred.", {
          theme: "dark",
        });
      } else if (error.request) {
        toast("No response received from the server.", { theme: "dark" });
      } else {
        toast("An error occurred while setting up the request.", {
          theme: "dark",
        });
      }
    }
  };

  useEffect(() => {
    const authorize = async () => {
      const response = await axios.get("/api/admin/authenticate", {
        withCredentials: true,
      });
      const admin = response.data.loggedInAdmin;
      if (admin && admin.role === "admin") {
        redirect("/");
      }
    };
    authorize();
  }, [redirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
