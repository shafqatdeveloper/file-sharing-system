import React, { useEffect, useState } from "react";
import logoImage from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonLoader from "../../../Components/Loaders/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../../Redux/Features/Auth/AuthSlice";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home?user=authenticated");
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/register", {
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
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <img src={logoImage} alt="dotloop logo" className="mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up for <strong>Archi Esgin</strong> to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Create your password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full p-3 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Create your password"
              />
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
            Already have an account?
            <Link to="/login" className="font-medium text-primaryDark">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
