import "./Header.css";
import Logo from "../logo/Logo";
import Button from "../button/Button";
import { Route, Routes, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className={"header"}>
      <div className={"logo"}>
        <Logo />
      </div>
      <nav className={"nav"}>
        <Routes>
          <Route
            path={"/login"}
            element={
              <ul>
                <li>
                  <Button
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    S'inscrire
                  </Button>
                </li>
              </ul>
            }
          ></Route>
          <Route
            path={"/register"}
            element={
              <ul>
                <li>
                  <Button
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Se connecter
                  </Button>
                </li>
              </ul>
            }
          ></Route>
          <Route
            path={"/*"}
            element={
              <ul>
                <li>
                  <Button> Nouvelle partie </Button>
                </li>
                <li>
                  <Button> Scores </Button>
                </li>
                <li>
                  <Button> Aide </Button>
                </li>
              </ul>
            }
          ></Route>
        </Routes>
      </nav>
    </header>
  );
};

export default Header;
