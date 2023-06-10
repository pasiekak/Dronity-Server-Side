const Commission = require('../../seqDB/models').Commission;
const BaseService = require('../BaseService');

class CommissionService extends BaseService {
    constructor() {
        super(Commission)
    }

    // Override or new methods here
}

module.exports = CommissionService;