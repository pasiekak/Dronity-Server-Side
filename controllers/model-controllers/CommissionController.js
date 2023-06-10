const BaseController = require('../BaseController');
const CommissionService = require('../../services/model-services/CommissionService');
const commissionService = new CommissionService();

class CommissionController extends BaseController {
    constructor() {
        super(commissionService);
    }

    // Override or new methods here
}

module.exports = CommissionController;