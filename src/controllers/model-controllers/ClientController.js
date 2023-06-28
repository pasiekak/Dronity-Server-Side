const BaseController = require('../BaseController');
const ClientService = require('../../services/model-services/ClientService');
const clientService = new ClientService();

class ClientController extends BaseController {
    constructor() {
        super(clientService);
    }

    // Override or new methods here
}

module.exports = ClientController;