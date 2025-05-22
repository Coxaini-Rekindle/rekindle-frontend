import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <ToastContainer
        closeOnClick
        draggable
        newestOnTop
        pauseOnFocusLoss
        pauseOnHover
        autoClose={5000}
        hideProgressBar={false}
        position="top-right"
        rtl={false}
        theme="dark" // You can set this to "dark" for dark mode support
      />
    </>
  );
};

export default ToastProvider;
