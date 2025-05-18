//auth middleware

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //get tokens from header or cookies

    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    //if token is missing

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    //verify token

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      //store token attach user info to request object
      req.user = decode;
    } catch (error) {
      //if verification error comes
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while validating the token",
    });
  }
};
