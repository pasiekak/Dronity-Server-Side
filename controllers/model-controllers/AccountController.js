const jwt = require('jsonwebtoken');

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
                // Setting up JWT
                const role = await account.getRole();
                const roleName = role.name;
                const payload = { login: account.login, email: account.email, role: roleName };
                console.log('payload', payload);
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.header('Authorization', `Bearer ${token}`);
                return res.status(200).json({ success: true, message: 'Udało Ci się zalogować' , apiKey: account.api_key, token: token})
            }
            return res.status(401).json({ success: false, message: 'Nieprawidłowy login lub hasło '})
        } catch (error) {
            console.error('function authenticate', error);
            return res.status(500).json({ success: false, message: 'Wystąpił błąd' })
        }
    }
}

module.exports = AccountController;