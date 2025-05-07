const Movie = require("../models/Movie");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Genre = require("../models/Genre");
const fs = require("fs");
const path = require("path");

const movieController = {
  //Create movie
  createMovies: async (req, res) => {
    try {
      const { moviename, releaseYear, description, srcVideo, genre, actors } =
        req.body;

      // Kiểm tra nếu thiếu dữ liệu
      if (!moviename || !releaseYear || !description) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp đầy đủ thông tin phim." });
      }
      const imageUrl = req.file ? `${req.file.filename}` : "";

      // Tạo và lưu phim vào database

      const movie = await Movie.create({
        moviename,
        releaseYear,
        description,
        srcVideo,
        genre,
        actors,
        image: imageUrl,
      });
      return res.status(201).json({ message: "Thêm phim thành công", movie });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  //GET ALL
  getAllMovie: async (req, res) => {
    try {
      console.log("Received search request for:");
      const movie = await Movie.find()
        .populate("genre", "name")
        .sort({ createdAt: -1 });
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET MOVIE
  getlMovie: async (req, res) => {
    try {
      const { movieId } = req.params;

      const movie = await Movie.findById(movieId).populate("genre", "name"); // Lấy thông tin user;
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update A Movie

  updateMovie: async (req, res) => {
    const updates = req.body;
    if (req.file) {
      updates.image = req.file.filename; // cập nhật ảnh mới
    }
    try {
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) return res.status(404).json("Phim không tồn tại!");

      // Nếu có ảnh mới => xóa ảnh cũ
      if (req.file && movie.image) {
        const oldPath = path.join(__dirname, "../uploads/", movie.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.movieId,
        updates, // <-- dữ liệu cần cập nhật
        { new: true } // <-- để trả về bản ghi đã cập nhật
      );
      res
        .status(200)
        .json({ message: "Cập nhật phim thành công", movie: updatedMovie });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  //DELETE A MOVIE
  deleteMovie: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.movieId);

      if (!movie) return res.status(404).json("Phim không tồn tại!");

      // Xóa file ảnh nếu tồn tại
      if (movie.image) {
        const filePath = path.join(__dirname, "../uploads/", movie.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Xóa file
        }
      }
      await Movie.findByIdAndDelete(req.params.movieId);

      res.status(200).json("Movie deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //view movie
  addViewCount: async (req, res) => {
    try {
      const { movieId } = req.params;

      const movie = await Movie.findByIdAndUpdate(
        movieId,
        { $inc: { views: 1 } }, // tăng 1 lượt xem
        { new: true }
      );

      if (!movie) {
        return res.status(404).json({ message: "Không tìm thấy phim." });
      }

      res.status(200).json({ message: "Tăng lượt xem", views: movie.views });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  //  lấy top 5 phim được xem nhiều nhất
  getTopViewedMovies: async (req, res) => {
    try {
      const movies = await Movie.find().sort({ views: -1 }).limit(5);
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  //SEACH MOVIE
  searchMovie: async (req, res) => {
    const { moviename } = req.query;
    console.log("Received search request for:", moviename); // Log đầu vào

    if (!moviename || !moviename.trim()) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    try {
      console.log("Searching in database...");

      const movies = await Movie.find({
        moviename: { $regex: new RegExp(moviename, "i") },
      });

      console.log("Found movies:", movies); // Log kết quả truy vấn

      if (movies.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy phim" });
      }

      res.status(200).json(movies);
    } catch (err) {
      console.error("Lỗi khi tìm phim:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  // COMMENT MOVIE
  createcommentMovie: async (req, res) => {
    const { movieId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Lấy từ middleware xác thực
    // const userId = "671e06a403f217cff6d8fff5";
    try {
      const comment = new Comment({ user: userId, movie: movieId, text });
      await comment.save();

      await Movie.findByIdAndUpdate(movieId, {
        $push: { comments: comment._id },
      });

      res.status(201).json({ message: "Bình luận thành công", comment });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  getcommentMovie: async (req, res) => {
    try {
      const { movieId } = req.params;

      // Tìm tất cả bình luận của bộ phim
      const comments = await Comment.find({ movie: movieId })
        .populate("user", "username email") // Lấy thông tin user
        .sort({ createdAt: -1 }); // Sắp xếp comment mới nhất lên đầu

      return res.status(200).json({ movieId, comments });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  deletecommentMovie: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id; // Lấy ID user từ middleware xác thực

      // Tìm comment trong database
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Không tìm thấy comment." });
      }

      // Kiểm tra nếu comment không phải của user hiện tại
      if (comment.user.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xóa comment này." });
      }

      const movieId = comment.movie; // Giả sử comment có trường 'movie'

      // Xóa comment
      await Comment.findByIdAndDelete(commentId);

      // Xóa commentId khỏi mảng comments trong Movie
      const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        { $pull: { comments: commentId } },
        { new: true }
      );

      if (!updatedMovie) {
        return res.status(404).json({ message: "Không tìm thấy phim." });
      }

      return res.status(200).json({ message: "Đã xóa comment thành công." });
    } catch (err) {
      return res.status(500).json({
        message: "Lỗi server",
        error: err.message,
      });
    }
  },

  updateComment: async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Lấy ID user từ middleware xác thực

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Không tìm thấy comment" });
      }

      // Chỉ cho phép người đã viết comment mới được sửa
      if (comment.user.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền sửa comment này" });
      }

      comment.text = req.body.text;
      await comment.save();

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },
};

module.exports = movieController;
