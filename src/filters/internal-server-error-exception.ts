import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Check if the exception message is 'Provider Unavailable'
    if (exception.message === 'Provider Unavailable') {
      // Set status code to 503 for Service Unavailable
      const status = 503;

      response.status(status).json({
        success: false,
        code: status,
        message: 'Provider Unavailable', // Set the custom error message
        version: 1,
        data: null,
      });
    } else {
      // If the exception message is not 'Provider Unavailable', pass it through
      response.status(exception.getStatus()).json({
        success: false,
        code: exception.getStatus(),
        message: exception.message,
        version: 1,
        data: null,
      });
    }
  }
}
