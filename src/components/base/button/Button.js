import "./Button.css";
import { useState } from "react";

const Button = ({ children, onClick, className, disabled, color }) => {
  const style = {
    backgroundColor: color,
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`button ${className} ${isHovered ? "hover" : ""}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
