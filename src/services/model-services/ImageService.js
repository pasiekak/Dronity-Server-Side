const Image = require('../../seqDB/models').Image;
const BaseService = require('../BaseService');

class ImageService extends BaseService {
    constructor() {
        super(Image)
    }

    // Override or new methods here
}

module.exports = ImageService;