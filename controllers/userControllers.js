const User = require("../models/User");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //FAVORITES MOVIE
  favoriteMovie: async (req, res) => {
    const { movieId } = req.params;
    const userId = req.user.id; // Lấy từ middleware xác thực

    try {
      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      if (!user.favoriteMovies.includes(movieId)) {
        user.favoriteMovies.push(movieId);
        await user.save();
      }

      res
        .status(200)
        .json({ message: "Đã thêm vào danh sách yêu thích", user });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  getfavoriteMovie: async (req, res) => {
    try {
      const userId = req.user.id; // Lấy từ middleware xác thực

      // Tìm user và lấy danh sách phim yêu thích
      const user = await User.findById(userId).populate("favoriteMovies");

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }

      return res.status(200).json({
        message: "Danh sách phim yêu thích.",
        favoriteMovies: user.favoriteMovies,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },
  deletefavoriteMovie: async (req, res) => {
    try {
      const userId = req.user.id; // Lấy từ middleware xác thực
      const { movieId } = req.params;

      // Tìm user và xóa movieId khỏi danh sách yêu thích
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { favoriteMovies: movieId } }, // Xóa movieId khỏi mảng
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }

      return res.status(200).json({
        message: "Xóa phim khỏi danh sách yêu thích thành công.",
        favoriteMovies: updatedUser.favoriteMovies,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },
};

module.exports = userController;
