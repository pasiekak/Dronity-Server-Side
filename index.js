const ExpressLoader = require('./loaders/Express');
const db = require('./seqDB/models');
const test = require('./test');
db.sequelize.sync({force: false}).then(() => {
    //test();
    // TODO: TESTY JEDNOSTKOWE BAZY DANYCH
    console.log('Database synchronised');
    new ExpressLoader();
})