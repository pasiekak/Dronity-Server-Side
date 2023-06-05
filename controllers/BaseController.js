class BaseController {
    constructor(Service) {
        this.service = Service;
    }

    getOne = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        return res.status(200).send(found);
    }

    getAll = async (req, res) => {
        let all = await this.service.findAll();
        return res.status(200).send(all);
    }

    create = async (req, res) => {
        let created = await this.service.create(req.body);
        return res.status(201).send(created);
    }

    update = async (req, res) => {
        let id = req.params.id;
        let updated = await this.service.update(req.body, { where : { id: id }});
        return res.status(200).send(updated);
    }

    delete = async (req, res) => {
        let id = req.params.id;
        let destroyed = await this.service.destroy({ where: { id: id }});
        return res.status(200).send(destroyed);
    }
}

module.exports = BaseController;