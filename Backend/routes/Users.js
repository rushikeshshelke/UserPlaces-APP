const express = require("express");
const validators = require("express-validator");
const usersControllers = require("../controllers/Users");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    validators.check("name").not().isEmpty(),
    validators.check("email").normalizeEmail().isEmail(),
    validators.check("password").isLength({ min: 8 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
