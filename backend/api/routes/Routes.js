const {
  login,
  register,
  newGame,
  joinGame,
  getGames,
  getHistorique,
  getBestAndWorst,
} = require("../controller/Controller");
const router = require("express").Router();
router.post("/register", register);
router.post("/login", login);
router.post("/newGame", newGame);
router.post("/joinGame", joinGame);
router.get("/historique", getHistorique);
router.post("/getGames", getGames);
router.get("/getBestAndWorst", getBestAndWorst);

module.exports = router;
