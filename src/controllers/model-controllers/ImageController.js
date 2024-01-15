const BaseController = require("../BaseController");
const ImageService = require("../../services/model-services/ImageService");
const imageService = new ImageService();
const path = require("path");
const fs = require("fs");

class ImageController extends BaseController {
  constructor() {
    super(imageService);
  }

  // Override or new methods here
  create = async (req, res) => {
    const files = req.files;
    Object.keys(files).forEach((key) => {
      const filepath = path.join(
        __dirname,
        "../../../",
        "media",
        "images",
        files[key].name
      );
      files[key].mv(filepath, async (err) => {
        if (err)
          return res
            .status(500)
            .send({ success: false, message: "Nie udało się zapisać zdjęć." });
        try {
          // Dodaj informacje o pliku do bazy danych
          const image = await imageService.create({
            image_name: path.basename(
              files[key].name,
              path.extname(files[key].name)
            ),
            image_path: path.join("media", "images"),
            image_extension: path.extname(files[key].name),
          });
          return res.status(201).json({
            success: true,
            message: "Pomyślnie zapisano zdjęcie.",
            data: image,
          });
        } catch (error) {
          console.error("Błąd przy zapisie pliku do bazy danych:", error);
          return res.status(500).send({
            success: false,
            message: "Nie udało się zapisać zdjęć do bazy danych.",
          });
        }
      });
    });
  };

  createAccountProfileImage = async (req, res) => {
    const files = req.files;
    const accountID = req.params.accountID;
    if (files && accountID) {
      const profileImage = files.profileImage;
      const extension = path.extname(profileImage.name);
      const name = path.basename(profileImage.name, extension);
      let newName;

      let ok = false;
      while (!ok) {
        const addition = Math.floor(Math.random() * 99999) + 1;
        newName = name + addition;
        const existingImage = await imageService.findOne({
          where: { image_name: newName },
        });
        if (!existingImage) {
          ok = true;
        }
      }
      const filepath = path.join(
        __dirname,
        "../../../",
        "media",
        "images",
        newName + extension
      );
      profileImage.mv(filepath, async (err) => {
        if (err)
          return res.status(500).send({
            success: false,
            message: "Nie udało się zapisać zdjęcia profilowego.",
          });
        try {
          const oldProfileImage = await imageService.findOne({
            where: { AccountId: accountID, profile: true },
          });
          if (oldProfileImage) {
            const oldPath = path.join(
              __dirname,
              "../../../",
              "media",
              "images",
              oldProfileImage.image_name + oldProfileImage.image_extension
            );
            fs.unlink(oldPath, (err) => {
              if (err)
                return res.status(400).send({
                  success: false,
                  message:
                    "Nie udało się usunąć poprzedniego zdjęcia profilowego.",
                });
            });
            await oldProfileImage.destroy();
          }

          const image = await imageService.create({
            image_name: newName,
            image_path: path.join("media", "images"),
            image_extension: extension,
            profile: true,
            AccountId: accountID,
          });
          if (image) {
            return res.status(201).json({
              success: true,
              message: "Pomyślnie ustawiono zdjęcie profilowe.",
              data: image,
            });
          }
        } catch (error) {
          console.log(error);
          res.status(400).json({ success: false, message: "Wystąpił błąd." });
        }
      });
    }
  };

  getOne = async (req, res) => {
    let id = req.params.id;
    let found = await this.service.findOne({ where: { id: id } });
    if (found) {
      try {
        let filepath = path.join(
          __dirname,
          "../../../",
          found.image_path,
          found.image_name + found.image_extension
        );
        let fsimg = fs.readFileSync(filepath);
        let img = Buffer.from(fsimg, "base64");
        return res
          .set({ "Content-Type": "image/png", "Content-Length": img.length })
          .end(img);
      } catch (err) {
        console.log(err);
        return res.status(404).send({
          success: false,
          message: "Nie odnaleziono zdjęcia na serwerze.",
        });
      }
    }
    return res
      .status(404)
      .send({ success: false, message: "Nie udało się pobrać zdjęcia." });
  };
  delete = async (req, res) => {
    let id = req.params.id;
    let found = await this.service.findOne({ where: { id: id } });
    if (found) {
      // Odczytaj plik z dysku
      let filepath = path.join(
        __dirname,
        "../../../",
        found.image_path,
        found.image_name + found.image_extension
      );
      try {
        fs.unlinkSync(filepath);
        await found.destroy({ where: { id: id } });
        return res
          .status(200)
          .send({ success: true, message: "Pomyślnie usunięto zdjęcie." });
      } catch (err) {
        return res
          .status(500)
          .send({ success: false, message: "Nie udało się usunąć zdjęcia." });
      }
    }
    return res.status(404).send({
      success: false,
      message: "Nie udało się usunąć zdjęcia ponieważ ono nie istnieje.",
    });
  };
}

module.exports = ImageController;
