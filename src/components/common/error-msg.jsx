import React from "react";


const ErrorMsg = ({ msg }) => {
  if (!msg) {
    return null;
  }
  return <div className="aura-form-error">{msg}</div>;
};

export default ErrorMsg;
