const movieController = require("../controllers/movieControllers");
const {
  verifyToken,
  verifyTokenAndAdmin,
  upload,
} = require("../controllers/verifyToken");
const router = require("express").Router();

//search
router.get("/search", movieController.searchMovie);
//////movie
router.get("/", movieController.getAllMovie);
router.get("/:movieId", movieController.getlMovie);
router.post(
  "/createmovie",
  upload.single("image"),
  verifyToken,
  movieController.createMovies
);

router.delete("/deletemovie/:movieId", movieController.deleteMovie);
router.put(
  "/updatemovie/:movieId",
  upload.single("image"),
  verifyToken,
  movieController.updateMovie
);
//view movie
router.put("/:movieId/view", movieController.addViewCount);
//get top 5 movie
router.get("/top/viewed", movieController.getTopViewedMovies);
//comment
router.post(
  "/:movieId/createcomments",
  verifyToken,
  movieController.createcommentMovie
);
router.get("/:movieId/comments", movieController.getcommentMovie);
router.delete(
  "/comments/:commentId",
  verifyToken,
  movieController.deletecommentMovie
);

router.put(
  "/:commentId/updatecomments",
  verifyToken,
  movieController.updateComment
);

module.exports = router;
