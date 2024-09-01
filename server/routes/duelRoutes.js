const express = require("express");
const {
  createDuel,
  acceptDuel,
  getDuels,
} = require("../controllers/duelController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, createDuel).get(protect, getDuels);
router.route("/:id/accept").put(protect, acceptDuel);

module.exports = router;
