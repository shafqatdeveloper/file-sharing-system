import React, { Suspense, lazy, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import SuspenseLoader from "./Components/Loaders/SuspenseLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pdfjs } from "react-pdf";
import NotFound from "./Pages/NotFound/404";
import TopLoadingBar from "./Components/Loaders/TopLoadingBar";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./Redux/Features/Auth/AuthSlice";
import AuthNavbar from "./Components/AuthNavbar";

const Home = lazy(() => import("../src/Pages/Home/Home"));
const Login = lazy(() => import("../src/Pages/Account/Login/Login"));
const Signup = lazy(() => import("../src/Pages/Account/Signup/Signup"));
const DevelopmentPage = lazy(() =>
  import("../src/Pages/Development/PageUnderDev")
);
const AuthHome = lazy(() => import("../src/Pages/AuthenticatedHome/AuthHome"));
const VerifyUserEmail = lazy(() =>
  import("../src/Pages/Account/VerifyEmail/VerifyEmail")
);

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("Auth App.jsx", isAuthenticated);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="bg-white">
      {isAuthenticated ? <AuthNavbar /> : <Navbar />}
      <TopLoadingBar />
      <ToastContainer theme="dark" />
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<DevelopmentPage />} />
          <Route path="/team" element={<DevelopmentPage />} />
          <Route path="/resources" element={<DevelopmentPage />} />
          <Route path="/contact/sales" element={<DevelopmentPage />} />
          <Route path="/folders" element={<AuthHome />} />
          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyUserEmail />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
