import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        return {
          success: response?.success || true,
          code: response?.code || 200,
          message: response?.message || 'success',
          version: 1,
          data: response || null,
        };
      }),
    );
  }
}
