import React from "react";
import { useLocation } from "react-router-dom";
import { parseQuery } from "../../Components/QueryFinder";
import DevelopmentPage from "../Development/PageUnderDev";

const AllTemplates = () => {
  const location = useLocation();
  const queryParams = parseQuery(location.search);
  const folderId = queryParams.folder;
  return (
    <div>
      <DevelopmentPage />
    </div>
  );
};

export default AllTemplates;
