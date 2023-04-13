import { useEffect, useState } from "react";
import { APIRoutes } from "../../../utils/APIRoutes"; // Import des routes pour l'API
import "./Historique.css";
import toast from "react-hot-toast"; // Librairie pour afficher des messages toast

const Historique = () => {
  const [games, setGames] = useState([]); // State pour stocker les parties
  const [user, setUser] = useState([]); // State pour stocker l'utilisateur courant

  // Fonction pour décoder le token JWT et récupérer l'objet utilisateur
  const wt_decode = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  // Effect hook pour récupérer les parties de l'utilisateur courant
  useEffect(() => {
    toast.loading("Chargement..."); // Affichage d'un message toast de chargement
    setUser(wt_decode(localStorage.getItem("user"))); // Stockage de l'utilisateur courant dans le state
    fetch(APIRoutes.getHistorique, {
      // Appel à l'API pour récupérer l'historique de l'utilisateur courant
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("user"), // Envoi du token JWT dans les headers de la requête
      },
    })
      .then((res) => res.json())
      .then((res) => {
        toast.dismiss(); // Suppression du message toast de chargement
        setGames(res.games); // Stockage des parties dans le state
      });
  }, []); // La dépendance est vide, donc le hook ne s'exécutera qu'une seule fois

  return (
    <div className={"Historique"}>
      <div className={"glowingBorder stats"}>
        Parties jouées : {games.length}
        <span>
          Parties gagnées :{" "}
          {
            games.filter(
              (game) =>
                game.players.find((player) => player.win === true).user_id ===
                user.id
            ).length
          }
        </span>
        <span>
          Ratio de victoire :{" "}
          {(
            (games.filter(
              (game) =>
                game.players.find((player) => player.win === true).user_id ===
                user.id
            ).length /
              games.length) *
            100
          ).toFixed(2)}
          %
        </span>
      </div>
      <div className={"glowingBorder historique-container"}>
        <div className={"content"}>
          {games.map((game, index) => (
            <div
              className={`row ${index % 2 === 0 ? "opaque" : ""}`}
              key={index}
            >
              {game.players.find((player) => player.win === true).user_id ===
              user.id ? (
                <p style={{ color: "green" }}>gagné</p>
              ) : (
                <p style={{ color: "red" }}>perdu</p>
              )}
              <h2>{game.name}</h2>

              <p>{new Date(game.date)?.toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Historique;
