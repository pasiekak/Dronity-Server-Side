const ExpressLoader = require('./loaders/Express');
const db = require('./seqDB/models');
db.sequelize.sync().then(() => {
    // db.Account.create({
    //     login: "Krzys",
    //     hash: "HashPassword",
    //     email: "test@email.com",
    //     RoleId: 1,
    //     ProfileId: 1,
    // })
    console.log('Database synchronised');
    new ExpressLoader();
})