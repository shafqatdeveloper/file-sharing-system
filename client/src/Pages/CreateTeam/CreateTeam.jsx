import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateTeam = () => {
  const { teamLeaderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/team/create`, {
        teamName,
      });
      if (location.state?.from) {
        navigate(location.state.from);
        toast(response.data.message);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
    }
  };

  console.log("Prev Location", location?.state?.from);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Create New Team
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="teamName"
              className="block text-gray-600 font-medium mb-2"
            >
              Team Name:
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryDark"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primaryDark text-white py-2 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
