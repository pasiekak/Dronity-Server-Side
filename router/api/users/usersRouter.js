const router = require('express').Router();
const UserController = require('../../../controllers/model-controllers/UserController');
const userController = new UserController()

router.get('/allUsers', userController.getAll);

module.exports = router;