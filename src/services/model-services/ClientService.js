const Client = require('../../seqDB/models').Client;
const BaseService = require('../BaseService');

class ClientService extends BaseService {
    constructor() {
        super(Client)
    }

    // Override or new methods here
}

module.exports = ClientService;