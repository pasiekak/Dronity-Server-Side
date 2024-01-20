const router = require("express").Router();

const accountRouter = require("./AccountRouter");
const commissionRouter = require("./CommissionRouter");
const applicationRouter = require("./ApplicationRouter");
const imageRouter = require("./ImageRouter");

const clientController = new (require("../../controllers/model-controllers/ClientController"))();
const clientRouter = new (require("./BaseRouter"))(clientController);

const operatorController = new (require("../../controllers/model-controllers/OperatorController"))();
const operatorRouter = new (require("./BaseRouter"))(operatorController);

const roleController = new (require("../../controllers/model-controllers/RoleController"))();
const roleRouter = new (require("./BaseRouter"))(roleController);

const addressController = new (require("../../controllers/model-controllers/AddressController"))();
const addressRouter = new (require("./BaseRouter"))(addressController);

const videoRouter = new (require("./VideoRouter"))();

const statisticsController = new (require("../../controllers/model-controllers/StatisticsController"))();
const statisticsRouter = new (require("./BaseRouter"))(statisticsController);

router.use("/accounts", accountRouter);
router.use("/commissions", commissionRouter);
router.use("/applications", applicationRouter);
router.use("/images", imageRouter);
router.use("/operators", operatorRouter.router);
router.use("/clients", clientRouter.router);
router.use("/roles", roleRouter.router);
router.use("/addresses", addressRouter.router);
router.use("/videos", videoRouter.router);
router.use("/statistics", statisticsRouter.router);

module.exports = router;
