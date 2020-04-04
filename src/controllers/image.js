const path = require('path');
const md5 = require('md5');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');

const { Image, Comment } = require('../models');

const ctrl = {};

ctrl.index = async (req, res) => {
    const image = await Image.findOne({
        filename: { $regex: req.params.image_id }
    }).lean({ virtuals: true });

    console.log(image);

    res.render('image', { image });
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
                    description: req.body.description
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

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({
        filename: {
            $regex: req.params.image_id
        }
    });

    if (image) {
        const newComment = new Comment({
            ...req.body,
            image_id: image._id,
            gravatar: md5(req.body.email)
        });
        await newComment.save();
        console.log(newComment);
    }
    res.redirect(`/images/${image.uniqueId}`);
};

ctrl.remove = (req, res) => {
    res.send('Hi');
};

module.exports = ctrl;
