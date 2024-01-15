const BaseController = require("../BaseController");
const CommissionService = require("../../services/model-services/CommissionService");
const ApplicationService = require("../../services/model-services/ApplicationService");
const { Op } = require("sequelize");
const commissionService = new CommissionService();
const applicationService = new ApplicationService();
const models = require("../../seqDB/models");

class CommissionController extends BaseController {
  constructor() {
    super(commissionService);
  }

  getAll = async (req, res) => {
    //Pagination
    const page = parseInt(req?.query?.page);
    const limit = parseInt(req?.query?.limit);
    //Sorting
    const by = req?.query?.by;
    const order = req?.query?.order;
    //Searching
    const searchWord = req?.query?.searchWord;
    //Filters
    const clientDate = Number(req?.query?.clientDate);
    // Sprawdz czy null
    const minPayment = req?.query?.minPayment === "null" ? null : parseInt(req?.query?.minPayment);
    const maxPayment = req?.query?.maxPayment === "null" ? null : parseInt(req?.query?.maxPayment);

    const minStartDate = req?.query?.minStartDate === "null" ? null : new Date(new Date(req?.query?.minStartDate) - 1000 * 60 * 60 * 24);
    const maxStartDate = req?.query?.maxStartDate === "null" ? null : new Date(new Date(req?.query?.maxStartDate) + 1000 * 60 * 60 * 24);
    try {
      let result;
      if (page && limit && by && order !== undefined && searchWord !== undefined) {
        const whereClause = {
          contractor: null,
          [Op.and]: [
            {
              start_date: { [Op.gte]: new Date(clientDate - 1000 * 60 * 60 * 24) },
            },
          ],
        };

        if (minStartDate) {
          whereClause[Op.and].push({ start_date: { [Op.gte]: minStartDate } });
        }
        if (maxStartDate) {
          whereClause[Op.and].push({ start_date: { [Op.lte]: maxStartDate } });
        }
        if (minPayment) {
          whereClause[Op.and].push({ suggested_payment: { [Op.gte]: minPayment } });
        }
        if (maxPayment) {
          whereClause[Op.and].push({ suggested_payment: { [Op.lte]: maxPayment } });
        }
        if (searchWord !== "") {
          whereClause[Op.or] = [];
          whereClause[Op.or].push({ title: { [Op.like]: `%${searchWord}%` } });
          whereClause[Op.or].push({ city: { [Op.like]: `%${searchWord}%` } });
        }
        result = await commissionService.findAndCountAll({
          where: whereClause,
          order: [[by, order]],
          limit,
          offset: (page - 1) * limit,
        });
      } else {
        result = await commissionService.findAll();
      }
      if (result) return res.status(200).send({ success: true, message: "Pomyślnie pobrano dane.", data: result });
      return res.status(404).send({ success: false, message: "Brak zleceń do przyjęcia" });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };

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

      // Details about applications
      let applicants;
      if (res.locals.role === "operator") {
        //Check if operator have applied and return true or false
        applicants = await commission.getApplicationOperator({ where: { id: res.locals.operatorID } });
        if (JSON.stringify(applicants) !== "[]") {
          response.applied = true;
        } else response.applied = false;
      } else if (res.locals.role === "client") {
        //Check if commission have some applications, then return to client list of them or null.
        applicants = await commission.getApplicationOperator();
        if (JSON.stringify(applicants) === "[]") {
          response.applications = null;
        } else {
          response.applications = applicants.map((applicant) => applicant.Application.dataValues);
        }
      }

      response.author = author;
      response.details = commission;
      return res.status(200).json({
        success: true,
        message: "Pomyślnie pobrano rekord.",
        data: response,
      });
    }
    return res.status(404).send({ success: false, message: "Nie udało się pobrać rekordu." });
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
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
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
        return res.status(200).send({ success: true, message: "Zaaktualizowano.", data: updated });
      }
      return res.status(404).send({
        success: false,
        message: "Nie udało się zaaktualizować zlecenia, ponieważ takie nie istnieje.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };

  // deleteApplication = async (req, res) => {
  //   const commissionID = req.params.commissionID;
  //   const operatorID = req.params.operatorID;
  //   try {
  //     const commission = await commissionService.findOne({
  //       where: { id: commissionID },
  //     });
  //     if (commission) {
  //       if (res.locals.clientID === commission.author) {
  //         const removed = await commission.removeApplicationOperator(operatorID);
  //         if (removed === 1) {
  //           return res.status(204).send({ success: true, message: "Usunięto zgłoszenie operatora" });
  //         } else if (removed === 0) {
  //           return res.status(404).send({ success: false, message: "Nie udało się usunąć tego zgłoszenia, ponieważ takie nie istnieje" });
  //         } else {
  //           return res.status(400).send({ success: false, message: "Wystąpił błąd." });
  //         }
  //       } else {
  //         return res.status(401).send({ success: false, message: "Nie masz uprawnień do tej operacji." });
  //       }
  //     } else {
  //       return res.status(404).send({ success: false, message: "Nie znaleziono takiego zlecenia." });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(400).send({ success: false, message: "Wystąpił błąd." });
  //   }
  // };

  // setContractor = async (req, res) => {
  //   const commissionID = parseInt(req.params.commissionID);
  //   const operatorID = parseInt(req.params.operatorID);
  //   try {
  //     const commission = await commissionService.findOne({
  //       where: { id: commissionID },
  //     });
  //     if (commission) {
  //       if (res.locals.clientID === commission.author) {
  //         const deleted = await commission.setApplicationOperator(null); // returns [] or [n] - n is number of deleted rows
  //         commission.contractor = operatorID;
  //         const newCommission = await commission.save();

  //         let responseContractor = {};
  //         let contractor = await commission.getContractor();
  //         const contractorAccount = await contractor.getAccount();
  //         responseContractor = { ...contractor.dataValues, email: contractorAccount.email };

  //         if (newCommission && deleted) {
  //           return res.status(201).send({
  //             success: true,
  //             message: "Pomyślnie zatwierdzono operatora",
  //             data: { commission: newCommission, applications: null, contractor: responseContractor },
  //           });
  //         } else {
  //           return res.status(400).send({ success: false, message: "Coś poszło nie tak." });
  //         }
  //       } else {
  //         return res.status(401).send({ success: false, message: "Nie masz uprawnień do tej operacji." });
  //       }
  //     } else {
  //       return res.status(404).send({ success: false, message: "Nie znaleziono takiego zlecenia." });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(400).send({ success: false, message: "Wystąpił błąd." });
  //   }
  // };

  updateApplication = async (req, res) => {
    const commissionID = parseInt(req.params.commissionID);
    const operatorID = parseInt(req.params.operatorID);
    const type = req.body.type;
    try {
      const commission = await commissionService.findOne({
        where: { id: commissionID },
      });
      if (commission) {
        if (res.locals.clientID === commission.author) {
          if (type === "accept") {
            const acceptedApplication = await applicationService.findOne({
              where: {
                CommissionId: commissionID,
                OperatorId: operatorID,
              },
            });
            acceptedApplication.accepted = true;
            await acceptedApplication.save();

            const rejectedApplications = await applicationService.update(
              { accepted: false },
              {
                where: {
                  CommissionId: commissionID,
                  OperatorId: { [models.Sequelize.Op.not]: operatorID },
                },
              }
            );
            commission.contractor = operatorID;
            commission.agreed_payment = acceptedApplication.offered_payment;
            await commission.save();

            let contractor = await commission.getContractor();
            const contractorAccount = await contractor.getAccount();
            const responseContractor = { ...contractor.dataValues, email: contractorAccount.email };
            const newApplications = await applicationService.findAll({where: { CommissionId: commissionID }})
            return res.status(200).send({
              success: true,
              message: "Pomyślnie zatwierdzono operatora jako wykonawcę zlecenia.",
              data: {
                applications: newApplications,
                contractor: responseContractor,
              },
            });
          } else if (type === "reject") {
            const rejectedApplication = await applicationService.findOne({
              where: {
                CommissionId: commissionID,
                OperatorId: operatorID,
              },
            });
            rejectedApplication.accepted = false;
            await rejectedApplication.save();
            const newApplications = await applicationService.findAll({where: { CommissionId: commissionID }})

            return res.status(200).send({
              success: true,
              message: "Pomyślnie odrzucono zgłoszenie operatora na to zlecenie",
              data: {
                applications: newApplications
              },
            });
          }
        } else {
          return res.status(401).send({ success: false, message: "Nie masz uprawnień do tej operacji." });
        }
      } else {
        return res.status(404).send({ success: false, message: "Nie znaleziono takiego zlecenia." });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = CommissionController;
