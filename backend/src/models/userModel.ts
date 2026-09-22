import pool from '../config/db';

export const UserModel = {
  findByEmail: async (identifier: string) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );
    return rows[0];
  },

  create: async (username: string, email: string, passwordHash: string) => {
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId as number;
  }
};

export default UserModel;