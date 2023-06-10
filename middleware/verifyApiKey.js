const AccountService = require('../services/model-services/AccountService');
const accountService = new AccountService();

const verifyApiKey = async (req, res, next) => {
    let header = req.get('Authorization');
    if(header)
    {
        header = header.substring(14);
        const account = await accountService.findOne({where : { api_key: header}})
        console.log(header);
        console.log(account);
        if(account) {
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Nieprawidłowy klucz API' })
        }
    } else {
        return res.status(401).json({ success: false, message: 'Nieprawidłowy klucz API' })
    }
     
}

module.exports = verifyApiKey