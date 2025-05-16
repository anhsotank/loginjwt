const router = require("express").Router();
const Actor = require("../models/Actor");
const {
  verifyToken,
  verifyTokenAndAdmin,
  upload,
} = require("../controllers/verifyToken");
const actorController = require("../controllers/actorControllers");

// ✅ GET all actors
router.get("/", actorController.getActor);
// router.get("/:actorId", actorController);

router.post(
  "/createactor",
  upload.single("image"),
  verifyTokenAndAdmin,
  actorController.addActor
);

router.delete("/deleteactor/:actorId", actorController.deleteActor);
router.put(
  "/updateactor/:actorId",
  verifyTokenAndAdmin,
  upload.single("image"),
  actorController.updateActor
);

module.exports = router;
