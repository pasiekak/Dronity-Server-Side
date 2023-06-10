class BaseController {
    constructor(Service) {
        this.service = Service;
    }

    getOne = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        return res.status(200).json(found);
    }

    getAll = async (req, res) => {
        let all = await this.service.findAll();
        return res.status(200).json(all);
    }

    create = async (req, res) => {
        let created;
        try {
            created = await this.service.create(req.body);
            return res.status(201).json({ created, message: 'Utworzono'});
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    update = async (req, res) => {
        let id = req.params.id;
        try {
            let found = await this.service.findOne({ where: {id:id}});
            if(found) {
                let updated = await this.service.update(req.body, { where : { id: id }});
                return res.status(200).json({ numberOfUpdatedRows: updated, message: 'Zaktualizowano' });
            }
            return res.status(404).json({ message: 'Nie znaleziono' });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    delete = async (req, res) => {
        let id = req.params.id;
        try {
            let found = await this.service.findOne({ where: {id:id}});
            if(found) {
                let destroyed = await this.service.destroy({ where: { id: id }});
                return res.status(200).json({ numberOfDestroyedRows: destroyed, message: 'Usunięto' });
            }
            return res.status(404).json({ numberOfDestroyedRows: 0, message: 'Nie znaleziono' });
        }
        catch (error) {
            return res.status(400).json(error);
        }
    }
}

module.exports = BaseController;