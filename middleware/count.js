const StatisticsService = require('../services/model-services/StatisticsService');
const statisticsService = new StatisticsService();

const count = async (req, res, next) => {
    const key = res.locals.api_key;
    await statisticsService.incNumberOfRequests(key);
    next()
}

module.exports = count;