import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan!' });
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'pwf_2026';
    const decoded: any = jwt.verify(token, secretKey);

    // Simpan userId ke res.locals agar dibaca oleh todoController
    res.locals.userId = decoded.id;

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token tidak valid!' });
  }
};