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
                if (err) return res.status(500).json({ err })
                try {
                    // Dodaj informacje o pliku do bazy danych
                    const video = await this.service.create({
                        video_name: path.basename(files[key].name, path.extname(files[key].name)),
                        video_path: path.join('media', 'videos'),
                        video_extension: path.extname(files[key].name)
                    });
                    return res.status(201).json({ message: 'Video uploaded successfully' });
                } catch (error) {
                    console.error('Błąd przy zapisie pliku do bazy danych:', error);
                    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
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
        return res.status(404).json({ message: 'Nie znaleziono' });
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
                return res.status(200).send({ message: 'Usunięto' });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: 'Wystąpił błąd' })
            }
        }
        return res.status(404).json({ message: 'Nie znaleziono' });
    }
}

module.exports = VideoController;