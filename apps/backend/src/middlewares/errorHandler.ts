import { Request, Response, NextFunction } from "express";

// Interface cho lỗi có statusCode
interface AppError extends Error {
  statusCode?: number;
}

// Global error handler - đặt cuối cùng trong app.use()
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Lỗi máy chủ nội bộ";

  console.error(`[ERROR ${statusCode}]:`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Tạo lỗi có status code tiện lợi
export const createError = (message: string, statusCode: number): AppError => {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
};
