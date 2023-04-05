const Debug = function () {
  const args = arguments;
  global.io.sockets.emit("debug", args);
};
module.exports = Debug;
