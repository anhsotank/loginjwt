const MovieReaction = require("../models/MovieReaction");

const movieReactionControllers = {
  reactToMovie: async (req, res) => {
    const { id: movieId } = req.params;
    const userId = req.user.id;
    const { reaction } = req.body; // "like" or "dislike"

    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({ message: "Phản ứng không hợp lệ" });
    }

    try {
      const existing = await MovieReaction.findOne({ userId, movieId });

      if (existing) {
        if (existing.reaction === reaction) {
          // Nếu đã phản ứng giống => bỏ phản ứng
          await existing.deleteOne();
          return res.status(200).json({ message: "Đã hủy phản ứng" });
        } else {
          // Đổi phản ứng
          existing.reaction = reaction;
          await existing.save();
          return res.status(200).json({ message: "Đã đổi phản ứng" });
        }
      }

      // Thêm phản ứng mới
      await MovieReaction.create({ userId, movieId, reaction });
      return res.status(200).json({ message: "Phản ứng thành công" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi phản ứng", error: err.message });
    }
  },

  getMovieReactions: async (req, res) => {
    const { id: movieId } = req.params;

    try {
      const likes = await MovieReaction.countDocuments({
        movieId,
        reaction: "like",
      });
      const dislikes = await MovieReaction.countDocuments({
        movieId,
        reaction: "dislike",
      });

      res.status(200).json({ likes, dislikes });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy lượt thích", error: err.message });
    }
  },
};

module.exports = movieReactionControllers;
