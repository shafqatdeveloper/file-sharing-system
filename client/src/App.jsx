import React, { Suspense, lazy } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import SuspenseLoader from "./Components/Loaders/SuspenseLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pdfjs } from "react-pdf";
import NotFound from "./Pages/NotFound/404";
import TopLoadingBar from "./Components/Loaders/TopLoadingBar";

const Home = lazy(() => import("../src/Pages/Home/Home"));
const Pricing = lazy(() => import("../src/Pages/Pricing/Pricing"));

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  return (
    <div className="bg-white">
      <Navbar />
      <TopLoadingBar />
      <ToastContainer />
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
