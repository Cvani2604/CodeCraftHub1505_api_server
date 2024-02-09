
export class AppError extends Error {
  public code: number;
  public errorType: string;
  public message: string;

  constructor(message: string, code: number = 500, type: string = 'error') {
    super(message);
    this.message = message;
    this.code = code;
    this.errorType = type;
  }
}
