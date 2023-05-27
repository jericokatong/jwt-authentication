const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "password dan confirm password tidak cocok" });

    const salt = await bcrypt.genSalt();

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return console.log(salt);

      // Store hash in your password DB.
      User.create({
        name: name,
        email: email,
        password: hash,
      });
      res.status(200).json({ msg: "Berhasil melakukan registrasi" });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(400).json({ msg: "email tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ msg: "password yang anda masukan itu salah!!" });

  const userId = user.id;
  const name = user.name;

  const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  await User.update(
    { refresh_token: refreshToken },
    {
      where: {
        id: userId,
      },
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ accessToken });
};

const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(400).json({ msg: "maaf tidak ada refresh token" });

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.status(400).json({ msg: "maaf user tidak ditemukan berdasarkan refresh token" });

    const userId = user.id;

    await User.update(
      {
        refresh_token: null,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    res.clearCookie("refreshToken");

    res.json({ msg: "Berhasil logout" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getUser, register, Login, Logout };
