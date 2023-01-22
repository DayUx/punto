import "./LogIn.css";
import Button from "../../base/button/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { APIRoutes } from "../../../utils/APIRoutes";
import { useState } from "react";
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
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss(loading);
        toast.success("You are now logged in");
        navigate("/");
        console.log(data);
      })
      .catch((err) => {
        toast.dismiss(loading);
        console.log(err);
      });
  };

  return (
    <div className="login">
      <form className={"form"} onSubmit={handleSubmit}>
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
