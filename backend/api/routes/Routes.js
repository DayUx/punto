const {
  login,
  register,
  newGame,
  joinGame,
  getGames,
  getHistorique,
  getStatistics,
} = require("../controller/Controller");
const router = require("express").Router();
router.post("/register", register);
router.post("/login", login);
router.post("/newGame", newGame);
router.post("/joinGame", joinGame);
router.get("/historique", getHistorique);
router.get("/statistiques", getStatistics);
router.post("/getGames", getGames);

module.exports = router;
