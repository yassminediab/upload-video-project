import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse() as any;
    response.status(status).json({
      success: false,
      code: status,
      message: Array.isArray(errors.message)
        ? errors.message[0]
        : errors.message,
      version: 1,
      data: null,
    });
  }
}
