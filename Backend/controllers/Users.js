const HttpError = require("../models/Http-Error");
const User = require("../models/User");
const validator = require("express-validator");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let existingUsers;
  try {
    existingUsers = await User.find({}, "-password -__v");
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not find users: ${err}`,
      500
    );
    return next(error);
  }
  res.status(200).json({ users: existingUsers });
};

const signup = async (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(JSON.stringify(errors.array()), 422));
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Signup failed: ${err}`,
      500
    );
    return next(error);
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, Please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Signing up failed: ${err}`,
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Signing up failed: ${err}`,
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdUser._id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Unable to login: ${err}`,
      500
    );
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials, Could not logged you in.", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not logged you in, Please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, Could not logged you in.", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, logging failed: ${err}`,
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({
      userId: existingUser._id,
      email: existingUser.email,
      token: token,
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
