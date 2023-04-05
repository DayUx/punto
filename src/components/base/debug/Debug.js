import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { APIRoutes } from "../../../utils/APIRoutes";

const Debug = () => {
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  const ref = useRef();

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    socket.current = io(APIRoutes.host);
    socket.current.on("debug", (data) => {
      console.log(data);
      let message = "";
      for (const datum of Object.values(data)) {
        message += datum + ":";
      }
      console.log(message);
      setMessages([...messages, message]);
    });
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        background: "rgba(52,52,52,0.2)",
        color: "#0f0",
        display: "flex",
        flexDirection: "column",
        height: 300,
        width: 300,
        overflowY: "scroll",
        padding: 5,
        gap: 10,
        top: 0,
        left: 0,
      }}
    >
      {messages.map((message, index) => {
        return (
          <span
            style={{
              width: "100%",
              overflowWrap: "break-word",
              textAlign: "left",
            }}
          >
            {message}
          </span>
        );
      })}
    </div>
  );
};

export default Debug;
