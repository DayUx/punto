const {
  login,
  register,
  newGame,
  joinGame,
  getGames,
} = require("../controller/Controller");
const router = require("express").Router();
router.post("/register", register);
router.post("/login", login);
router.post("/newGame", newGame);
router.post("/joinGame", joinGame);
router.post("/getGames", getGames);

module.exports = router;
