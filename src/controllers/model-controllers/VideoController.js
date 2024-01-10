const BaseController = require('../BaseController');
const VideoService = require('../../services/model-services/VideoService');
const videoService = new VideoService();
const path = require('path');
const fs = require('fs');
class VideoController extends BaseController {
    constructor() {
        super(videoService);
    }

    // Override or new methods here
    create = async (req, res) => {
        const files = req.files;
        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, '../../../', 'media', 'videos', files[key].name)
            files[key].mv(filepath, async (err) => {
                if (err) return res.status(500).send({ success: false, message: "Błąd zapisu filmu."});
                try {
                    // Dodaj informacje o pliku do bazy danych
                    const video = await this.service.create({
                        video_name: path.basename(files[key].name, path.extname(files[key].name)),
                        video_path: path.join('media', 'videos'),
                        video_extension: path.extname(files[key].name)
                    });
                    return res.status(201).json({ success: true, message: "Udało się wgrać film.", data: video });
                } catch (error) {
                    console.error('Błąd przy zapisie pliku do bazy danych:', error);
                    return res.status(500).send({ success: false, message: "Błąd zapisu rekordu filmu do bazy danych."});
                }
            })
        })
    }

    getOne = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        if (found) {
            // Odczytaj plik z dysku
            let filepath = path.join(__dirname, '../../../', found.video_path, found.video_name + found.video_extension);
            return res.status(200).download(filepath);
        }
        return res.status(404).send({ success: false, message: "Nie odnaleziono takiego filmu."});
    }
    delete = async (req, res) => {
        let id = req.params.id;
        let found = await this.service.findOne({ where: {id:id}});
        if (found) {
            // Odczytaj plik z dysku
            let filepath = path.join(__dirname, '../../../', found.video_path, found.video_name + found.video_extension);
            try{
                fs.unlinkSync(filepath);
                await found.destroy({ where: { id: id }});
                return res.status(200).send({ success: true, message: "Udało się usunąć zdjęcie." });
            } catch (err) {
                console.log(err);
                return res.status(500).send({ success: false, message: "Nie udało się usunąć zdjęcia."});
            }
        }
        return res.status(404).send({ success: false, message: "Nie udało się usunąć zdjęcia, ponieważ takiego nie ma."});
    }
}

module.exports = VideoController;