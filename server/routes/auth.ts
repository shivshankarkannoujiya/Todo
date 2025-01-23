import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticateJwt, SECRET } from '../middleware/';
import { User } from '../db';
import { signupInput } from '@shiv143/common';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const parsedResponse = signupInput.safeParse(req.body);
    if (!parsedResponse.success) {
        return res.status(403).json({
            message: 'Invalid inputs',
        });
    }

    const username = parsedResponse.data.username;
    const password = parsedResponse.data.password;

    const user = await User.findOne({ username: username });
    if (user) {
        return res.status(403).json({
            message: 'User already exist',
        });
    }

    const newUser = await User.create({
        username,
        password,
    });

    jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
    res.status(211).json({
        message: 'User created successfully !',
        useId: newUser._id,
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
        return res.status(404).json({
            message: 'User not found !',
        });
    }

    jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

    return res.status(200).json({
        message: 'User logged In successfully',
    });
});

router.get('/me', authenticateJwt, async (req, res) => {
    const userId = req.headers['userId'];
    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(404).json({
            message: 'Invalid User',
        });
    }

    return res.status(200).json({
        username: user.username,
    });
});

export default router;
