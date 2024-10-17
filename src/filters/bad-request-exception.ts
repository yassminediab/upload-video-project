import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors = exception.getResponse() as any;
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      code: status,
      message: errors.message,
      version: 1,
      data: null,
    });
  }
}
