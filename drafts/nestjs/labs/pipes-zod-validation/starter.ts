import { Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class CreateTaskPipe implements PipeTransform {
  transform(value: unknown) { return value; } // BUG: no runtime parsing
}
