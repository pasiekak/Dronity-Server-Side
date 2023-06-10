const router = require('express').Router();

const accountController = new (require('../../controllers/model-controllers/AccountController'))();
const accountRouter = new (require('./BaseRouter'))(accountController);

const clientController = new (require('../../controllers/model-controllers/ClientController'))();
const clientRouter = new (require('./BaseRouter'))(clientController);

router.use('/accounts', accountRouter.router);
router.use('/clients', clientRouter.router);

module.exports = router;