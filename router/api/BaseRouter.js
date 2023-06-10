const express = require('express');

const { verify } = require('../../middleware/verify');

class BaseRouter {
    constructor(controller) {
        this.controller = controller;
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes() {
        this.router.get('/', verify, this.controller.getAll);
        this.router.post('/', verify, this.controller.create);

        this.router.get('/:id', verify, this.controller.getOne);
        this.router.put('/:id', verify, this.controller.update);
        this.router.delete('/:id', verify, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = BaseRouter;