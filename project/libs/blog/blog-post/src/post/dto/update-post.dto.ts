import { ApiProperty } from '@nestjs/swagger';
import { SwaggerPostProperty } from '@project/core';
import { IsDateString } from 'class-validator';

export class UpdatePostDTO {
  @IsDateString()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerPostProperty.publicationDate)
  public publicationDate: Date;
}
