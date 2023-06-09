const router = require('express').Router();
const apiRouter = require('./api/apiRouter');
const AccountController = require('../controllers/model-controllers/AccountController');
const accountController = new AccountController();

router.use('/api', apiRouter)

// Redirects
router.get('/', (req, res) => {
    res.redirect('/login')
})
router.get('/login',(req, res) => {
    res.render('login');
})
router.get('/dashboard',(req,res) => {
    
    res.render('dashboard')
})

router.post('/login', accountController.authenticate)


module.exports = router;