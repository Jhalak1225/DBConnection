import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../utils/dbConnect';
import { users } from '../types/user';
import UserModel from '../models/user.models';

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  await dbConnect();

  const { email, name, password, user_type_id, role } = req.body;

  // Validate role
  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, teacher, or student.' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: users = { email, name, password: hashedPassword, user_type_id, role };

  try {
    const User = await UserModel.create(user);

    const token = jwt.sign(
      { email: User.email, role: User.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: User });
  } catch (err) {
    res.status(500).json({ error: 'User creation failed', details: err });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  await dbConnect();

  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not present' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  res.json({ token, role: user.role });
});

export default router;
