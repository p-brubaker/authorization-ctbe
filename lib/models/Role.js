const pool = require('../utils/pool');

module.exports = class Role {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM roles WHERE id=$1', [
            id,
        ]);

        return rows[0] ? new Role(rows[0]) : null;
    }

    static async findByTitle(title) {
        const { rows } = await pool.query(
            `
        SELECT * FROM roles
        WHERE title=$1`,
            [title]
        );

        return rows[0] ? new Role(rows[0]) : null;
    }
};
