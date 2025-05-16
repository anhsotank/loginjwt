const Actor = require("../models/Actor");
const Movie = require("../models/Movie");
const path = require("path");
const fs = require("fs");

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
      const { name, bio, image: oldImage } = req.body;
      let newImage = oldImage;

      if (req.file) {
        if (oldImage) {
          const oldPath = path.join(__dirname, "../uploads/", oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        newImage = req.file.filename;
      }

      const updatedActor = await Actor.findByIdAndUpdate(
        req.params.actorId,
        {
          name,
          bio,
          image: newImage,
        },
        { new: true }
      );

      res.status(200).json(updatedActor);
    } catch (err) {
      res.status(500).json({ error: "Cập nhật thất bại", detail: err.message });
    }
  },

  //  remove Actor
  deleteActor: async (req, res) => {
    try {
      const actorId = req.params.actorId;

      const actor = await Actor.findById(actorId);
      if (!actor) return res.status(404).json("Không tìm thấy diễn viên!");

      // Xóa file ảnh nếu có
      if (actor.image) {
        const filePath = path.join(__dirname, "../uploads/", actor.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Xóa diễn viên khỏi tất cả các phim chứa actorId trong mảng actors
      await Movie.updateMany(
        { actors: actorId },
        { $pull: { actors: actorId } }
      );

      // Xóa diễn viên khỏi bảng Actor
      await Actor.findByIdAndDelete(actorId);

      res.status(200).json("Xóa diễn viên và cập nhật phim thành công!");
    } catch (err) {
      res.status(500).json({ error: "Xóa thất bại", detail: err.message });
    }
  },
};

module.exports = ActorController;
