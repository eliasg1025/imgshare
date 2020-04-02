const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');

const { Image } = require('../models');

const ctrl = {};

ctrl.index = (req, res) => {
    res.send('Hi');
};

ctrl.create = (req, res) => {
    const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = Image.find({ filename: imgUrl });
        if (images.length > 0) {
            saveImage();
        } else {
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLocaleLowerCase();
            const targetPath = path.resolve(
                `src/public/upload/${imgUrl}${ext}`
            );

            const validExt = ['.png', '.jpg', '.jpeg', '.gif'];
            if (validExt.includes(ext)) {
                await fs.rename(imageTempPath, targetPath);

                const newImg = new Image({
                    title: req.body.title,
                    filename: imgUrl + ext,
                    decription: req.body.decription
                });
                const imageSaved = await newImg.save();
                //res.redirect('/images');
                res.send('works');
            } else {
                await fs.unlink(imageTempPath);
                res.status(400).json({ error: 'Only images are allowed' });
            }
        }
    };

    saveImage();
};

ctrl.like = (req, res) => {
    res.send('Hi');
};

ctrl.comment = (req, res) => {
    res.send('Hi');
};

ctrl.remove = (req, res) => {
    res.send('Hi');
};

module.exports = ctrl;
