const BaseController = require('../BaseController');
const OperatorService = require('../../services/model-services/OperatorService');
const operatorService = new OperatorService();

class OperatorController extends BaseController {
    constructor() {
        super(operatorService);
    }

    // Override or new methods here
}

module.exports = OperatorController;