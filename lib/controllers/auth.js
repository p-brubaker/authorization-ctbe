const { Router } = require('express');
const UserService = require('../services/UserService');
const User = require('../models/User.js');
const ensureAuth = require('../middleware/ensure-auth.js');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
    .post('/signup', async (req, res, next) => {
        try {
            const user = await UserService.create(req.body);
            res.send(user.toJSON());
        } catch (err) {
            if (err.message === 'There is already a user with this email') {
                err.status = 400;
            }
            next(err);
        }
    })
    .post('/signin', async (req, res, next) => {
        try {
            const user = await UserService.authorize(req.body);
            res.cookie('userId', user.id, {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
            });
            res.send(user.toJSON());
        } catch (err) {
            err.status = 401;
            next(err);
        }
    })
    .get('/me', ensureAuth, async (req, res, next) => {
        try {
            const userId = req.userId; // cookie sent
            const user = await User.get(userId); // stored cookie
            res.send(user.toJSON());
        } catch (err) {
            next(err);
        }
    });
