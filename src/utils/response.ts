import { Response } from 'express';
import { ApiResponse } from '../types';

export function success<T>(res: Response, data: T, statusCode = 200, message?: string) {
  const body: ApiResponse<T> = { success: true, data, message };
  return res.status(statusCode).json(body);
}

export function created<T>(res: Response, data: T, message?: string) {
  return success(res, data, 201, message);
}

export function noContent(res: Response) {
  return res.status(200).json({ success: true, message: 'Deleted successfully' });
}

export function badRequest(res: Response, message: string, errors?: string[]) {
  const body: ApiResponse = { success: false, message, errors };
  return res.status(400).json(body);
}

export function unauthorized(res: Response, message = 'Unauthorized') {
  const body: ApiResponse = { success: false, message };
  return res.status(401).json(body);
}

export function forbidden(res: Response, message = 'Forbidden: insufficient permissions') {
  const body: ApiResponse = { success: false, message };
  return res.status(403).json(body);
}

export function notFound(res: Response, message = 'Resource not found') {
  const body: ApiResponse = { success: false, message };
  return res.status(404).json(body);
}

export function conflict(res: Response, message: string) {
  const body: ApiResponse = { success: false, message };
  return res.status(409).json(body);
}

export function serverError(res: Response, message = 'Internal server error') {
  const body: ApiResponse = { success: false, message };
  return res.status(500).json(body);
}
