const multer = require('multer');

const { v4: uuidv4 } = require('uuid');
const path=require('path')


// img ko store khan pe krana
const storage = multer.diskStorage({

destination: function (req, file, cb) {

cb(null, './public/images/uploads') // Destination folder for uploads

},
// uuid4 se unique name bnta hai
filename: function (req, file, cb) {

const uniqueFilename = uuidv4(); // Generating a unique filename using UUID cb(null, uniqueFilename); // Use the unique filename for the uploaded file
cb(null,uniqueFilename+path.extname(file.originalname))
}
}
);

module.exports = multer({ storage: storage });