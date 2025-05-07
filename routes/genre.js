const router = require("express").Router();
const Genre = require("../models/Genre");
const {
  verifyToken,
  verifyTokenAndAdmin,
  upload,
} = require("../controllers/verifyToken");
const genreController = require("../controllers/genreController");

// ✅ GET all genres
router.get("/", genreController.getGenre);
router.get("/:genreId", genreController.getMoviesByGenre);

router.post("/creategenre", verifyTokenAndAdmin, genreController.addGenre);

router.delete("/deletegenre/:genreId", genreController.deleteGenre);
router.put(
  "/updategenre/:genreId",
  verifyTokenAndAdmin,
  genreController.updateGenre
);

module.exports = router;
