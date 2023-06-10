const Client = require('../../seqDB/models').Account;
const BaseService = require('../BaseService');

class ClientService extends BaseService {
    constructor() {
        super(Client)
    }

    // Override or new methods here
}

module.exports = ClientService;