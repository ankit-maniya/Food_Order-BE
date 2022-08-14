import multer from "multer";

const imageStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'app/images')
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, uniqueSuffix + '-' + file.originalname)
    },
})

export const uploadImage = multer({ storage: imageStorage }).array('images')