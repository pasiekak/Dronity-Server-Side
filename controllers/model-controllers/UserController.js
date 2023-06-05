const BaseController = require('../BaseController');
const UserService = require('../../services/model-services/UserService');
const userService = new UserService();

class UserController extends BaseController {
    constructor() {
        super(userService);
    }

    // Override or new methods here
}

module.exports = UserController;