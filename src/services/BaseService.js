const SequelizeService = require('./SequelizeService');

class BaseService extends SequelizeService {
    constructor(Model) {
        super(Model);
    }

    async findOne(id) {
        const result = await super.findOne(id);
        return result;
    };

    async findAndCountAll(options) {
        const result = await super.findAndCountAll(options);
        return result;
    }

    async findAll(options) {
        const result = await super.findAll(options);
        return result;
    };

    async create(body) {
        const result = await super.create(body);
        return result;
    }

    async update(body, id) {
        const result = await super.update(body, id);
        return result;
    }

    async destroy(options) {
        const result = await super.destroy(options);
        return result;
    }
}

module.exports = BaseService;