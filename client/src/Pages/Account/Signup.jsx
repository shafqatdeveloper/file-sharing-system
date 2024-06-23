import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePicture);

    try {
      const response = await axios.post("/api/admin/register", formData, {});
      toast(response.data.message);
    } catch (error) {
      console.error("There was an error registering the user!", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
