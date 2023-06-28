const Video = require('../../seqDB/models').Video;
const BaseService = require('../BaseService');

class VideoService extends BaseService {
    constructor() {
        super(Video)
    }

    // Override or new methods here
}

module.exports = VideoService;