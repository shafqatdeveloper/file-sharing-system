import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/logo.png";
import ButtonLoader from "../../../Components/Loaders/ButtonLoader";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../../Redux/Features/Auth/AuthSlice";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        navigate("/home?user=authenticated");
        toast(response.data.message);
      } else {
        toast(response.data.message);
      }
    } catch (err) {
      toast(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home?user=authenticated");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <img src={logoImage} alt="Archi Esgin logo" className="mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in to <strong>Archi Esign</strong> to continue.
          </p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="mb-4 flex items-center  border border-primaryDark placeholder-gray-500 text-gray-900 px-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 outline-none focus:outline-none bg-transparent sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="mb-4 flex items-center  border border-primaryDark placeholder-gray-500 text-gray-900 px-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 outline-none focus:outline-none bg-transparent sm:text-sm"
                placeholder="Password"
              />
              {showPassword ? (
                <BiSolidHide
                  onClick={() => setShowPassword(false)}
                  className="cursor-pointer text-primaryDark"
                  size={22}
                />
              ) : (
                <BiSolidShow
                  onClick={() => setShowPassword(true)}
                  className="cursor-pointer text-primaryDark"
                  size={22}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primaryDark"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="w-full border border-primaryDark rounded-md flex justify-center  items-center h-12 font-medium">
            {loading ? (
              <ButtonLoader />
            ) : (
              <button
                type="submit"
                className="group relative w-full border border-transparent h-full text-sm font-medium rounded-md text-white bg-primaryDark focus:outline-none"
              >
                Continue
              </button>
            )}
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primaryDark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
