import Express from 'express';
import { AppError } from '../errors/app-error';


interface ApiResponse {
  type: string;
  message: string;
  data?: any;

}

export class ResponseHelper {


  public static sendError(res: Express.Response, code: number, errorType: string, message: string) {
    res.status(code || 500);
    const response: ApiResponse = {
      message,
      type: errorType || 'error'
    };
    res.json(response);
  }


  public static throwError(code: number, errorType: string, message: string) {
    const error = new AppError(message);
    error.code = code;
    error.errorType = errorType;
    throw error;
  }

  public static sendSuccess(req: Express.Request, res: Express.Response, message: string, data: any) {

    res.status(200);
    const response: ApiResponse = {
      data,
      message,
      type: 'success',
    };


    res.json(response);
  }
}

