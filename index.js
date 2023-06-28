require('dotenv').config()

const ExpressLoader = require('./src/loaders/Express');
const db = require('./src/seqDB/models');
db.sequelize.sync({force: false}).then(() => {
    console.log('Database synchronised');
    new ExpressLoader();
})