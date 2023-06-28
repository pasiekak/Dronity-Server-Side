const path = require('path');

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files;
        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name));
        });

        // Are the file extensions allowed
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext));
        if(!allowed) {
            const message = 'File extension not allowed'

            return res.status(422).json({ message });
        }
        next()
    }
} 

module.exports = fileExtLimiter;