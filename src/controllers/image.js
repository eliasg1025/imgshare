const path = require('path');
const md5 = require('md5');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');

const { Image, Comment } = require('../models');
const sidebar = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
    let viewModel = {
        image: {},
        comments: {}
    };

    let image = await Image.findOne({
        filename: { $regex: req.params.image_id }
    });

    if (image) {
        image.views += 1;
        await image.save();

        image = await Image.findOne({
            filename: { $regex: req.params.image_id }
        }).lean({ virtuals: true });
        viewModel.image = image;

        const comments = await Comment.find({ image_id: image._id }).lean();
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        console.log(viewModel.sidebar.comments);

        res.render('image', viewModel);
    } else {
        res.redirect('/');
    }
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
                res.redirect(`/images/${imageSaved.uniqueId}`);
            } else {
                await fs.unlink(imageTempPath);
                res.status(400).json({ error: 'Only images are allowed' });
            }
        }
    };

    saveImage();
};

ctrl.like = async (req, res) => {
    const image = await Image.findOne({
        filename: { $regex: req.params.image_id }
    });

    if (image) {
        image.likes += 1;
        await image.save();
        res.json({ likes: image.likes });
    } else {
        res.status(404).json({ error: 'Internal Error' });
    }
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
        res.redirect(`/images/${image.uniqueId}`);
    } else {
        res.redirect('/');
    }
};

ctrl.remove = async (req, res) => {
    const image = await Image.findOne({
        filename: { $regex: req.params.image_id }
    });

    if (image) {
        await fs.unlink(path.resolve(`./src/public/upload/${image.filename}`));
        await Comment.deleteOne({ image_id: image._id });
        await image.remove();
        res.json(true);
    }
};

module.exports = ctrl;
