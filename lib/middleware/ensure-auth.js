const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const { session } = req.cookies;

        req.user = jwt.verify(session, process.env.APP_SECRET);

        next();
    } catch (err) {
        err.status = 401;
        next(err);
    }

    next();
};
