import React, { Suspense, lazy } from "react";
import Navbar from "./Components/Navbar";
const AddFolder = lazy(() => import("./Pages/CreateFolder/AddFolder"));
import { Route, Routes } from "react-router-dom";
import SuspenseLoader from "./Components/Loaders/SuspenseLoader";
import ManageProfile from "./Pages/ManageProfile/ManageProfile";
import AllFolders from "./Pages/AllFolders/AllFolders";
import Login from "./Pages/Account/Login";
import Home from "./Pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Upload from "./Pages/UploadDocument/Upload";
import AllFiles from "./Pages/AllFiles/AllFiles";
import PdfViewer from "./Pages/AllFiles/PdfViewer";
import ViewFolder from "./Pages/User/ViewFolder";
import Signup from "./Pages/Account/Signup";
function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/admin/folder/add" element={<AddFolder />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/admin/profile/manage" element={<ManageProfile />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/admin/folders/view/all" element={<AllFolders />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/document/upload/:id" element={<Upload />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/files/all/:id" element={<AllFiles />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/file/single/:fileId" element={<PdfViewer />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/folder/view/:folderId" element={<ViewFolder />} />
        </Routes>
      </Suspense>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/admin/register" element={<Signup />} />
        </Routes>
      </Suspense>
      {/* <Uploader /> */}
    </>
  );
}

export default App;
