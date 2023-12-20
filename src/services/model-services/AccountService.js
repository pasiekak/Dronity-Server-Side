const jwt = require('jsonwebtoken');

const ClientService = require('../../services/model-services/ClientService');
const clientService = new ClientService();
const OperatorService = require('../../services/model-services/OperatorService');
const operatorService = new OperatorService();
const AddressService = require('../../services/model-services/AddressService');
const addressService = new AddressService();
const StatisticsService = require('../../services/model-services/StatisticsService');
const statisticsService = new StatisticsService();

const Account = require('../../seqDB/models').Account;
const BaseService = require('../BaseService');

class AccountService extends BaseService {
    constructor() {
        super(Account)
    }

    // Override or new methods here
    async authenticate(login, password) {
        const account = await Account.authenticate(login, password);
        return account;
    }

    async create(body) {
        const result = await Account.create(body);
        if(result) {
            if(result.dataValues.RoleId === 3) {
                const client = await clientService.create();
                await addressService.create({ClientId: client.id});
                await result.setClient(client);
            } else if (result.dataValues.RoleId === 2) {
                const operator = await operatorService.create();
                await result.setOperator(operator);
            }
            await statisticsService.create({api_key: result.api_key});
        }
        return result;
    }
}

module.exports = AccountService;