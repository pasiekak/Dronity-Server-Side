const ExpressLoader = require('./loaders/Express');
const db = require('./seqDB/models');
db.sequelize.sync().then(() => {
    console.log('Database synchronised');
    new ExpressLoader();
})