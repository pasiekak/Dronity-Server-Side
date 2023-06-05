const router = require('express').Router();
const usersRouter = require('./users/usersRouter');

router.use('/users', usersRouter);

module.exports = router;