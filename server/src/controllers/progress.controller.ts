import { Request, Response } from 'express';
import { db } from '../db/connection';

interface AuthRequest extends Request {
    user?: any; // Add user from middleware
}

export const progressController = {
    saveProgress: async (req: AuthRequest, res: Response) => {
        const { moduleId, exerciseId, status, code } = req.body;
        const userId = req.user.id;

        if (!moduleId || !exerciseId || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            // Check if progress exists
            const existing = await db.execute({
                sql: 'SELECT * FROM progress WHERE user_id = ? AND module_id = ? AND exercise_id = ?',
                args: [userId, moduleId, exerciseId]
            });

            if (existing.rows.length > 0) {
                // Update
                await db.execute({
                    sql: 'UPDATE progress SET status = ?, last_code = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND module_id = ? AND exercise_id = ?',
                    args: [status, code, userId, moduleId, exerciseId]
                });
            } else {
                // Insert
                await db.execute({
                    sql: 'INSERT INTO progress (user_id, module_id, exercise_id, status, last_code, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
                    args: [userId, moduleId, exerciseId, status, code]
                });
            }

            res.json({ message: 'Progress saved' });
        } catch (error) {
            console.error('Save progress error:', error);
            res.status(500).json({ error: 'Failed to save progress' });
        }
    },

    getProgress: async (req: AuthRequest, res: Response) => {
        const userId = req.user.id;

        try {
            const result = await db.execute({
                sql: 'SELECT * FROM progress WHERE user_id = ?',
                args: [userId]
            });

            res.json(result.rows);
        } catch (error) {
            console.error('Get progress error:', error);
            res.status(500).json({ error: 'Failed to get progress' });
        }
    }
};
