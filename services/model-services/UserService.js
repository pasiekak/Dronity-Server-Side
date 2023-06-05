const User = require('../../database/models').User;
const BaseService = require('../BaseService');

class UserService extends BaseService {
    constructor() {
        super(User)
    }

    // Override or new methods here
}

module.exports = UserService;