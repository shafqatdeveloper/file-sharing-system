// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/Redux/Features/Auth/AuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
