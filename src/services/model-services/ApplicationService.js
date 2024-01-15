const seq = require("../../seqDB/models");
const BaseService = require("../BaseService");
const Application = seq.sequelize.models.Application;
class ApplicationService extends BaseService {
  constructor() {
    super(Application);
  }

  // Override or new methods here
}

module.exports = ApplicationService;
