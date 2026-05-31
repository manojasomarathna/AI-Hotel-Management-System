import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Suppress CRA dev overlay for network errors
const origOnError = window.onerror;
window.onerror = function (msg, ...args) {
  if (typeof msg === "string" && (msg.includes("Network Error") || msg.includes("AxiosError"))) return true;
  return origOnError?.apply(this, [msg, ...args]);
};
window.addEventListener("unhandledrejection", (e) => {
  const msg = e.reason?.message || "";
  if (msg.includes("Network Error") || e.reason?.code === "ERR_NETWORK") {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
