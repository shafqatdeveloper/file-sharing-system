import axios from "axios";
import React, { useState } from "react";
import logoImage from "../../../assets/logo.png";
import ButtonLoader from "../../../Components/Loaders/ButtonLoader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/forgot-password", {
        email,
      });
      if (response.data.success) {
        toast(response.data.message);
        setOtpSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  //   Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("/api/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.data.success) {
        navigate("/login");
        toast(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 h-max mt-5 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <img src={logoImage} alt="Archi Esgin logo" className="mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>
        {/* Send OTP Form */}
        <form onSubmit={handleForgetPassword} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label
                htmlFor="email-address"
                className="pb-1 text-sm font-semibold"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                disabled={otpSent ? true : false}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-primaryDark">
                Back to Login
              </Link>
            </div>
          </div>

          <div className="w-full border border-primaryDark rounded-md flex justify-center  items-center h-12 font-medium">
            {loading ? (
              <ButtonLoader />
            ) : (
              <button
                type="submit"
                disabled={otpSent ? true : false}
                className="group relative w-full border border-transparent h-full text-sm font-medium rounded-md text-white bg-primaryDark focus:outline-none"
              >
                Send OTP
              </button>
            )}
          </div>
        </form>
        {/* Reset Password Form */}
        {otpSent && (
          <form
            onSubmit={handleResetPassword}
            className={
              otpSent
                ? "opacity-1 transition-all duration-500 mt-8 space-y-6"
                : "opacity-0 transition-all"
            }
          >
            <div className="rounded-md shadow-sm">
              <div className="mb-4">
                <label htmlFor="otp" className="pb-1 text-sm font-semibold">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                />
              </div>
              <label
                htmlFor="new-password"
                className="pb-1 text-sm font-semibold"
              >
                New Password
              </label>
              <div className="mb-4 w-full flex items-center rounded-md border px-3 border-primaryDark  text-gray-900  focus:outline-none focus:z-10">
                <input
                  id="new-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none rounded-md relative block py-3 outline-none placeholder-gray-500 focus:outline-none  sm:text-sm w-full"
                  placeholder="**********"
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

            <div className="w-full border border-primaryDark rounded-md flex justify-center  items-center h-12 font-medium">
              {loading ? (
                <ButtonLoader />
              ) : (
                <button
                  type="submit"
                  className="group relative w-full border border-transparent h-full text-sm font-medium rounded-md text-white bg-primaryDark focus:outline-none"
                >
                  Reset Password
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
