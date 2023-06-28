const Address = require('../../seqDB/models').Address;
const BaseService = require('../BaseService');

class AddressService extends BaseService {
    constructor() {
        super(Address)
    }

    // Override or new methods here
}

module.exports = AddressService;