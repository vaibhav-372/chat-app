import React from "react";

const Toast = ({ showToast, message, toastType, closeToast }) => {
  if (!showToast) return null;

  return (
    <div
      className={`max-w-xs border rounded-lg shadow-lg fixed top-4 right-4 z-50 ${
        toastType === "success"
          ? "bg-green-100 border-green-200 text-green-800"
          : "bg-red-100 border-red-200 text-red-800"
      }`}
      role="alert"
    >
      <div className="flex p-4">
        <div>{message}</div>
        <div className="ml-auto">
          <button
            type="button"
            className="inline-flex justify-center items-center w-5 h-5 rounded-full text-gray-800 hover:opacity-100 focus:outline-none"
            onClick={closeToast}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
