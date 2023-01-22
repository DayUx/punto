import "./LogIn.css";
import Button from "../../base/button/Button";
const LogIn = () => {
  return (
    <div className="login">
      <form className={"form"}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" name="password" />
        <Button color={"var(--bleu)"} type="submit">
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default LogIn;
