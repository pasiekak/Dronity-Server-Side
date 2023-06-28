const SequelizeService = require('./SequelizeService');

class BaseService extends SequelizeService {
    constructor(Model) {
        super(Model);
    }

    async findOne(id) {
        const result = await super.findOne(id);
        return result;
    };

    async findAll() {
        const result = await super.findAll();
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

    async destroy(id) {
        const result = await super.destroy(id);
        return result;
    }
}

module.exports = BaseService;