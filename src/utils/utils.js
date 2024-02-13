exports.generateJSONResponse = (res, statusCode, message, data = null) => {
  return res.json({
    statusCode,
    message,
    data,
  });
};

exports.generateAuthToken = (jwt, payload, secret) => {
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};
