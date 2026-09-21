import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middlewares/validator';

const router = Router();

// POST /api/auth/register – Daftarkan user baru
router.post('/register', validateRegister, register);

// POST /api/auth/login – Login dan dapatkan token
router.post('/login', validateLogin, login);

// Pastikan baris ini ada di bagian paling bawah!
export default router;