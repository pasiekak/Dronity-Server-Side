const express = require('express');

const { verify } = require('../../middleware/verify');
const count = require('../../middleware/count');

class BaseRouter {
    constructor(controller) {
        this.controller = controller;
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes() {
        this.router.get('/', verify, count, this.controller.getAll);
        this.router.post('/', verify, count, this.controller.create);

        this.router.get('/:id', verify, count, this.controller.getOne);
        this.router.put('/:id', verify, count, this.controller.update);
        this.router.delete('/:id', verify, count, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = BaseRouter;