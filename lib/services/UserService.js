const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
    static async create({ email, password }) {
        const userExists = await User.findByEmail(email);

        if (userExists) {
            throw new Error('There is already a user with this email');
        }

        const passwordHash = await bcrypt.hash(
            password,
            Number(process.env.SALT_ROUNDS)
        );

        const user = await User.insert({
            email,
            passwordHash,
        });

        return user;
    }

    static async authorize({ email, password }) {
        const user = await User.findByEmail(email);

        if (!user) {
            throw new Error('Invalid email/password combination');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            throw new Error('Invalid email/password combination');
        }

        return user;
    }
};
