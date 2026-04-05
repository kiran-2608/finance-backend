import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { badRequest } from '../utils/response';

type Target = 'body' | 'query' | 'params';

/**
 * validate — Zod schema validation middleware factory.
 *
 * @param schema  - Zod schema to validate against
 * @param target  - Which part of the request to validate ('body' | 'query' | 'params')
 *
 * On success, replaces req[target] with the parsed (and coerced) value.
 * On failure, returns 400 with a list of validation error messages.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map(
        e => `${e.path.join('.')}: ${e.message}`
      );
      badRequest(res, 'Validation failed', errors);
      return;
    }

    // Replace with parsed/coerced data (e.g. string "1" → number 1 for query params)
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
