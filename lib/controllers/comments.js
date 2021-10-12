const { Router } = require('express');
const Comment = require('../models/Comment.js');
const ensureAuth = require('../middleware/ensure-auth.js');
const ensureAdmin = require('../middleware/ensure-admin.js');

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
    })
    .delete('/:id', ensureAuth, ensureAdmin, async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await Comment.delete(id);
            res.send(result);
        } catch (err) {
            next(err);
        }
    });
