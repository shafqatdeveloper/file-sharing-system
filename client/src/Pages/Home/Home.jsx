import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../Redux/Features/Auth/AuthSlice";

const Home = () => {
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
  return (
    <div className="bg-white h-[90vh] sm:h-[85vh] flex items-center justify-center">
      <div className="flex flex-col gap-5 items-center justify-center w-full sm:w-2/3 px-3">
        <h1 className="text-xl text-center sm:text-4xl font-sans font-bold tracking-wide leading-relaxed text-primaryDark">
          Seamlessly Upload, Effortlessly Share Your Files, Anywhere, Anytime!
        </h1>
        <h1 className="text-center sm:text-xl">
          Effortlessly upload and share your files with{" "}
          <strong>ARCHI ESIGN</strong>. Access your documents anytime, anywhere,
          for a seamless and flexible file-sharing experience.
        </h1>
        <div className="flex mt-5 items-center justify-center gap-5 sm:gap-12">
          <Link
            to={"/signup"}
            className="flex items-center w-40 justify-center hover:bg-transparent hover:text-primaryDark hover:border-[1px] hover:border-primaryDark transition-all duration-200 text-white font-semibold font-sans tracking-wide bg-primaryDark rounded-full px-3 py-2"
          >
            <button>SIGN UP FREE</button>
          </Link>
          <Link
            to={"/pricing"}
            className="flex items-center w-40 justify-center font-semibold font-sans text-primaryDark tracking-wide border-[1px] border-primaryDark rounded-full px-3 py-2 hover:bg-primaryDark hover:text-white transition-all duration-200"
          >
            <button>SEE PLANS</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
