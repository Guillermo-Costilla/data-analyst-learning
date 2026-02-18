import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection';

export const authController = {
    register: async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Check if user exists
            const existingUser = await db.execute({
                sql: 'SELECT * FROM users WHERE email = ?',
                args: [email]
            });

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await db.execute({
                sql: 'INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id, email, name, created_at',
                args: [email, hashedPassword, name]
            });

            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

            res.status(201).json({ user, token });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const result = await db.execute({
                sql: 'SELECT * FROM users WHERE email = ?',
                args: [email]
            });

            if (result.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password as string);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

            res.json({
                user: { id: user.id, email: user.email, name: user.name },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
};
