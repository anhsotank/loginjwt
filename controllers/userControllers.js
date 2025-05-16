const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find().select("-password");
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
  //Get Frofile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Lỗi lấy profile", error: err.message });
    }
  },

  //Update Frofile
  updateProfile: async (req, res) => {
    try {
      const { username, email } = req.body;

      let updateData = { username, email };

      // Nếu người dùng có upload ảnh mới
      if (req.file) {
        updateData.image = req.file.filename;

        // Xoá ảnh cũ nếu cần (nếu bạn lưu tên ảnh cũ trong DB)
        const user = await User.findById(req.user.id);
        if (user.image) {
          const oldImagePath = path.join(__dirname, "../uploads/", user.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Xoá ảnh cũ
          }
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      res.status(200).json(updatedUser);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Cập nhật thất bại", error: err.message });
    }
  },

  // // update avata
  // updateAvatar: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.user.id);

  //     // Xóa ảnh cũ nếu có
  //     if (user.avatar) {
  //       const oldPath = path.join(__dirname, "../uploads", user.avatar);
  //       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  //     }

  //     // Lưu ảnh mới
  //     user.avatar = req.file.filename;
  //     await user.save();

  //     res.status(200).json({ avatar: user.avatar });
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ message: "Lỗi cập nhật ảnh đại diện", error: err.message });
  //   }
  // },

  //update password
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Đổi mật khẩu thất bại", error: err.message });
    }
  },
  //FAVORITES MOVIE
  addfavoriteMovie: async (req, res) => {
    const { movieId } = req.params;
    const userId = req.user.id; // Lấy từ middleware xác thực

    try {
      const user = await User.findById(userId).select("-password");
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
