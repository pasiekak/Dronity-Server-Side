const SequelizeService = require('./SequelizeService');

class BaseService extends SequelizeService {
    constructor(Model) {
        super(Model);
    }

    async findOne(id) {
        const result = await super.findOne(id);
        return { success: true, body: result };
    };

    async findAll() {
        const result = await super.findAll();
        return { success: true, body: result };
    };

    async create(body) {
        const result = await super.create(body);
        return { success: true, body: result };
    }

    async update(body, id) {
        const result = await super.update(body, id);
        return { success: true, body: result };
    }

    async destroy(id) {
        const result = await super.destroy(id);
        return { success: true, body: result };
    }
}

module.exports = BaseService;