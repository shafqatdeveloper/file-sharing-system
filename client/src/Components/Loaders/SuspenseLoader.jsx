import React from "react";
import "./SuspenceLoader.css";

const SuspenseLoader = () => {
  return (
    <div className="suspense-loader h-[80vh] w-full">
      <div className="justify-content-center jimu-primary-loading"></div>
    </div>
  );
};

export default SuspenseLoader;
