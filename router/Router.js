const router = require('express').Router();
const apiRouter = require('./api/apiRouter');

router.use('/api', apiRouter)
router.get('/', (req, res) => {
    res.render('home')
})
router.post('/', (req, res) => {
    res.send(req.body)
})

module.exports = router;