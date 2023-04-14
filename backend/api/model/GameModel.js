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
  date: {
    type: "date",
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

gameSchema.statics.getPlayerWithMostLosses = async function () {
  const result = await this.aggregate([
    { $unwind: "$players" },
    {
      $group: {
        _id: "$players.user_id",
        username: { $first: "$players.username" },
        totalLosses: { $sum: { $cond: ["$players.win", 0, 1] } },
      },
    },
    { $sort: { totalLosses: -1 } },
    { $limit: 1 },
  ]);
  return result[0];
};

gameSchema.statics.getPlayerWithMostWins = async function () {
  const result = await this.aggregate([
    { $unwind: "$players" },
    {
      $group: {
        _id: "$players.user_id",
        username: { $first: "$players.username" },
        totalWins: { $sum: { $cond: ["$players.win", 1, 0] } },
      },
    },
    { $sort: { totalWins: -1 } },
    { $limit: 1 },
  ]);
  return result[0];
};

module.exports = mongoose.model("games", gameSchema);
