const Role = require('../../seqDB/models').Role;
const BaseService = require('../BaseService');

class RoleService extends BaseService {
    constructor() {
        super(Role)
    }

    // Override or new methods here
}

module.exports = RoleService;