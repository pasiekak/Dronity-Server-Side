const BaseController = require('../BaseController');
const RoleService = require('../../services/model-services/RoleService');
const roleService = new RoleService();

class RoleController extends BaseController {
    constructor() {
        super(roleService);
    }

    // Override or new methods here
}

module.exports = RoleController;