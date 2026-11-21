import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';
const Body = z.object({ title: z.string().trim().min(3).max(100) });
@Injectable()
export class CreateTaskPipe implements PipeTransform {
  transform(value: unknown) {
    const result = Body.safeParse(value);
    if (!result.success) throw new BadRequestException('Invalid task input');
    return result.data;
  }
}
