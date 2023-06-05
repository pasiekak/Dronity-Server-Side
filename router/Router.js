const router = require('express').Router();
const apiRouter = require('./api/apiRouter');

router.use('/api', apiRouter)

module.exports = router;