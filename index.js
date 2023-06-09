const ExpressLoader = require('./loaders/Express');
const db = require('./seqDB/models');
db.sequelize.sync({force: false}).then(() => {
    // TODO: TESTY JEDNOSTKOWE BAZY DANYCH
    console.log('Database synchronised');
    new ExpressLoader();
})