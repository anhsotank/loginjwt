const movieController = require("../controllers/movieControllers");
const { verifyToken } = require("../controllers/verifyToken");
const router = require("express").Router();

//search
router.get("/search", movieController.searchMovie);
//////movie
router.get("/", movieController.getAllMovie);
router.get("/:movieId", movieController.getlMovie);
router.post("/createmovie", movieController.createMovies);

router.delete("/deletemovie/:movieId", movieController.deleteMovie);
router.put("/updatemovie/:movieId", movieController.updateMovie);

//comment
router.post(
  "/:movieId/createcomments",
  verifyToken,
  movieController.createcommentMovie
);
router.get("/:movieId/comments", verifyToken, movieController.getcommentMovie);
router.delete(
  "/comments/:commentId",
  verifyToken,
  movieController.deletecommentMovie
);

module.exports = router;
