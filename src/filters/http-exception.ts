import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  
  @Catch(HttpException)
  export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus();
  
      response.status(status).json({
        success: false,
        code: status,
        message: {
          response: {
            message: exception.message,
            error: 'Bad Request',
            statusCode: status,
          },
        },
        version: 1,
        data: null,
      });
    }
  }
  