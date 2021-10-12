module.exports = (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new Error('Not Authorized');
        next();
    } catch (err) {
        err.status = 403;
        next(err);
    }
};
