const { Comment, Image } = require('../models');

module.exports = {
    async newest() {
        const comments = await Comment.find().limit(5).sort({ timestamp: -1 });

        for (const comment of comments) {
            const image = Image.findOne({ _id: comment._id });
            comment.image = image;
        }
        return comments;
    }
};
