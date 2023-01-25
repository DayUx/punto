const mongoose = require("mongoose");
const gameSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  maxPlayers: {
    type: "number",
    required: true,
  },
  grid: {
    type: "array",
    required: true,
  },
  end: {
    type: "boolean",
    required: true,
  },
  aborted: {
    type: "boolean",
    required: true,
  },

  players: [
    {
      user_id: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      win: {
        type: "boolean",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("games", gameSchema);
