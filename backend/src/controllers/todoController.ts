import type { Request, Response } from 'express';
import TodoModel from '../models/todoModel';
import { sendSuccess, sendError } from '../utils/response';

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { task, title } = req.body;
  const todoTask = task || title;
  const userId = res.locals.userId;

  if (!userId) {
    sendError(res, 'Akses ditolak! Token tidak valid atau belum diisi.', 401);
    return;
  }

  if (!todoTask) {
    sendError(res, 'Task/Judul todo wajib diisi!', 400);
    return;
  }

  try {
    const newId = await TodoModel.create(userId, todoTask);
    sendSuccess(res, 'Berhasil menambahkan todo!', { id: newId, task: todoTask }, 201);
  } catch (error) {
    console.error('ERROR CREATE TODO:', error);
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.userId;

  if (!userId) {
    sendError(res, 'Akses ditolak! Token tidak valid atau belum diisi.', 401);
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.perPage as string) || 5;
  const offset = (page - 1) * limit;

  try {
    const todos = await TodoModel.findByUserId(userId, limit, offset);
    const total = await TodoModel.countByUserId(userId);

    // Menggabungkan data & pagination ke dalam 1 parameter objek (3rd argument)
    sendSuccess(
      res,
      'Berhasil mengambil daftar todo',
      {
        todos,
        pagination: {
          page,
          perPage: limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      200
    );
  } catch (error) {
    console.error('ERROR GET TODOS:', error);
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await TodoModel.findById(Number(req.params.id));
    if (!todo) {
      sendError(res, 'Todo tidak ditemukan', 404);
      return;
    }
    sendSuccess(res, 'Detail todo', todo, 200);
  } catch (error) {
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { task } = req.body;
    await TodoModel.update(Number(req.params.id), task);
    sendSuccess(res, 'Berhasil memperbarui todo', null, 200);
  } catch (error) {
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    await TodoModel.delete(Number(req.params.id));
    sendSuccess(res, 'Berhasil menghapus todo', null, 200);
  } catch (error) {
    sendError(res, 'Terjadi kesalahan pada server.', 500);
  }
};