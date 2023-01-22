const { login, register } = require("../controller/Controller");
const router = require("express").Router();
router.post("/register", register);
router.post("/login", login);
router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
