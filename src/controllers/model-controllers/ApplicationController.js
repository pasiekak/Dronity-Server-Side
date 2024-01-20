const BaseController = require("../BaseController");
const CommissionService = require("../../services/model-services/CommissionService");
const commissionService = new CommissionService();
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
      const commission = await commissionService.findOne({ where: { id: commissionID } });
      if (commission.status === 1) {
        commission.status = 2;
        await commission.save();
      }
      return res.status(201).send({
        success: true,
        message: "Pomyślnie zgłoszono.",
        data: {
          application: {
            ...created.dataValues,
            offered_payment: parseFloat(created.dataValues.offered_payment),
            accepted: null,
            rejectType: null,
            customComment: null,
          },
        },
      });
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
        const application = await applicationService.findOne({
          where: {
            OperatorId: operatorID,
            CommissionId: commissionID,
            accepted: null,
          },
        });
        if (application) {
          // deleting application
          const deleted = await application.destroy();

          // status manage
          if (deleted) {
            const commission = await commissionService.findOne({ where: { id: commissionID } });
            if (commission.status === 2) {
              const applications = await commission.getApplicationOperator();
              const isOneAccepted = applications.some((operator) => {
                return operator.Application.dataValues.accepted === true;
              });
              if (!isOneAccepted) {
                const isAnyToConsider = applications.some((operator) => {
                  return operator.Application.dataValues.accepted === null;
                });
                if (!isAnyToConsider) {
                  commission.status = 1;
                  await commission.save();
                }
              }
            }
            return res.status(204).send({ success: true, message: "Usunięto twoje zgłoszenie do tego zlecenia" });
          } else {
            return res.status(400).send({ success: false, message: "Wystąpił błąd." });
          }
        } else {
          return res.status(404).send({ success: false, message: "Nie udało się usunąć tego zgłoszenia, ponieważ takie nie istnieje" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
  getOperatorApplications = async (req, res) => {
    const operatorID = parseInt(req.params.operatorID);
    const type = req.query.type;
    console.log(type, operatorID);
    try {
      if (type === "applicatedCommissions") {
        const relatedCommissions = await applicationService.findAll({
          where: {
            OperatorId: operatorID,
          },
          attributes: ["CommissionId", [models.Sequelize.fn("MAX", models.Sequelize.col("createdAt")), "latestCreatedAt"]],
          group: ["CommissionId"],
          order: [[models.Sequelize.literal("latestCreatedAt DESC")]],
          raw: true,
        });
        return res.status(200).send({
          success: true,
          message: "Udało się pobrać listę zleceń na które zgłaszał się operator",
          data: {
            applicatedCommissions: relatedCommissions.map((ob) => ob.CommissionId),
          },
        });
      }
      return res.status(200).send({ success: true, message: "Udało się pobrać aplikacje tego operatora." });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = ApplicationController;
