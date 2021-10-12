const { Router } = require('express');
const UserService = require('../services/UserService');
const ensureAuth = require('../middleware/ensure-auth.js');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
    .post('/signup', async (req, res, next) => {
        try {
            const user = await UserService.create({
                ...req.body,
                roleTitle: 'USER',
            });
            res.cookie('session', user.authToken(), {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
            });
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
            res.cookie('session', user.authToken(), {
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
            // If the user has a valid cookie, req should have the user prop
            // added by ensureAuth middleware
            res.send(req.user);
        } catch (err) {
            next(err);
        }
    });
