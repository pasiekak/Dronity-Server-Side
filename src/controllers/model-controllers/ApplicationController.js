const BaseController = require("../BaseController");
const ApplicationService = require("../../services/model-services/ApplicationService");
const applicationService = new ApplicationService();
const models = require("../../seqDB/models");

class ApplicationController extends BaseController {
  constructor() {
    super(applicationService);
  }

  // Override or new methods here

  create = async (req, res) => {
    const operatorID = res.locals.operatorID;
    const commissionID = req.body.id;
    const offered_payment = req.body.offered_payment;
    try {
      const created = await applicationService.create({
        OperatorId: operatorID,
        CommissionId: commissionID,
        offered_payment,
      });
      return res.status(201).send({ success: true, message: "Pomyślnie zgłoszono.", application: created });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };

  delete = async (req, res) => {
    const commissionID = req.params.commissionID;
    try {
      if (res.locals.role === "operator") {
        const operatorID = res.locals.operatorID;
        const deleted = await applicationService.destroy({
          where: {
            OperatorId: operatorID,
            CommissionId: commissionID,
          },
        });
        if (deleted === 1) {
          return res.status(204).send({ success: true, message: "Usunięto twoje zgłoszenie do tego zlecenia" });
        } else if (deleted === 0) {
          return res.status(404).send({ success: false, message: "Nie udało się usunąć tego zgłoszenia, ponieważ takie nie istnieje" });
        } else {
          return res.status(400).send({ success: false, message: "Wystąpił błąd." });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = ApplicationController;
