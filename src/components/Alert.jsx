import React, { useEffect } from "react";
import "./alert.css";

const Alert = ({ alertContent, closeAlert = () => {} }) => {
  const alertClass = alertContent.includes("added")
    ? "added"
    : alertContent.includes("changed")
    ? "edited"
    : "removed";

    useEffect(() => {
      setTimeout(() => {
        closeAlert();
      }, 2000);
    });
  return (
    <div className={`alert ${alertClass}`}>
      <p>{alertContent} !!</p>
    </div>
  );
};

export default Alert;
