const BaseController = require('../BaseController');
const ImageService = require('../../services/model-services/ImageService');
const imageService = new ImageService();
const path = require('path');
const fs = require('fs');

class ImageController extends BaseController {
    constructor() {
        super(imageService);
    }

    // Override or new methods here
    create = async (req, res) => {
        const files = req.files;

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, '../../', 'media', 'images', files[key].name)
            files[key].mv(filepath, async (err) => {
                if (err) return res.status(500).json({ err })
                try {
                    // Dodaj informacje o pliku do bazy danych
                    const image = await imageService.create({
                        image_name: path.basename(files[key].name, path.extname(files[key].name)),
                        image_path: path.join('media', 'images'),
                        image_extension: path.extname(files[key].name)
                    });
                } catch (error) {
                    console.error('Błąd przy zapisie pliku do bazy danych:', error);
                    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
                }
            })
        })
        
        return res.status(201).json({ message: 'Images uploaded successfully' });

    }

    getOne = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        if (found) {
            // Odczytaj plik z dysku
            let filepath = path.join(__dirname, '../../', found.image_path, found.image_name + found.image_extension);
            let fsimg = fs.readFileSync(filepath);
            let img = Buffer.from(fsimg, 'base64')
            console.log(img);
            return res.set({'Content-Type': 'image/png', 'Content-Length': img.length}).end(img)
        }
        return res.status(404).json({ message: 'Nie znaleziono' });
    }
    delete = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        if (found) {
            // Odczytaj plik z dysku
            let filepath = path.join(__dirname, '../../', found.image_path, found.image_name + found.image_extension);
            try{
                fs.unlinkSync(filepath);
                await found.destroy({ where: { id: id }});
                return res.status(200).send({ message: 'Usunięto' });
            } catch (err) {
                return res.status(500).json({ message: 'Wystąpił błąd' })
            }
        }
        return res.status(404).json({ message: 'Nie znaleziono' });
    }
}

module.exports = ImageController;