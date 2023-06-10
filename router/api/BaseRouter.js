const express = require('express');

const verifyApiKey = require('../../middleware/verifyApiKey');

class BaseRouter {
    constructor(controller) {
        this.controller = controller;
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes() {
        this.router.get('/', verifyApiKey, this.controller.getAll);
        this.router.post('/', verifyApiKey, this.controller.create);

        this.router.get('/:id', verifyApiKey, this.controller.getOne);
        this.router.put('/:id', verifyApiKey, this.controller.update);
        this.router.delete('/:id', verifyApiKey, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = BaseRouter;