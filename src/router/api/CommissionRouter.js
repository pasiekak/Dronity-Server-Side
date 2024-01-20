const express = require("express");
const { verify, verifyAdmin, verifyOperator } = require("../../middleware/verify");
const count = require("../../middleware/count");
const CommissionController = require("../../controllers/model-controllers/CommissionController");
const commissionController = new CommissionController();

const router = new express.Router();
router.get("/", verify, verifyOperator, count, commissionController.getAll);
router.post("/", verify, count, commissionController.create);
router.get("/:id", verify, count, commissionController.getOne);
router.put("/:id", verify, count, commissionController.update);
router.delete("/:id", verify, verifyAdmin, count, commissionController.delete);
router.put("/:commissionID/applicant/:operatorID", verify, count, commissionController.updateApplication);
router.get("/:commissionID/operatorApplications/", verify, count, commissionController.getCommissionOperatorApplications);

module.exports = router;
