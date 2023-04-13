import { useRef } from "react";
import "./Loading.css";

const Loading = ({ text }) => {
  const ref = useRef();
  return (
    <div
      style={{
        visibility: text ? "visible" : "hidden",
      }}
      className="loading"
    >
      <div ref={ref} className="loading-content">
        {text}
      </div>
    </div>
  );
};

export default Loading;
