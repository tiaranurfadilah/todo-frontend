import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, username, email, password } = req.body;
  const userName = name || username;

  if (!userName || !email || !password) {
    sendError(res, 'Nama/username, email, dan password wajib diisi', 400);
    return;
  }

  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      sendError(res, 'Email sudah terdaftar!', 400);
      return;
    }

    const userId = await UserModel.create(userName, email, password);

    sendSuccess(res, 'Registrasi berhasil!', { id: userId, name: userName, email }, 201);
  } catch (error) {
    console.error(error);
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, name } = req.body;
  const identifier = email || username || name;

  if (!identifier || !password) {
    sendError(res, 'Email/username dan password wajib diisi', 400);
    return;
  }

  try {
    const user = await UserModel.findByEmail(identifier);
    if (!user) {
      sendError(res, 'Email atau password salah!', 401);
      return;
    }

    if (user.password !== password) {
      sendError(res, 'Email atau password salah!', 401);
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    sendSuccess(res, 'Login berhasil!', {
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};