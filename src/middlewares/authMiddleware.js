const jwt = require("jsonwebtoken");
const { generateJSONResponse } = require("../utils/utils");

exports.verifyAuthToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const secret = process.env.JWT_SECRET_KEY;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          statusCode: 403,
          message: "Invalid token",
          data: null,
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      statusCode: 403,
      message: "Unauthorized",
      data: null,
    });
  }
};
