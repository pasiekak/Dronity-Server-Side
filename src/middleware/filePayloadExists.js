const filesPayloadExists = (req, res, next) => {
    if(!req.files) {
        return res.status(400).json({ success: false, message: 'Nie wybrano żadnych plików.' });
    }
    next();
}

module.exports = filesPayloadExists