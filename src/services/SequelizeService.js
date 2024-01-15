class SequelizeService {
    constructor (Model) {
        this.model = Model;
    }

    findAndCountAll(options) {
        return this.model.findAndCountAll(options);
    }

    findOne(id) {
        return this.model.findOne(id);
    };

    findAll(options) {
        return this.model.findAll(options);
    };

    create(body) {
        return this.model.create(body);
    };

    update(body, id) {
        return this.model.update(body, id);
    };

    destroy(options) {
        return this.model.destroy(options);
    };
}

module.exports = SequelizeService;