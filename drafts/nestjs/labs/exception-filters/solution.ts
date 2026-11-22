import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
@Catch(HttpException)
export class SafeHttpFilter implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<{ status: (n: number) => any; send: (x: unknown) => void }>();
    reply.status(error.getStatus()).send({ error: 'REQUEST_FAILED', statusCode: error.getStatus() });
  }
}
