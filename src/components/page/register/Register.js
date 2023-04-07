import "./Register.css";
import Button from "../../base/button/Button";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { APIRoutes } from "../../../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
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

    fetch(APIRoutes.register, {
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
          toast.success("You are now registered and logged in");
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
    <div className="register">
      <form className={"form glowingBorder"} onSubmit={handleSubmit}>
        <label htmlFor="email">Adresse Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={fields.email}
          onChange={changeHandler}
        />
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          name="username"
          value={fields.username}
          onChange={changeHandler}
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={fields.password}
          onChange={changeHandler}
        />
        <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          value={fields.passwordConfirm}
          onChange={changeHandler}
        />
        <Button color={"var(--bleu)"} type="submit">
          S'inscrire
        </Button>
      </form>
    </div>
  );
};

export default Register;
