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
      if (commission.contractor) {
        let contractor = await commission.getContractor();
        const contractorAccount = await contractor.getAccount();
        contractor.dataValues.email = contractorAccount.email;
        response.contractor = contractor;
      }

      response.author = author;
      response.details = commission;
      return res
        .status(200)
        .json({
          success: true,
          message: "Pomyślnie pobrano rekord.",
          data: response,
        });
    }
    return res
      .status(404)
      .send({ success: false, message: "Nie udało się pobrać rekordu." });
  };

  create = async (req, res) => {
    const data = req.body;
    const authorID = res.locals.clientID;
    data.author = authorID;
    try {
      const newCommission = await commissionService.create(data);
      return res.status(201).send({
        success: true,
        message: "Dodano zamówienie",
        data: newCommission,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .send({ success: false, message: "Wystąpił błąd." });
    }
  };
  update = async (req, res) => {
    const id = req.params.id;
    try {
      const found = await this.service.findOne({ where: { id: id } });
      if (found) {
        if (found.author !== res.locals.clientID)
          return res.status(401).send({
            success: false,
            message: "Nie masz uprawnień do modyfikacji tego zlecenia.",
          });
        let updated = await this.service.update(req.body, {
          where: { id: id },
        });
        return res
          .status(200)
          .send({ success: true, message: "Zaaktualizowano.", data: updated });
      }
      return res
        .status(404)
        .send({
          success: false,
          message:
            "Nie udało się zaaktualizować zlecenia, ponieważ takie nie istnieje.",
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = CommissionController;
