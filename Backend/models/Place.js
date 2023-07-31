const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  _id: { type: String, required: true, default: uuid.v4, identifier: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdBy: { type: String, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
