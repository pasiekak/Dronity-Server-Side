const MB = 15; // 15MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;
    
    const filesOverLimit = []
    // Which files are over limit

    Object.keys(files).forEach(key => {
        if(files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name);
        }
    })

    if(filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} to large`;

        return res.status(413).json({ message: sentence });
    }

    next();
}

module.exports = fileSizeLimiter;