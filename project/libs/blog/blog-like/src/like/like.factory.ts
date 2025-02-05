import { Injectable } from '@nestjs/common';
import { EntityFactory, Like } from '@project/core';
import { LikeEntity } from './like.entity';
import { LikeDTO } from './dto/like.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LikeFactory implements EntityFactory<LikeEntity> {
  create(entityPlainData: Like): LikeEntity {
    return new LikeEntity(entityPlainData);
  }

  createFromDTO(dto: LikeDTO) {
    const entity = plainToClass(LikeEntity, dto);
    return entity;
  }
}
