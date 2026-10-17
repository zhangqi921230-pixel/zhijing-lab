import React from "react";
export default function Button({
  children,
  icon: Icon,
  onClick,
  primary = false,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`btn ${primary ? "primary" : ""} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {Icon && <Icon size={17} />}
      <span className="lab-button-label">{children}</span>
    </button>
  );
}
