const BaseController = require("../BaseController");
const OperatorService = require("../../services/model-services/OperatorService");
const operatorService = new OperatorService();
const models = require("../../seqDB/models");
const Sequelize = require("sequelize");
class OperatorController extends BaseController {
  constructor() {
    super(operatorService);
  }

  // Override or new methods here
  getOne = async (req, res) => {
    const id = req.params.id;
    try {
      if (id) {
        const operator = await operatorService.findOne({ where: { id: id } });
        // const temp = await operatorService.findOne({
        //   where: { id: id },
        //   attributes: {
        //     include: [[Sequelize.col("Account.email"), "email"]],
        //   },
        //   include: [
        //     {
        //       model: models.Account,
        //       attributes: [],
        //     },
        //   ],
        //   raw: true,
        // });
        // console.log(temp);
        if (operator) {
          if (res.locals.role === "client") {
            const operatorAcc = await operator.getAccount();
            if (operator) {
              return res
                .status(200)
                .send({ success: true, message: "Pomyślnie pobrano dane operatora", operator: { ...operator.dataValues, email: operatorAcc.email } });
            } else {
              return res.status(404).send({ success: false, message: "Nie znaleziono takiego operatora." });
            }
          } else {
            return res.status(200).send({ success: true, message: "Pomyślnie pobrano dane operatora", operator });
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = OperatorController;
