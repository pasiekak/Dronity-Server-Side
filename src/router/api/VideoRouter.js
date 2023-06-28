const express = require('express');

const VideoController = require('../../controllers/model-controllers/VideoController');
const videoController = new VideoController();
const BaseRouter = require('./BaseRouter');
const { verify, verifyAdmin } = require('../../middleware/verify');
const count = require('../../middleware/count');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../middleware/filePayloadExists');
const fileExtLimiter = require('../../middleware/fileExtLimiter');
const fileSizeLimiter = require('../../middleware/fileSizeLimiter');

class VideoRouter extends BaseRouter {
    constructor() {
        super(videoController)
    };

    initializeRoutes() {
        this.router.post('/',verify,verifyAdmin,count,
        fileUpload({ createParentPath: true }),
        filesPayloadExists,
        fileExtLimiter(['.mp4']),
        fileSizeLimiter,
        this.controller.create);
        this.router.get('/:id', verify, verifyAdmin, count, this.controller.getOne);
        this.router.delete('/:id', verify, verifyAdmin, count, this.controller.delete);
    };

    getRouter() {
        return this.router;
    }
};

module.exports = VideoRouter;