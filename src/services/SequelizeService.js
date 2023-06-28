class SequelizeService {
    constructor (Model) {
        this.model = Model;
    }

    findOne(id) {
        return this.model.findOne(id);
    };

    findAll() {
        return this.model.findAll();
    };

    create(body) {
        return this.model.create(body);
    };

    update(body, id) {
        return this.model.update(body, id);
    };

    destroy(id) {
        return this.model.destroy(id);
    };
}

module.exports = SequelizeService;