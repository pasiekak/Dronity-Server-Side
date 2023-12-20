const express = require('express');

const ImageController = require('../../controllers/model-controllers/ImageController');
const imageController = new ImageController();
const BaseRouter = require('./BaseRouter');
const { verify, verifyAdmin } = require('../../middleware/verify');
const count = require('../../middleware/count');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../middleware/filePayloadExists');
const fileExtLimiter = require('../../middleware/fileExtLimiter');
const fileSizeLimiter = require('../../middleware/fileSizeLimiter');

class ImageRouter extends BaseRouter {
    constructor() {
        super(imageController)
    };

    initializeRoutes() {

        this.router.post('/',verify, count,
        fileUpload({ createParentPath: true }),
        filesPayloadExists,
        fileExtLimiter(['.png','.jpg','.jpeg']),
        fileSizeLimiter,
        this.controller.create);
        
        this.router.post('/accounts/:accountID', verify, count,
        fileUpload({ createParentPath: true }),
        filesPayloadExists,
        fileExtLimiter(['.png','.jpg','.jpeg']),
        fileSizeLimiter, 
        this.controller.createAccountProfileImage)

        this.router.get('/:id', verify, count, this.controller.getOne);
        this.router.delete('/:id', verify, verifyAdmin, count, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = ImageRouter;