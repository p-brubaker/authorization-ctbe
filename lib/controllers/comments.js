const { Router } = require('express');

module.exports = Router().get('/', async (req, res, next) => {
    res.send('hello from get all comments');
    next();
});
