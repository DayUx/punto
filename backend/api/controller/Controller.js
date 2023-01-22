module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    res.json({ message: "ok" }).status(200);
  } catch (e) {
    next(e);
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    console.log(req.body);
    res.json({ message: "ok" }).status(200);
  } catch (e) {
    next(e);
  }
};
