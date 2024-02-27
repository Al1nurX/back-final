const multer = require('multer');

// Define storage for uploaded images
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads'); // Destination directory for uploaded images
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.images); // Rename the file if needed
	}
});

// Initialize multer instance with the specified storage options
const upload = multer({ storage: storage });

module.exports = upload;