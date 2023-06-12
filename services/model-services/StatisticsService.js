const Statistics = require('../../seqDB/models').Statistics;
const BaseService = require('../BaseService');

class StatisticsService extends BaseService {
    constructor() {
        super(Statistics)
    }

    async incNumberOfRequests(apiKey) {
        const stats = await super.findOne({ where: {api_key: apiKey}});
        const actual = stats.numberOfRequests;
        await super.update({numberOfRequests: actual+1},{ where: {api_key: apiKey}})
    }

    // Override or new methods here
}

module.exports = StatisticsService;