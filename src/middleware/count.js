const StatisticsService = require("../services/model-services/StatisticsService");
const statisticsService = new StatisticsService();

const count = async (req, res, next) => {
  const accID = res.locals.accountID;
  await statisticsService.incNumberOfRequests(accID);
  next();
};

module.exports = count;
