import type { Response } from 'express';

interface Meta {
  timestamp: string;
}

export const sendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode = 200
) => {
  const meta: Meta = {
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    meta
  });
};

export const sendSuccessPagination = (
  res: Response,
  message: string,
  data: any,
  pagination: any,
  statusCode = 200
) => {
  const meta: Meta = {
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
    meta
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: any
) => {
  const meta: Meta = {
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    meta
  });
};