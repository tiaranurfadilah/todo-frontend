import { Response } from 'express';
import { TodoModel } from '../models/todoModel';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const todos = await TodoModel.getByUserId(userId);

    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error });
  }
};

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { task } = req.body;
    const todoId = await TodoModel.create(userId, task);

    res.status(201).json({
      success: true,
      message: 'Tugas berhasil ditambahkan!',
      data: {
        id: todoId,
        task,
        is_completed: false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error });
  }
};