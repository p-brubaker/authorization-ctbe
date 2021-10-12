const { Router } = require('express');
const Comment = require('../models/Comment.js');

module.exports = Router().get('/', async (req, res, next) => {
    try {
        const comments = await Comment.getAll();
        res.send(comments);
    } catch (err) {
        next(err);
    }
});
