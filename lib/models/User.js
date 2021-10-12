const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class User {
    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.passwordHash = row.password_hash;
    }

    static async insert({ email, passwordHash }) {
        const { rows } = await pool.query(
            `INSERT INTO users
            (email, password_hash)
            VALUES ($1, $2) 
            RETURNING *;`,
            [email, passwordHash]
        );

        return new User(rows[0]);
    }

    static async findByEmail(email) {
        const { rows } = await pool.query(
            `
        SELECT * FROM users
        WHERE email=$1;`,
            [email]
        );

        return rows[0] ? new User(rows[0]) : null;
    }

    static async get(id) {
        const { rows } = await pool.query(
            `
        SELECT * FROM users WHERE id=$1;`,
            [id]
        );
        return new User(rows[0]);
    }

    authToken() {
        return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
            expiresIn: '24h',
        });
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
        };
    }
};
