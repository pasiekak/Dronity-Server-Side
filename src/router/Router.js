const router = require('express').Router();

const apiRouter = require('./api/apiRouter');
const AccountController = require('../controllers/model-controllers/AccountController');
const accountController = new AccountController();

router.use('/api', apiRouter)

router.post('/login', accountController.authenticate);
router.post('/register', accountController.registerFirstStep);
router.get('/activation', accountController.register);
router.delete('/logout', accountController.logout);


module.exports = router;