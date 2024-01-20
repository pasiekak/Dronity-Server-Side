const BaseController = require("../BaseController");
const CommissionService = require("../../services/model-services/CommissionService");
const ApplicationService = require("../../services/model-services/ApplicationService");
const { Op } = require("sequelize");
const commissionService = new CommissionService();
const OperatorService = require("../../services/model-services/OperatorService");
const operatorService = new OperatorService();
const applicationService = new ApplicationService();
const models = require("../../seqDB/models");
const STATUSMSGS = require("../../consts/statusmsgs");
const REJECTMSGS = require("../../consts/rejectmsgs");
const { application } = require("express");

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
        const applications = applicants.map((applicant) => {
          return {
            ...applicant.Application.dataValues,
            rejectType: applicant.Application.dataValues.rejectType !== null ? REJECTMSGS[applicant.Application.dataValues.rejectType].message : null,
          };
        });
        response.applications = applications;
      } else if (res.locals.role === "client") {
        //Check if commission have some applications, then return to client list of them or null.
        applicants = await commission.getApplicationOperator();
        response.applications = applicants.map((applicant) => applicant.Application.dataValues);
      }

      response.author = author;
      response.details = commission;

      // Fix for status
      response.details.status = STATUSMSGS[response.details.status];

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
      const found = await commissionService.findOne({ where: { id: id } });
      if (found) {
        if (found.author !== res.locals.clientID)
          return res.status(401).send({
            success: false,
            message: "Nie masz uprawnień do modyfikacji tego zlecenia.",
          });
        if (req.query.type === "resume") {
          const haveContractor = found.contractor !== null;
          const applications = await found.getApplicationOperator();
          const haveConsiderableApplications = applications.some((operator) => {
            return operator.Application.dataValues.accepted === null;
          });
          if (haveContractor) {
            found.status = 3;
          } else if (haveConsiderableApplications) {
            found.status = 2;
          } else if (!haveConsiderableApplications) {
            found.status = 1;
          }
          await found.save();
          found.status = STATUSMSGS[found.status];
          return res.status(200).send({ success: true, message: "Zaaktualizowano.", data: { newCommission: found } });
        } else {
          await commissionService.update(req.body, {
            where: { id: id },
          });
          const updated = await commissionService.findOne({ where: { id: id }, raw: true });
          updated.status = STATUSMSGS[updated.status];

          return res.status(200).send({ success: true, message: "Zaaktualizowano.", data: { newCommission: updated } });
        }
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

  updateApplication = async (req, res) => {
    const commissionID = parseInt(req.params.commissionID);
    const operatorID = parseInt(req.params.operatorID);
    const type = req.body.type;
    const applicationID = req.body.applicationID;
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
                id: applicationID,
              },
            });
            acceptedApplication.accepted = true;
            await acceptedApplication.save();

            const rejectedApplications = await applicationService.update(
              { accepted: false, rejectType: 6 },
              {
                where: {
                  CommissionId: commissionID,
                  OperatorId: { [models.Sequelize.Op.not]: operatorID },
                },
              }
            );
            commission.contractor = operatorID;
            commission.status = 3;
            commission.agreed_payment = acceptedApplication.offered_payment;
            await commission.save();

            let contractor = await commission.getContractor();
            const contractorAccount = await contractor.getAccount();
            const responseContractor = { ...contractor.dataValues, email: contractorAccount.email };
            const newApplications = await applicationService.findAll({ where: { CommissionId: commissionID } });
            return res.status(200).send({
              success: true,
              message: "Pomyślnie zatwierdzono operatora jako wykonawcę zlecenia.",
              data: {
                applications: newApplications,
                contractor: responseContractor,
                newStatus: STATUSMSGS[3],
              },
            });
          } else if (type === "reject") {
            const rejectedApplication = await applicationService.findOne({
              where: {
                CommissionId: commissionID,
                OperatorId: operatorID,
                id: applicationID,
              },
            });
            if (rejectedApplication) {
              rejectedApplication.accepted = false;
              rejectedApplication.rejectType = req.body.rejectData.rejectType;
              rejectedApplication.customComment = req.body.rejectData.customComment;
              await rejectedApplication.save();

              const newApplications = await applicationService.findAll({ where: { CommissionId: commissionID } });
              const isOneAccepted = newApplications.some((application) => {
                return application.dataValues.accepted === true;
              });
              const isAnyToConsider = newApplications.some((application) => {
                return application.dataValues.accepted === null;
              });
              const resData = {
                applications: newApplications,
              };
              if (!isOneAccepted) {
                if (!isAnyToConsider) {
                  resData.newStatus = STATUSMSGS[1];
                  commission.status = 1;
                  await commission.save();
                }
              }
              return res.status(200).send({
                success: true,
                message: "Pomyślnie odrzucono zgłoszenie operatora na to zlecenie",
                data: resData,
              });
            } else {
              return res.status(404).send({ success: false, message: "Nie znaleziono takiej aplikacji" });
            }
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
  getCommissionOperatorApplications = async (req, res) => {
    const commissionID = parseInt(req.params.commissionID);
    try {
      const applications = await applicationService.findAll({
        where: {
          OperatorId: res.locals.operatorID,
          CommissionId: commissionID,
        },
        order: [["createdAt", "ASC"]],
      });
      if (applications) {
        const mappedApplications = applications.map((application) => {
          console.log(application.dataValues.rejectType);
          return {
            ...application.dataValues,
            rejectType: application.dataValues.rejectType !== null ? REJECTMSGS[application.dataValues.rejectType].message : null,
          };
        });
        return res
          .status(200)
          .send({ success: true, message: "Udało się pobrać aplikacje operatora dla tego zlecenia.", data: { applications: mappedApplications } });
      } else {
        return res.status(400).send({ success: false, message: "Wystąpił błąd." });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };
}

module.exports = CommissionController;
