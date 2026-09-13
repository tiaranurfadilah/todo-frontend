import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Username sudah digunakan' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(username, email, hashedPassword);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      res.status(400).json({ success: false, message: 'Username atau password salah' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: 'Username atau password salah' });
      return;
    }

    const secretKey = process.env.JWT_SECRET || 'pwf_2026';
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: '1d',
    });

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error });
  }
};