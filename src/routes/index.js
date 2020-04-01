const router = require('express').Router();

const HomeController = require('../controllers/home');
const ImageController = require('../controllers/image');

module.exports = app => {
    router.get('/', HomeController.index);
    router.get('/images/:image_id', ImageController.index);
    router.post('/images', ImageController.create);
    router.post('/images/:image_id/like', ImageController.like);
    router.post('/images/:image_id/comment', ImageController.comment);
    router.delete('/images/:image_id', ImageController.remove);

    app.use(router);
};
