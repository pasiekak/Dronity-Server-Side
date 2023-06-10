const jwt = require('jsonwebtoken');

const AccountService = require('../services/model-services/AccountService');
const accountService = new AccountService();

const verify = async (req, res, next) => {
    let header = req.get('Authorization');
    // app or user has to provide a header
    if(header)
    {
        // it could be either Bearer or Drone-Api-Key

        // Bearer for jwt token given to user after login
        if(header.startsWith('Bearer ')) {
            token = header.slice(7, header.length);
            try {
                let data = jwt.verify(token, process.env.JWT_SECRET);
                res.locals.role = data.role;
                next();
            } catch (error) {
                console.error('function verify', error);
                return res.status(400).json({ success: false, message: 'Wystąpił błąd' })
            }

        // Drone-Api-Key for api key given to user once after login, any application has to provide it in header
        } else if (header.startsWith('Drone-Api-Key ')) {
            key = header.slice(14, header.length);
            const account = await accountService.findOne({where: { api_key: key }});
            if(account) {
                let accountRole = await account.getRole();
                let roleName = accountRole.name;
                res.locals.role = roleName;
                next();
            } else {
                return res.status(401).json({ success: false, message: 'Nieautoryzowana próba' })
            }
        } else {
            return res.status(401).json({ success: false, message: 'Nieautoryzowana próba' })
        }
    } else {
        return res.status(401).json({ success: false, message: 'Nieautoryzowana próba' })
    }
}

const verifyAdmin = async (req, res, next) => {
    if(res.locals.role === 'administrator' || res.locals.role === 'moderator') next();
    else return res.status(401).json({ success: false, message: 'Ten użytkownik nie ma uprawnień do tych zasobów' })
}

module.exports = { verify, verifyAdmin }