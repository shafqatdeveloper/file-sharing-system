import axios from "axios";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import Loader from "./Loaders/Loader";

const UnverifiedUserPopup = () => {
  const [visible, setVisible] = useState(true);
  const [laoding, setLaoding] = useState(false);
  const resendVerificationEmailHandler = async (e) => {
    e.preventDefault();
    setLaoding(true);
    try {
      const response = await axios.get(`/api/user/resend/verification-email`);
      if (response.data.success) {
        toast(response.data.message);
        setVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLaoding(false);
    }
  };
  return (
    <div
      className={`w-full ${
        visible ? "flex" : "hidden"
      } h-full  flex-col sm:flex-row items-center justify-between text-white bg-red-600 py-2 px-2`}
    >
      <h1>You have not verified your Email Address Yet!</h1>
      <div className="sm:pr-6 flex items-center gap-3">
        <button
          className="bg-green-500 h-9 w-52 px-2 rounded-md"
          disabled={laoding ? true : false}
          onClick={resendVerificationEmailHandler}
        >
          {laoding ? <Loader /> : "Resend Verification Email"}
        </button>
        <AiOutlineClose
          className="cursor-pointer"
          size={24}
          onClick={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

export default UnverifiedUserPopup;
