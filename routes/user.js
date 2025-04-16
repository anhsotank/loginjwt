const userController = require("../controllers/userControllers");

const {
  verifyToken,
  verifyTokenAndAdmin,
  upload,
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
router.post(
  "/addfavorite/:movieId",
  verifyToken,
  userController.addfavoriteMovie
);
router.get("/favorite", verifyToken, userController.getfavoriteMovie);
router.delete(
  "/deletefavorite/:movieId",
  verifyToken,
  userController.deletefavoriteMovie
);

module.exports = router;
