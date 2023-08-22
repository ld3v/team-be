import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import ResponseObject from 'common/response';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    if (status === 200) {
      response.status(200).json(
        ResponseObject.success(
          {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
          exceptionResponse.message ||
            'Unknown error happened when handle your request!',
        ),
      );
      return;
    }
    response.status(status).json(
      ResponseObject.fail(
        exceptionResponse.message ||
          'Unknown error happened when handle your request!',
        {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      ),
    );
  }
}
