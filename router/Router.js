const router = require('express').Router();
const apiRouter = require('./api/apiRouter');

router.use('/api', apiRouter)
router.get('/', (req, res) => {
    res.render('home');
})

module.exports = router;