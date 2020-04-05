const { Comment, Image } = require('../models');

async function imageCounter() {
    const images = await Image.countDocuments();
    return images;
}

async function commentsCounter() {
    const comments = await Comment.countDocuments();
    return comments;
}

async function imageTotalViewsCounter() {
    const result = await Image.aggregate([
        {
            $group: {
                _id: '1',
                viewsTotal: { $sum: '$views' }
            }
        }
    ]);
    return result[0].viewsTotal;
}

async function likesTotalCounter() {
    const result = await Image.aggregate([
        {
            $group: {
                _id: '1',
                likesTotal: { $sum: '$likes' }
            }
        }
    ]);
    return result[0].likesTotal;
}

module.exports = async () => {
    const results = await Promise.all([
        imageCounter(),
        commentsCounter(),
        imageTotalViewsCounter(),
        likesTotalCounter()
    ]);

    return {
        images: results[0],
        comments: results[1],
        views: results[2],
        likes: results[3]
    };
};
