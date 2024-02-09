import { AppError } from './app-error';

export class InvalidRequest extends AppError {
  constructor(msg: string) {
    super(msg, 400, 'invalid-request-error');
  }
}
