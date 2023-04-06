import "./IconButton.css";
import { useState } from "react";

const IconButton = ({ children, onClick, className, disabled, color }) => {
  const style = {
    backgroundColor: color,
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`iconButton ${className} ${isHovered ? "hover" : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        "--buttonBorderColor": color,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default IconButton;
