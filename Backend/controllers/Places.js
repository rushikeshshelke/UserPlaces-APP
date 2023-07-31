const uuid = require("uuid");
const mongoose = require("mongoose");
const validator = require("express-validator");
const HttpError = require("../models/Http-Error");
const location = require("../util/location");
const Place = require("../models/Place");
const User = require("../models/User");
const fs = require("fs");

const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not find place: ${err}`,
      500
    );
    return next(error);
  }

  if (!place) {
    // return res.status(404).json({message: 'Could not find place for requested place id.'});
    // const error = new Error('Could not find place for requested place id.');
    // error.code = 404;
    return next(
      new HttpError("Could not find place for requested place id.", 404)
    );
  }

  res.json({ place });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ createdBy: userId });
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not find place: ${err}`,
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    // return res.status(404).json({message: 'Could not find place for requested user id.'});
    // const error = new Error('Could not find place for requested user id.');
    // error.code = 404;
    return next(
      new HttpError("Could not find place for requested user id.", 404)
    );
  }

  res.json({ places });
};
const createPlace = async (req, res, next) => {
  console.log(req.body);
  const errors = validator.validationResult(req);
  console.log(JSON.stringify(errors.array()));
  if (!errors.isEmpty()) {
    return next(new HttpError(JSON.stringify(errors.array()), 422));
  }

  const { title, description, address } = req.body;

  const coordinates = location.getCoordsForAddress();

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    createdBy: req.userData.userId,
  });

  console.log(createdPlace);

  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not create place ${err}`,
      500
    );
    return next(error);
  }

  if (!existingUser) {
    return next(new HttpError("User does not exist", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    existingUser.places.push(createdPlace._id);
    await existingUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Creating place failed: ${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  const errors = validator.validationResult(req);
  console.log(JSON.stringify(errors.array()));
  if (!errors.isEmpty()) {
    return next(new HttpError(JSON.stringify(errors.array()), 422));
  }
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not update place: ${err}`,
      500
    );
    return next(error);
  }

  if (place.createdBy !== req.userData.userId) {
    const error = new HttpError(
      "Unauthorized user, You are not allowed to edit!",
      403
    );
    return next(error);
  }

  if (Object.keys(place).length === 0) {
    return next(new HttpError("Could not find the place.", 404));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, Could not update place: ${err}`,
      500
    );
    return next(error);
  }

  res.status(200).json(place);
};

const deletePlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid).populate("createdBy");
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not delete place: ${err}`,
      500
    );
  }

  console.log(place);

  if (!place) {
    return next(new HttpError("Could not find the place.", 404));
  }

  if (place.createdBy._id !== req.userData.userId) {
    const error = new HttpError(
      "Unauthorized user, You are not allowed to delete!",
      403
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.createdBy.places.pull(place);
    await place.createdBy.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not delete place: ${err}`,
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(204).json();
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
