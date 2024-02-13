const Statistics = require('../../seqDB/models').Statistics;
const BaseService = require('../BaseService');

class StatisticsService extends BaseService {
    constructor() {
        super(Statistics)
    }

    async incNumberOfRequests(accID) {
        const stats = await super.findOne({ where: {AccountId: accID}});
        stats.numberOfRequests += 1;
        await stats.save();
    }

    // Override or new methods here
}

module.exports = StatisticsService;