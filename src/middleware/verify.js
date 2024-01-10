const jwt = require("jsonwebtoken");

const AccountService = require("../services/model-services/AccountService");
const accountService = new AccountService();

const verify = async (req, res, next) => {
  const header = req.get("Authorization");
  const token = req.cookies["Authorization"];
  // app or user has to provide a header
  if (header || token) {
    // it could be either Bearer or Drone-Api-Key
    // Bearer for jwt token given to user after login
    if (token) {
      try {
        let data = jwt.verify(
          token.slice("7", token.length),
          process.env.JWT_SECRET
        );
        const account = await accountService.findOne({
          where: { id: data.id },
        });
        let accountRole = await account.getRole();
        let roleName = accountRole.name;
        res.locals.operatorID = account.OperatorId;
        res.locals.clientID = account.ClientId;
        res.locals.accountID = account.id;
        res.locals.role = roleName;
        res.locals.api_key = account.api_key;
        next();
      } catch (error) {
        console.error("function verify", error);
        return res
          .status(400)
          .json({ success: false, message: "Nieautoryzowana próba (token)" });
      }

      // Drone-Api-Key for api key given to user once after login, any application has to provide it in header
    } else if (header) {
      key = header.slice(14, header.length);
      const account = await accountService.findOne({ where: { api_key: key } });
      if (account) {
        let accountRole = await account.getRole();
        let roleName = accountRole.name;
        res.locals.operatorID = account.OperatorId;
        res.locals.clientID = account.ClientId;
        res.locals.accountID = account.id;
        res.locals.role = roleName;
        res.locals.api_key = key;
        next();
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Nieautoryzowana próba (klucz)" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Nieautoryzowana próba (brak klucza i tokenu w headerach)" });
    }
  } else if (req.query.api_key) {
    const key = req.query.api_key;
    const account = await accountService.findOne({ where: { api_key: key } });
    if (account) {
      let accountRole = await account.getRole();
      let roleName = accountRole.name;
      res.locals.role = roleName;
      res.locals.api_key = key;
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Nie ma takiego konta" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Nieautoryzowana próba (brak klucza i tokenu)" });
  }
};

const verifyAdmin = async (req, res, next) => {
  if (res.locals.role === "administrator") next();
  else
    return res
      .status(401)
      .json({ success: false, message: "Nieautoryzowana próba" });
};

module.exports = { verify, verifyAdmin };
