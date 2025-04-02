const Movie = require("../models/Movie");
const Comment = require("../models/Comment");
const User = require("../models/User");

const movieController = {
  //Create movie
  createMovies: async (req, res) => {
    try {
      const { moviename, releaseYear, description } = req.body;

      // Kiểm tra nếu thiếu dữ liệu
      if (!moviename || !releaseYear || !description) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp đầy đủ thông tin phim." });
      }

      // Tạo và lưu phim vào database
      const movie = await Movie.create({ moviename, releaseYear, description });

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
      const movie = await Movie.find();
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET MOVIE
  getlMovie: async (req, res) => {
    try {
      const { movieId } = req.params;

      const movie = await Movie.findById(movieId);
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update A Movie
  updateMovie: async (req, res) => {
    try {
      await Movie.findByIdAndUpdate(req.params.movieId);
      res.status(200).json("Movie update");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A MOVIE
  deleteMovie: async (req, res) => {
    try {
      await Movie.findByIdAndDelete(req.params.movieId);
      res.status(200).json("Movie deleted");
    } catch (err) {
      res.status(500).json(err);
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
    // const userId = req.user.id; // Lấy từ middleware xác thực
    const userId = "671e06a403f217cff6d8fff5";
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

      // Xóa comment
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json({ message: "Đã xóa comment thành công." });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },
};

module.exports = movieController;
