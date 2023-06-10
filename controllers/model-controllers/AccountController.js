
const BaseController = require('../BaseController');
const AccountService = require('../../services/model-services/AccountService');
const accountService = new AccountService();

class AccountController extends BaseController {
    constructor() {
        super(accountService);
    }

    // Override or new methods here
    async authenticate(req, res) {
        let {login, password} = req.body;
        try {
            const account = await accountService.authenticate(login, password);
            if (account) {
                // Seting authorization header
                return res.status(200).json({ success: true, message: 'Udało Ci się zalogować' , apiKey: account.api_key})
            }
            return res.status(401).json({ success: false, message: 'Nieprawidłowy login lub hasło '})
        } catch (error) {
            console.error('function authenticate', error);
            return res.status(500).json({ success: false, message: 'Wystąpił błąd' })
        }
    }
}

module.exports = AccountController;