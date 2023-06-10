require('dotenv').config()

const ExpressLoader = require('./loaders/Express');
const db = require('./seqDB/models');
db.sequelize.sync({force: false}).then(() => {
    console.log('Database synchronised');
    new ExpressLoader();
})