import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const UnverifiedUserPopup = () => {
  const [visible, setVisible] = useState(true);
  const resendVerificationEmailHandler = async () => {};
  return (
    <div
      className={`w-full ${
        visible ? "flex" : "hidden"
      } h-full  flex-col sm:flex-row items-center justify-between text-white bg-red-600 py-2 px-2`}
    >
      <h1>You have not verified your Email Address Yet!</h1>
      <div className="sm:pr-6 flex items-center gap-3">
        <button
          className="bg-green-500 p-2 rounded-md"
          onClick={resendVerificationEmailHandler}
        >
          Resend Verification Email
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
