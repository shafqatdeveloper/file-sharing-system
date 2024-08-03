import React, { useEffect, useState } from "react";
import logoImage from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonLoader from "../../../Components/Loaders/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../../Redux/Features/Auth/AuthSlice";

const SignUp = () => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
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
    if (!termsAccepted) {
      toast.error("You must agree to the terms and conditions to proceed.");
      return;
    }
    setLoading(true);
    try {
      console.log(email);
      console.log(fName);
      const response = await axios.post("/api/user/register", {
        fName,
        lName,
        username,
        phoneNumber,
        companyName,
        aboutCompany,
        email,
        password,
      });
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
    <div className="flex items-center justify-center h-full py-10 bg-gray-100">
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
            <div className="flex items-center gap-2">
              <div className="mb-4">
                <label htmlFor="fName" className="sr-only">
                  First Name
                </label>
                <input
                  id="fName"
                  name="fName"
                  type="text"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lName"
                  name="lName"
                  type="text"
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
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
            <div className="flex items-center gap-2">
              <div className="mb-4">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
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
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="companyName" className="sr-only">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="appearance-none rounded-md relative block w-full p-3 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Company Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="aboutCompany" className="sr-only">
                About Company
              </label>
              <textarea
                id="aboutCompany"
                name="aboutCompany"
                type="text"
                required
                value={aboutCompany}
                rows={3}
                onChange={(e) => setAboutCompany(e.target.value)}
                className="appearance-none rounded-md relative block w-full p-3 border border-primaryDark placeholder-gray-500 text-gray-900  focus:outline-none focus:z-10 sm:text-sm"
                placeholder="About Company"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-primaryDark focus:ring-primaryDark border-gray-300 rounded"
              />
              <label
                htmlFor="termsAccepted"
                className="ml-2 block cursor-pointer text-sm text-gray-900"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primaryDark underline">
                  terms and conditions
                </Link>
              </label>
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
