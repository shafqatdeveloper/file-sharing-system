import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await axios.put(
          `/api/user/verify-email/${verificationToken}`
        );
        if (response.data.success) {
          toast(response.data.message);
          setTimeout(() => navigate("/"), 3000);
        } else {
          toast(response.data.message);
        }
      } catch (error) {
        toast(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmailToken();
  }, [verificationToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          {loading && (
            <p className="mt-2 text-sm text-gray-600">
              Verifying your email...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
