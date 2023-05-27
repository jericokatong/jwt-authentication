const User = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");

const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.json({ msg: "tidak ada refresh token pada cookies" });

  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) return res.json({ msg: "refresh token yang dikirim tidak cocok" });

  try {
    const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) return res.json({ msg: "refresh token anda tidak valid" });

    const userId = decoded.id;
    const name = decoded.name;
    const email = decoded.email;

    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = RefreshToken;
