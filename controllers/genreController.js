const Genre = require("../models/Genre");
const Movie = require("../models/Movie");

const genreController = {
  //Get genre
  getGenre: async (req, res) => {
    try {
      const genres = await Genre.find();
      res.status(200).json(genres);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getMoviesByGenre: async (req, res) => {
    try {
      const { genreId } = req.params;

      const listmovie = await Movie.find({ genre: genreId }).sort({
        createdAt: -1,
      }); // Sắp xếp Movie mới nhất lên đầu
      const genresname = await Genre.find({ _id: genreId });
      return res.status(200).json({ genresname, listmovie });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  //add genre
  addGenre: async (req, res) => {
    try {
      const newGenre = new Genre({ name: req.body.genrename });
      const savedGenre = await newGenre.save();

      res.status(200).json(savedGenre);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update genre
  updateGenre: async (req, res) => {
    try {
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.genreId,
        { name: req.body.genrename },
        { new: true }
      );
      res.status(200).json(updatedGenre);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //  remove genre
  deleteGenre: async (req, res) => {
    try {
      await Movie.updateMany(
        { genre: req.params.genreId },
        { $unset: { genre: "" } }
      );
      await Genre.findByIdAndDelete(req.params.genreId);
      res.status(200).json("Xóa thể loại thành công!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = genreController;
