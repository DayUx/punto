import "./Register.css";
import Button from "../../base/button/Button";
const Register = () => {
  return (
    <div className="register">
      <form className={"form"}>
        <label htmlFor="email">Adresse Email</label>
        <input type="text" id="email" name="email" />
        <label htmlFor="username">Nom d'utilisateur</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" name="password" />
        <label htmlFor="password-confirm">Confirmer le mot de passe</label>
        <input type="password" id="password-confirm" name="password-confirm" />
        <Button color={"var(--bleu)"} type="submit">
          S'inscrire
        </Button>
      </form>
    </div>
  );
};

export default Register;
