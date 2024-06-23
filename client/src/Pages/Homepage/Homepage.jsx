// src/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [path, setPath] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setPath(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let sanitizedPath = path;

    // Check if the path starts with a domain or protocol
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    if (urlPattern.test(sanitizedPath)) {
      try {
        const url = new URL(sanitizedPath);
        sanitizedPath = url.pathname;
      } catch (e) {
        // If the input is not a valid URL, do nothing and let the path be
      }
    }

    navigate(sanitizedPath);
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4">
      <header className="bg-white shadow p-4">
        <h1 className="text-3xl font-bold text-center">
          Welcome to Your Homepage
        </h1>
      </header>
      <main className="mt-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-4 rounded shadow"
        >
          <div className="mb-4">
            <label
              htmlFor="path"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Enter Folder Path Given by Admin:
            </label>
            <input
              type="text"
              id="path"
              value={path}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="absfhc.com  or  https://absfhc.com  or  /folder/view/id"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Go
          </button>
        </form>
      </main>
    </div>
  );
};

export default HomePage;
