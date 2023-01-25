import logo from "./logo.svg";
import "./App.css";
import Card from "./components/game/card/Card";
import Grid from "./components/game/grid/Grid";
import Button from "./components/base/button/Button";
import Header from "./components/base/header/Header";
import {
  Route,
  Routes,
  useNavigate,
  RedirectFunction,
  Navigate,
} from "react-router-dom";
import LogIn from "./components/page/login/LogIn";
import Register from "./components/page/register/Register";
import { createRef, useEffect, useState } from "react";
import Loader from "./components/base/loader/Loader";
import { Toaster } from "react-hot-toast";
import Music from "./components/base/music/Music";
import Home from "./components/page/home/Home";
import Wait from "./components/page/wait/Wait";
import Game from "./components/page/game/Game";

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
      <Music> </Music>
      <Routes>
        <Route path={"/login"} element={<LogIn></LogIn>} />
        <Route path={"/register"} element={<Register></Register>} />
        <Route path={"/home"} element={<Home></Home>} />
        <Route path={"/wait"} element={<Wait></Wait>} />
        <Route path={"/game"} element={<Game></Game>} />
        <Route path={"/*"} element={<Navigate to={"/home"} />} />
      </Routes>
    </div>
  );
}

export default App;
