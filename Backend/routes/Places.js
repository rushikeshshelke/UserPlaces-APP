const express = require("express");
const validator = require("express-validator");
const placesControllers = require("../controllers/Places");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

router.get("/:pid", placesControllers.getPlaceByPlaceId);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(auth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    validator.check("title").not().isEmpty(),
    validator.check("description").isLength({ min: 5 }),
    validator.check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    validator.check("title").not().isEmpty(),
    validator.check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
