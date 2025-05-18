const User = require("../models/User");
const OTP = require("../models/OTP");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//send OTP

exports.sendOTP = async (req, res) => {
  try {
    //step1 --> Extract/fetch email from body
    const { email } = req.body;

    //step2--> Check if User already Exists

    const CheckUser = await User.findOne({ email });

    //if user already exist return a response to sign in

    if (CheckUser) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //step3 --> Generate Otp

    var otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("generated Otp is:", otp);

    //check if otp is unique or not

    let result = await OTP.findOne({ otp: otp });

    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = OtpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //step4 --> Store otp in database to match after user enter it in UI

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "some error occured while genrating otp",
    });
  }
};

//signup function

exports.signup = async (req, res) => {
  try {
    //data fetch from req ki body

    const { firstName, lastName, email, password, confirmPassword, otp } =
      req.body;

    //validate krlo

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password match krlo

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password DO not match",
      });
    }
    //check user already exist or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exists,Please sign in to continue",
      });
    }

    //find most recent otp

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    console.log(response);

    //validate otp

    if (!response || response.length === 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "OTP NOT FOUND ENTER A VALID OTP",
      });
    } else if (otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,

      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg/${firstName} ${lastName}`, //name initials image
    });

    //return res

    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered please try again",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //get data

    const { email, password } = req.body;

    //validate
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all the details",
      });
    }
    //user check if exist or not

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User do not exist please signup first",
      });
    }
    //generate JWT after password match

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password do not match",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot lagin please try again",
    });
  }
};
