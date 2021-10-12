const { Router } = require('express');
const Comment = require('../models/Comment.js');
const ensureAuth = require('../middleware/ensure-auth.js');

module.exports = Router()
    .get('/', async (req, res, next) => {
        try {
            const comments = await Comment.getAll();
            res.send(comments);
        } catch (err) {
            next(err);
        }
    })
    .post('/', ensureAuth, async (req, res, next) => {
        try {
            const comment = await Comment.create({
                userId: req.user.id,
                content: req.body.content,
            });
            res.send(comment);
        } catch (err) {
            next(err);
        }
    });
