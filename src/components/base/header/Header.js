import "./Header.css";
import Logo from "../logo/Logo";
import Button from "../button/Button";
import { Route, Routes, useNavigate } from "react-router-dom";
import IconButton from "../button/IconButton";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import toast from "react-hot-toast";

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
                  <Button
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    Accueil
                  </Button>
                </li>
                <li>
                  <Button> Scores </Button>
                </li>
                <li>
                  <Button> Aide </Button>
                </li>
                <li>
                  <IconButton
                    color={"#f00"}
                    onClick={() => {
                      localStorage.removeItem("user");
                      navigate("/login");
                      toast.success("You successfully log off");
                    }}
                  >
                    <MdOutlinePowerSettingsNew
                      size={20}
                    ></MdOutlinePowerSettingsNew>
                  </IconButton>
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
