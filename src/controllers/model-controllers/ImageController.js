const BaseController = require("../BaseController");
const ImageService = require("../../services/model-services/ImageService");
const imageService = new ImageService();
const AccountService = require("../../services/model-services/AccountService");
const accountService = new AccountService();
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

class ImageController extends BaseController {
  constructor() {
    super(imageService);
  }

  // Override or new methods here
  create = async (req, res) => {
    const images = req.files;
    const operatorID = req.params.operatorID;
    try {
      if (images && operatorID) {
        const operatorAcc = await accountService.findOne({
          where: { OperatorId: operatorID },
          attributes: ["id"],
          raw: true,
        });
        if (operatorAcc) {
          const ids = Object.keys(images);
          const accountID = operatorAcc.id;
          const createdIDs = [];
          for (let i = 0; i < ids.length; i++) {
            const imageData = images[ids[i]];

            const extension = path.extname(imageData.name);
            const name = path.basename(imageData.name, extension);
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

            const filepath = path.join(__dirname, "../../../", "media", "images", newName + extension);
            await imageData.mv(filepath, async (err) => {
              if (err) {
                result.push({ imageName: imageData.name, added: false });
                console.log(err);
              }
              try {
                const image = await imageService.create({
                  image_name: newName,
                  image_path: path.join("media", "images"),
                  image_extension: extension,
                  profile: false,
                  AccountId: accountID,
                });
                if (image) {
                  createdIDs.push(image.id);
                  if (i === ids.length - 1) {
                    return res.status(201).send({ success: true, message: "Udało się zapisać zdjęcia.", data: { createdIDs } });
                  }
                } else {
                  return res.status(500).send({ success: false, message: "Nie udało się zapisać zdjęcia." });
                }
              } catch (error) {
                console.log(error);
                return res.status(400).json({ success: false, message: "Wystąpił błąd." });
              }
            });
          }
        } else {
          return res.status(404).send({ success: false, message: "Nie odnaleziono konta połączonego z tym operatorem." });
        }
      } else {
        return res.status(404).send({ success: false, message: "Brak zdjęć lub id operatora." });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
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
      const filepath = path.join(__dirname, "../../../", "media", "images", newName + extension);
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
            const oldPath = path.join(__dirname, "../../../", "media", "images", oldProfileImage.image_name + oldProfileImage.image_extension);
            fs.unlink(oldPath, (err) => {
              if (err)
                return res.status(400).send({
                  success: false,
                  message: "Nie udało się usunąć poprzedniego zdjęcia profilowego.",
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

  getAllImagesIDsOfOperator = async (req, res) => {
    let operatorID = parseInt(req.params.operatorID);
    try {
      if (operatorID) {
        const account = await accountService.findOne({
          where: { OperatorId: operatorID },
          raw: true,
          attributes: ["id"],
        });
        if (account) {
          const accountID = account.id;
          const images = await imageService.findAndCountAll({
            where: {
              AccountId: accountID,
              profile: {
                [Op.not]: true,
              },
            },
            attributes: ["id"],
            raw: true,
          });
          if (images) {
            return res.status(200).send({
              success: true,
              message: "Udało się pobrać listę id zdjęć operatora",
              data: {
                imagesData: {
                  count: images.count,
                  ids: images.rows.map((ob) => ob.id),
                },
              },
            });
          } else {
            res.status(404).send({ success: false, message: "Nie znaleziono zdjęć operatora w bazie danych." });
          }
        } else {
          return res.status(404).send({ success: false, message: "Taki operator nie ma u nas konta." });
        }
      } else {
        return res.status(404).send({ success: false, message: "Nie dostarczono id operatora." });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ success: false, message: "Wystąpił błąd." });
    }
  };

  getOne = async (req, res) => {
    let id = req.params.id;
    let found = await imageService.findOne({ where: { id: id } });
    if (found) {
      try {
        let filepath = path.join(__dirname, "../../../", found.image_path, found.image_name + found.image_extension);
        let fsimg = fs.readFileSync(filepath);
        let img = Buffer.from(fsimg, "base64");
        return res.set({ "Content-Type": "image/png", "Content-Length": img.length }).end(img);
      } catch (err) {
        console.log(err);
        return res.status(404).send({
          success: false,
          message: "Nie odnaleziono zdjęcia na serwerze.",
        });
      }
    }
    return res.status(404).send({ success: false, message: "Nie udało się pobrać zdjęcia." });
  };
  delete = async (req, res) => {
    let id = req.params.id;
    let found = await this.service.findOne({ where: { id: id } });
    if (found) {
      // Odczytaj plik z dysku
      let filepath = path.join(__dirname, "../../../", found.image_path, found.image_name + found.image_extension);
      try {
        fs.unlinkSync(filepath);
        await found.destroy({ where: { id: id } });
        return res.status(200).send({ success: true, message: "Pomyślnie usunięto zdjęcie." });
      } catch (err) {
        return res.status(500).send({ success: false, message: "Nie udało się usunąć zdjęcia." });
      }
    }
    return res.status(404).send({
      success: false,
      message: "Nie udało się usunąć zdjęcia ponieważ ono nie istnieje.",
    });
  };
}

module.exports = ImageController;
