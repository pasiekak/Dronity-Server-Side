const express = require("express");
const { verify, verifyAdmin, verifyOperator } = require("../../middleware/verify");
const count = require("../../middleware/count");
const ImageController = require("../../controllers/model-controllers/ImageController");
const imageController = new ImageController();
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../../middleware/filePayloadExists");
const fileExtLimiter = require("../../middleware/fileExtLimiter");
const fileSizeLimiter = require("../../middleware/fileSizeLimiter");

const router = new express.Router();
router.post(
  "/operators/:operatorID",
  verify,
  verifyOperator,
  count,
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  imageController.create
);
router.post(
  "/accounts/:accountID",
  verify,
  count,
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  imageController.createAccountProfileImage
);
router.get("/:id", verify, count, imageController.getOne);
router.get("/operator/:operatorID", verify, count, imageController.getAllImagesIDsOfOperator);
router.delete("/:id", verify, verifyAdmin, count, imageController.delete);

module.exports = router;
