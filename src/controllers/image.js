const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');

const ctrl = {};

ctrl.index = (req, res) => {
    res.send('Hi');
};

ctrl.create = async (req, res) => {
    const imgUrl = randomNumber();
    const imageTempPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLocaleLowerCase();
    const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

    const validExt = ['.png', '.jpg', '.jpeg', '.gif'];
    if (validExt.includes(ext)) {
        await fs.rename(imageTempPath, targetPath);
    }

    res.send('works');
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
