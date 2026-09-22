import pool from '../config/db';

export const TodoModel = {
  create: async (userId: number, task: string) => {
    try {
      const [result]: any = await pool.query(
        'INSERT INTO todos (user_id, task) VALUES (?, ?)',
        [userId, task]
      );
      return result.insertId as number;
    } catch (err) {
      const [result]: any = await pool.query(
        'INSERT INTO todos (userId, task) VALUES (?, ?)',
        [userId, task]
      );
      return result.insertId as number;
    }
  },

  findByUserId: async (userId: number, limit: number = 5, offset: number = 0) => {
    const numLimit = Number(limit) || 5;
    const numOffset = Number(offset) || 0;
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM todos WHERE user_id = ? LIMIT ${numLimit} OFFSET ${numOffset}`,
        [userId]
      );
      return rows;
    } catch (err) {
      const [rows]: any = await pool.query(
        `SELECT * FROM todos WHERE userId = ? LIMIT ${numLimit} OFFSET ${numOffset}`,
        [userId]
      );
      return rows;
    }
  },

  countByUserId: async (userId: number) => {
    try {
      const [rows]: any = await pool.query(
        'SELECT COUNT(*) as total FROM todos WHERE user_id = ?',
        [userId]
      );
      return rows[0]?.total || 0;
    } catch (err) {
      const [rows]: any = await pool.query(
        'SELECT COUNT(*) as total FROM todos WHERE userId = ?',
        [userId]
      );
      return rows[0]?.total || 0;
    }
  },

  findById: async (id: number) => {
    const [rows]: any = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id: number, task: string) => {
    await pool.query('UPDATE todos SET task = ? WHERE id = ?', [task, id]);
  },

  delete: async (id: number) => {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
  }
};

export default TodoModel;