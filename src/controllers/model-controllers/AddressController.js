const BaseController = require('../BaseController');
const AddressService = require('../../services/model-services/AddressService');
const addressService = new AddressService();

class AddressController extends BaseController {
    constructor() {
        super(addressService);
    }

    // Override or new methods here
}

module.exports = AddressController;