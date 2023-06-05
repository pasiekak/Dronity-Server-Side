const router = require('express').Router();

router.get('/allUsers', (req,res) => {
    console.log('Pobieram i przesyłam dane wszystkich userów');
})

module.exports = router;