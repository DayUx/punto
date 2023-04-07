import "./LogIn.css";
import Button from "../../base/button/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { APIRoutes } from "../../../utils/APIRoutes";
import { useState } from "react";
import Grid from "../../game/grid/Grid";
import Card from "../../game/card/Card";
const LogIn = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    password: "",
    username: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFields((fields) => ({
      ...fields,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loading = toast.loading("Loading...");

    fetch(APIRoutes.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }).then((res) => {
      const ok = res.ok;
      res.json().then((json) => {
        if (ok) {
          toast.dismiss(loading);
          toast.success("You are now logged in");
          localStorage.setItem("user", json.user);
          navigate("/");
        } else {
          toast.dismiss(loading);
          toast.error(json.message);
        }
      });
    });
  };

  return (
    <div className="login">
      <form className={"form glowingBorder"} onSubmit={handleSubmit}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={changeHandler}
          value={fields.username}
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={changeHandler}
          value={fields.password}
        />
        <Button color={"var(--bleu)"} type="submit">
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default LogIn;
