const BaseController = require("../BaseController");
const OperatorService = require("../../services/model-services/OperatorService");
const operatorService = new OperatorService();
const models = require("../../seqDB/models");
const { Op } = require("sequelize");
class OperatorController extends BaseController {
  constructor() {
    super(operatorService);
  }

  // Override or new methods here
  getAll = async (req, res) => {
    const params = req.query;
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const { by, order, searchWord } = params;
    try {
      let whereClause = {};
      if (searchWord) {
        whereClause[Op.or] = [];
        whereClause[Op.or].push({ firstName: { [Op.like]: `%${searchWord}%` } });
        whereClause[Op.or].push({ lastName: { [Op.like]: `%${searchWord}%` } });
        whereClause[Op.or].push({ city: { [Op.like]: `%${searchWord}%` } });
      }
      const operators = await operatorService.findAndCountAll({
        include: [
          {
            model: models.Account,
            attributes: ["email"],
            include: { model: models.Image, where: { profile: true }, attributes: ["id"], required: false },
          },
        ],
        where: whereClause,
        order: [[by, order]],
        limit,
        offset: (page - 1) * limit,
      });
      return res.status(200).send({ success: true, message: "Udało się pobrać dane operatorów", data: operators });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Nie udało się pobrać danych operatorów." });
    }
  };

  getOne = async (req, res) => {
    const id = req.params.id;
    try {
      if (id) {
        const operator = await operatorService.findOne({
          where: { id: id },
          include: [
            {
              model: models.Account,
              attributes: ["email"],
              include: { model: models.Image, where: { profile: true }, attributes: ["id"], required: false },
            },
          ],
        });
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
