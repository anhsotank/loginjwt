const userController = require("../controllers/userControllers");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", userController.getAllUsers);

//DELETE USER
router.delete(
  "/:id",
  verifyTokenAndUserAuthorization,
  userController.deleteUser
);

//favorite
router.post("/favorite/:movieId", verifyToken, userController.favoriteMovie);
router.get("/favorite", verifyToken, userController.getfavoriteMovie);
router.delete(
  "/favorite/:movieId",
  verifyToken,
  userController.deletefavoriteMovie
);

module.exports = router;
