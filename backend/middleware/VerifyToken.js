const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(400);

  try {
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) return res.json({ msg: "harap login" });

    console.log("ini decode", decode);
    req.email = decode.email;

    next();
  } catch (error) {
    res.json({ msg: error.message });
  }
};

module.exports = VerifyToken;
