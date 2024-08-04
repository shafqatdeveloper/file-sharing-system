import React, { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import SuspenseLoader from "./Components/Loaders/SuspenseLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pdfjs } from "react-pdf";
import NotFound from "./Pages/NotFound/404";
import TopLoadingBar from "./Components/Loaders/TopLoadingBar";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./Redux/Features/Auth/AuthSlice";
import AuthNavbar from "./Components/AuthNavbar";
import axios from "axios";
import Loader from "./Components/Loaders/Loader";
import { AiOutlineClose } from "react-icons/ai";
import EditFileViewer from "./Pages/EditFile/EditFileViewer";
import CreateTeam from "./Pages/CreateTeam/CreateTeam";

const UnAuthenticatedHome = lazy(() =>
  import("../src/Pages/UnAuthenticatedHome/UnAuthenticatedHome")
);
const Login = lazy(() => import("../src/Pages/Account/Login/Login"));
const Signup = lazy(() => import("../src/Pages/Account/Signup/Signup"));
const DevelopmentPage = lazy(() =>
  import("../src/Pages/Development/PageUnderDev")
);
const Folders = lazy(() => import("./Pages/Folders/Folders"));
const VerifyUserEmail = lazy(() =>
  import("../src/Pages/Account/VerifyEmail/VerifyEmail")
);
const AddFolder = lazy(() => import("../src/Pages/AddFolder/Steeper"));
const SingleFolder = lazy(() => import("../src/Pages/Folder/SingleFolder"));
const ViewSingleFile = lazy(() => import("../src/Pages/FileViewer/PdfViewer"));
const AuthHome = lazy(() => import("../src/Pages/Companies/Companies"));
const AddCompany = lazy(() => import("../src/Pages/AddCompany/AddCompany"));
const MyAccount = lazy(() => import("../src/Pages/Account/Profile/Profile"));
const BrowseTemplates = lazy(() =>
  import("../src/Pages/Templates/AllTemplates")
);
const ForgotPassword = lazy(() =>
  import("../src/Pages/Account/ResetPassword/ResetPassword")
);

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isNotVerifiedUser, setIsNotVerifiedUser] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const checkVerification = async () => {
      const response = await axios.get("/api/user/check/verification");
      if (response.data.success) {
        setIsNotVerifiedUser(true);
        setVisible(true);
      }
    };
    checkVerification();
  }, []);

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
    <div className="bg-white">
      {isAuthenticated ? (
        <div>
          <AuthNavbar />
          {isNotVerifiedUser && (
            <div
              className={`w-full ${
                visible ? "flex" : "hidden"
              } h-full  flex-col sm:flex-row gap-2 items-center justify-between text-white bg-red-600 py-2 px-2`}
            >
              <h1>You have not verified your Email Address Yet!</h1>
              <div className="sm:pr-6 flex items-center justify-center gap-3">
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
          )}
        </div>
      ) : (
        <Navbar />
      )}
      <TopLoadingBar />
      <ToastContainer theme="dark" />
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<UnAuthenticatedHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<DevelopmentPage />} />
          <Route path="/team" element={<DevelopmentPage />} />
          <Route path="/resources" element={<DevelopmentPage />} />
          <Route path="/contact/sales" element={<DevelopmentPage />} />
          <Route path="/company/folders/:companyId" element={<Folders />} />
          <Route path="/folder/view/:folderId" element={<SingleFolder />} />
          <Route path="/file/view/:fileId" element={<ViewSingleFile />} />
          <Route path="/home" element={<AuthHome />} />
          <Route path="/company/add" element={<AddCompany />} />
          <Route path="/templates/browse" element={<BrowseTemplates />} />
          <Route path="/my/account" element={<MyAccount />} />
          <Route
            path="/file/view/receiver/:fileId"
            element={<EditFileViewer />}
          />
          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyUserEmail />}
          />
          <Route path="/folder/add/:companyId" element={<AddFolder />} />
          <Route path="/team/create/:teamLeaderId" element={<CreateTeam />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
