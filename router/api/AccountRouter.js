const express = require('express');

const AccountController = require('../../controllers/model-controllers/AccountController');
const accountController = new AccountController();
const BaseRouter = require('./BaseRouter');
const { verify, verifyAdmin } = require('../../middleware/verify');

class AccountRouter extends BaseRouter {
    constructor() {
        super(accountController)
    };

    initializeRoutes() {
        this.router.get('/', verify, verifyAdmin, this.controller.getAll);
        this.router.post('/', verify, verifyAdmin, this.controller.create);

        this.router.get('/:id', verify, verifyAdmin, this.controller.getOne);
        this.router.put('/:id', verify, verifyAdmin, this.controller.update);
        this.router.delete('/:id', verify, verifyAdmin, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = AccountRouter;