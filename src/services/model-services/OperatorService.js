const Operator = require('../../seqDB/models').Operator;
const BaseService = require('../BaseService');

class OperatorService extends BaseService {
    constructor() {
        super(Operator)
    }

    // Override or new methods here
}

module.exports = OperatorService;