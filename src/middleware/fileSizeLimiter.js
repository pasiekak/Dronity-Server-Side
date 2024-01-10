const MB = 50; // 50MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;

  const filesOverLimit = [];
  // Which files are over limit

  Object.keys(files).forEach((key) => {
    if (files[key].size > FILE_SIZE_LIMIT) {
      filesOverLimit.push(files[key].name);
    }
  });

  if (filesOverLimit.length) {
    const message = `Upload zdjęć nie powiódł się. ${filesOverLimit.toString()} to zbyt duża liczba plików.`;

    return res.status(413).json({ success: false, message });
  }

  next();
};

module.exports = fileSizeLimiter;
