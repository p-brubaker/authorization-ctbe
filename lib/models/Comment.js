const pool = require('../utils/pool.js');

module.exports = class Comment {
    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.content = row.content;
    }

    static async create({ content, userId }) {
        const { rows } = await pool.query(
            `INSERT INTO comments
            (content, user_id)
            VALUES ($1, $2)
            RETURNING *;`,
            [content, userId]
        );

        return new Comment(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM comments;');
        return rows.map((row) => new Comment(row));
    }

    static async delete(id) {
        const { rows } = await pool.query('DELETE FROM comments WHERE id=$1;', [
            id,
        ]);

        return rows[0] ? new Comment(rows[0]) : null;
    }
};
