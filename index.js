const ExpressLoader = require('./loaders/Express');
const db = require('./database/models');

db.sequelize.sync().then(() => {
    console.log('Database synchronised');
    new ExpressLoader();
})