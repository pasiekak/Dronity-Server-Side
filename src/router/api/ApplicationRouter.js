const express = require("express");
const { verify, verifyAdmin, verifyOperator } = require("../../middleware/verify");
const count = require("../../middleware/count");
const ApplicationController = require("../../controllers/model-controllers/ApplicationController");
const applicationController = new ApplicationController();

const router = new express.Router();
router.get("/", verify, verifyAdmin, count, applicationController.getAll);
router.post("/", verify, verifyOperator, count, applicationController.create);
router.get("/:id", verify, count, applicationController.getOne);
router.put("/:id", verify, count, applicationController.update);
router.delete("/:commissionID", verify, verifyOperator, count, applicationController.delete);
router.get("/operator/:operatorID", verify, verifyOperator, count, applicationController.getOperatorApplications)

module.exports = router;
