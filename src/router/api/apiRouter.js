const router = require('express').Router();

const accountRouter = require('./AccountRouter');

const clientController = new (require('../../controllers/model-controllers/ClientController'))();
const clientRouter = new (require('./BaseRouter'))(clientController);

const operatorController = new (require('../../controllers/model-controllers/OperatorController'))();
const operatorRouter = new (require('./BaseRouter'))(operatorController);

const roleController = new (require('../../controllers/model-controllers/RoleController'))();
const roleRouter = new (require('./BaseRouter'))(roleController);

const addressController = new (require('../../controllers/model-controllers/AddressController'))();
const addressRouter = new (require('./BaseRouter'))(addressController);

const commissionController = new (require('../../controllers/model-controllers/CommissionController'))();
const commissionRouter = new (require('./BaseRouter'))(commissionController);

const imageRouter = new (require('./ImageRouter'))();

const videoRouter = new (require('./VideoRouter'))();

const statisticsController = new (require('../../controllers/model-controllers/StatisticsController'))();
const statisticsRouter = new (require('./BaseRouter'))(statisticsController);

router.use('/accounts', accountRouter);
router.use('/clients', clientRouter.router);
router.use('/operators', operatorRouter.router);
router.use('/roles', roleRouter.router);
router.use('/addresses', addressRouter.router);
router.use('/commissions', commissionRouter.router);
router.use('/images', imageRouter.router);
router.use('/videos', videoRouter.router);
router.use('/statistics', statisticsRouter.router);


module.exports = router;