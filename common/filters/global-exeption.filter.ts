import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExeptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message: any = 'Nesto je poslo po zlu na serveru';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    const responseMessage =
      typeof message === 'string' ? message : message.message || message;

    console.error({
      exception,
      timestamp: new Date().toDateString(),
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message: responseMessage,
      timestamp: new Date().toDateString(),
    });
  }
}
