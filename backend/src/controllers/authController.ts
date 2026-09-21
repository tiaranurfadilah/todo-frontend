import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email sudah digunakan!' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(name, email, hashedPassword);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(400).json({ success: false, message: 'Email atau password salah!' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: 'Email atau password salah!' });
      return;
    }

    const secretKey = process.env.JWT_SECRET || 'pwf_2026';
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: '1d',
    });

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};