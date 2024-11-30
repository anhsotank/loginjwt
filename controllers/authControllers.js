const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();
      // await user.collection.dropIndex("username");
      // await user.collection.dropIndex("email");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LOGIN WITH FACEBOOK
  loginWithFacebook: async (req, res) => {
    const { accessToken } = req.body;

    try {
      // Gửi yêu cầu xác thực tới Facebook API
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
      );

      const { id, name, email, picture } = response.data;

      // Tìm kiếm người dùng theo Facebook ID hoặc tạo mới
      let user = await User.findOne({ facebookId: id });
      if (!user) {
        user = new User({
          facebookId: id,
          username: name,
          email: email || "", // Email có thể không được cung cấp
          avatar: picture?.data?.url || "", // Lấy ảnh đại diện từ Facebook
        });
        await user.save();
      }

      // Tạo Access Token cho người dùng
      const accessToken = authController.generateAccessToken(user);

      res.status(200).json({
        message: "Login with Facebook successful",
        user,
        accessToken,
      });
    } catch (error) {
      console.error("Facebook Login Error:", error);
      res.status(500).json({ message: "Failed to login with Facebook" });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Incorrect password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        res.status(200).json({ user, accessToken });
        // //Generate access token

        // //Generate refresh token
        // const refreshToken = authController.generateRefreshToken(user);
        // refreshTokens.push(refreshToken);
        // //STORE REFRESH TOKEN IN COOKIE
        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   path: "/",
        //   sameSite: "strict",
        // });
        // const { password, ...others } = user._doc;
        // res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  //LOG OUT
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
};

module.exports = authController;
