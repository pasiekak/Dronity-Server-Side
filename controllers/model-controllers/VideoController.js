const BaseController = require('../BaseController');
const VideoService = require('../../services/model-services/VideoService');
const videoService = new VideoService();

class VideoController extends BaseController {
    constructor() {
        super(videoService);
    }

    // Override or new methods here
}

module.exports = VideoController;