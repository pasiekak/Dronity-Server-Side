const express = require('express');
const { verify, verifyAdmin } = require('../../middleware/verify');
const count = require('../../middleware/count');
const AccountController = require('../../controllers/model-controllers/AccountController');
const accountController = new AccountController();

const router = new express.Router();
router.get('/', verify, verifyAdmin, count, accountController.getAll);
router.post('/', verify, count, accountController.create);
router.get('/:id', verify, count, accountController.getOne);
router.put('/:id', verify, count, accountController.update);
router.delete('/:id', verify, verifyAdmin, count, accountController.delete);

module.exports = router;