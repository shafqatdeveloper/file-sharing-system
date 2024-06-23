import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminHome from "../AdminHomepage/AdminHome";
import HomePage from "../Homepage/Homepage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setisAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("/api/user/authenticate", {
          withCredentials: true,
        });
        const user = response.data.loggedInUser;
        if (user) {
          if (user.role === "admin") {
            setisAdminLoggedIn(true);
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{isAdminLoggedIn ? <AdminHome /> : <HomePage />}</>;
};

export default Home;
