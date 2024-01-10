class BaseController {
  constructor(Service) {
    this.service = Service;
  }

  getOne = async (req, res) => {
    let id = req.params.id;
    let found = await this.service.findOne({ where: { id: id } });
    if (found) return res.status(200).json({ success: true, message: "Pomyślnie znaleziono rekord.", data: found});
    return res.status(404).send({ success: false, message: "Nie ma takiego rekordu."});
  };

  getAll = async (req, res) => {
    let all = await this.service.findAll();
    return res.status(200).json({ success: true, message: "Pomyślnie pobrano dane.", data: all });
  };

  create = async (req, res) => {
    let created;
    try {
      created = await this.service.create(req.body);
      return res.status(201).json({ success: true, data: created, message: "Utworzono rekord." });
    } catch (error) {
      console.log(error);
      return res.status(409).send({ success: false, message: "Nie udało się utworzyć rekordu."});
    }
  };

  update = async (req, res) => {
    const id = req.params.id;
    try {
      const found = await this.service.findOne({ where: { id: id } });
      if (found) {
        let updated = await this.service.update(req.body, {
          where: { id: id },
        });
        return res.status(200).json({ success: true, message: "Pomyślnie zaaktualizowano rekord.", data: updated });
      }
      return res.status(404).send({ success: false, message: "Nie można zedytować rekordu, ponieważ on nie istnieje."});
    } catch (error) {
      return res.status(400).send({ success: false, message: "Wystąpił błąd."});
    }
  };

  delete = async (req, res) => {
    let id = req.params.id;
    try {
      let found = await this.service.findOne({ where: { id: id } });
      if (found) {
        let destroyed = await this.service.destroy({ where: { id: id } });
        return res.status(200).json({ success: true, message: "Usunięto" });
      }
      return res.status(404).send({ success: false, message: "Nie udało się usunąć rekordu, ponieważ taki nie istnieje."});
    } catch (error) {
      return res.status(400).send({ success: false, message: "Wystąpił błąd."});
    }
  };
}

module.exports = BaseController;
