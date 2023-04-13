import "./App.css";
import Header from "./components/base/header/Header";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LogIn from "./components/page/login/LogIn";
import Register from "./components/page/register/Register";
import { createRef, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./components/page/home/Home";
import Wait from "./components/page/wait/Wait";
import Game from "./components/page/game/Game";
import Historique from "./components/page/historique/Historique";

function App() {
  const navigate = useNavigate();
  const ref = createRef();
  const refLoader = createRef();

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, []);

  return (
    <div className="App">
      <Toaster />
      <Header />
      <Routes>
        <Route path={"/login"} element={<LogIn></LogIn>} />
        <Route path={"/register"} element={<Register></Register>} />
        <Route path={"/home"} element={<Home></Home>} />
        <Route path={"/historique"} element={<Historique></Historique>} />
        <Route path={"/wait"} element={<Wait></Wait>} />
        <Route path={"/game"} element={<Game></Game>} />
        <Route path={"/*"} element={<Navigate to={"/home"} />} />
      </Routes>
    </div>
  );
}

export default App;
