const BaseController = require("../BaseController");
const ClientService = require("../../services/model-services/ClientService");
const CommissionService = require("../../services/model-services/CommissionService");
const clientService = new ClientService();
const commissionService = new CommissionService();
const models = require("../../seqDB/models");

class CommissionController extends BaseController {
  constructor() {
    super(commissionService);
  }

  getOne = async (req, res) => {
    const response = {};
    let id = req.params.id;
    const commission = await commissionService.findOne({
      where: { id: id },
    });
    if (commission) {
      //details for author
      let author = await commission.getAuthor();
      const authorAccount = await author.getAccount();
      author.dataValues.email = authorAccount.email;

      //details for contractor
      let contractor = await commission.getContractor();
      const contractorAccount = await contractor.getAccount();
      contractor.dataValues.email = contractorAccount.email;

      response.author = author;
      response.contractor = contractor;
      response.details = commission;
      return res.status(200).json(response);
    }
    return res.status(404).send();
  };
}

module.exports = CommissionController;
