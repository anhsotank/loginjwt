const Actor = require("../models/Actor");
const Movie = require("../models/Movie");

const ActorController = {
  //Get Actor
  getActor: async (req, res) => {
    try {
      const Actors = await Actor.find();
      res.status(200).json(Actors);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   getMoviesByActor: async (req, res) => {
  //     try {
  //       const { ActorId } = req.params;

  //       const listmovie = await Movie.find({ Actor: ActorId }).sort({
  //         createdAt: -1,
  //       }); // Sắp xếp Movie mới nhất lên đầu
  //       const Actorsname = await Actor.find({ _id: ActorId });
  //       return res.status(200).json({ Actorsname, listmovie });
  //     } catch (err) {
  //       return res
  //         .status(500)
  //         .json({ message: "Lỗi server", error: err.message });
  //     }
  //   },

  //add Actor
  addActor: async (req, res) => {
    try {
      const { name, bio } = req.body;
      const imageUrl = req.file ? `${req.file.filename}` : "";

      const actor = await Actor.create({
        name,
        image: imageUrl,
        bio,
      });
      res.status(200).json(actor);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update Actor
  updateActor: async (req, res) => {
    try {
      const updates = req.body;
      const updatedActor = await Actor.findByIdAndUpdate(
        req.params.actorId,
        updates,
        { new: true }
      );
      res.status(200).json(updatedActor);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //  remove Actor
  deleteActor: async (req, res) => {
    try {
      await Movie.updateMany(
        { actor: req.params.actorId },
        { $unset: { Actor: "" } }
      );
      await Actor.findByIdAndDelete(req.params.actorId);
      res.status(200).json("Xóa thể loại thành công!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = ActorController;
