import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  LinkPostDTO,
  PhotoPostDTO,
  QuotePostDTO,
  TextPostDTO,
  VideoPostDTO,
} from '@project/blog-post';
import { PostType } from '@project/core';

@Injectable()
export class CreatePostValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.type) {
      throw new BadRequestException('Missing type field');
    }

    let dtoClass;

    switch (value.type) {
      case PostType.Video:
        dtoClass = VideoPostDTO;
        break;
      case PostType.Text:
        dtoClass = TextPostDTO;
        break;
      case PostType.Link:
        dtoClass = LinkPostDTO;
        break;
      case PostType.Photo:
        dtoClass = PhotoPostDTO;
        break;
      case PostType.Quote:
        dtoClass = QuotePostDTO;
        break;
    }

    const dtoInstance = plainToInstance(dtoClass, value);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}));
      throw new BadRequestException(errorMessages);
    }

    const validKeys = Object.keys(dtoInstance);
    const unexpectedKeys = Object.keys(value).filter((key) => !validKeys.includes(key));
    if (unexpectedKeys.length > 0) {
      throw new BadRequestException(`Unexpected properties: ${unexpectedKeys.join(', ')}`);
    }

    return dtoInstance;
  }
}
