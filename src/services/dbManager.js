import { db } from './database.js';

export const dbManager = {
    async saveScript(name, content, type) {
        await db.query(
            'INSERT INTO user_scripts (name, content, type) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET content = $2',
            [name, content, type]
        );
    },
    async getScript(name) {
        const res = await db.query('SELECT content FROM user_scripts WHERE name = $1', [name]);
        return res.rows[0] ? res.rows[0].content : null;
    }
};
