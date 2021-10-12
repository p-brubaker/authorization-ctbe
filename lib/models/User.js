const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');
const Role = require('./Role.js');

module.exports = class User {
    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.passwordHash = row.password_hash;
        this.role = row.role;
    }

    static async insert({ email, passwordHash, roleTitle }) {
        const role = await Role.findByTitle(roleTitle);

        const { rows } = await pool.query(
            `INSERT INTO users
            (email, password_hash, role_id)
            VALUES ($1, $2, $3) 
            RETURNING *;`,
            [email, passwordHash, role.id]
        );

        return new User({ ...rows[0], role: role.title });
    }

    static async findByEmail(email) {
        const { rows } = await pool.query(
            `
        SELECT * FROM users
        WHERE email=$1;`,
            [email]
        );

        if (!rows[0]) return null;
        const role = await Role.findById(rows[0].role_id);
        return new User({ ...rows[0], role: role.title });
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
            role: this.role,
        };
    }
};
