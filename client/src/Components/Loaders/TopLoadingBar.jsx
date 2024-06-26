// LoadingBar.js
import React, { useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { useLocation, useNavigationType } from "react-router-dom";

const TopLoadingBar = () => {
  const ref = useRef(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    ref.current.continuousStart();

    // Simulate a delay for loading
    setTimeout(() => {
      ref.current.complete();
    }, 500);
  }, [location, navigationType]);

  return <LoadingBar color="#67C22A" height={3} ref={ref} />;
};

export default TopLoadingBar;
