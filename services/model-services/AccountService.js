const Account = require('../../seqDB/models').Account;
const BaseService = require('../BaseService');

class AccountService extends BaseService {
    constructor() {
        super(Account)
    }

    // Override or new methods here
    async authenticate(login, password) {
        const account = await Account.authenticate(login, password);
        return account;
    }
}

module.exports = AccountService;