const BaseController = require('../BaseController');
const ImageService = require('../../services/model-services/ImageService');
const imageService = new ImageService();

class ImageController extends BaseController {
    constructor() {
        super(imageService);
    }

    // Override or new methods here
}

module.exports = ImageController;