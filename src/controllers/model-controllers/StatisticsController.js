const BaseController = require('../BaseController');
const StatisticsService = require('../../services/model-services/StatisticsService.js');
const statisticsService = new StatisticsService();

class StatisticsController extends BaseController {
    constructor() {
        super(statisticsService);
    }
    // Override or new methods here
}

module.exports = StatisticsController;