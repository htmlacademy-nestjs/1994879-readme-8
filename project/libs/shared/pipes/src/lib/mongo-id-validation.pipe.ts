import { Types } from 'mongoose';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const ERROR_MESSAGE = {
  MONGO_ID: 'Bad entity ID',
  MISUSE: 'This pipe can only be used with route parameters.',
};

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error(ERROR_MESSAGE.MISUSE);
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ERROR_MESSAGE.MONGO_ID);
    }

    return value;
  }
}
