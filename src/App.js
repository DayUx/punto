import logo from "./logo.svg";
import "./App.css";
import Card from "./components/game/card/Card";
import Grid from "./components/game/grid/Grid";
import Button from "./components/base/button/Button";
import Header from "./components/base/header/Header";
import { Route, Routes, useNavigate } from "react-router-dom";
import LogIn from "./components/page/login/LogIn";
import Register from "./components/page/register/Register";
import { createRef } from "react";
import Loader from "./components/base/loader/Loader";

function App() {
  const navigate = useNavigate();
  const ref = createRef();
  const refLoader = createRef();

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route
          path={"/"}
          element={
            <>
              <Card ref={ref} color={"rouge"} id={"test"} value={1} />
              <Button
                onClick={
                  //call the function turnCard from Card.js
                  () => refLoader.current.load()
                }
              >
                Test loading screen
              </Button>
              <Grid size={6}> </Grid>
              <Loader ref={refLoader} />
            </>
          }
        ></Route>
        <Route path={"/login"} element={<LogIn></LogIn>} />
        <Route path={"/register"} element={<Register></Register>} />
      </Routes>
    </div>
  );
}

export default App;
