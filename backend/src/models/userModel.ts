import pool from '../config/db';

export const UserModel = {
  // Mencari user berdasarkan email
  findByEmail: async (email: string) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Menambahkan user baru saat registrasi
  create: async (name: string, email: string, passwordHash: string) => {
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return result.insertId;
  }
};