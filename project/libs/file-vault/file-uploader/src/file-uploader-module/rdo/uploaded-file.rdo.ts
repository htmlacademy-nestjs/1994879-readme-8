import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadedFileRdo {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public originalName: string;

  @Expose()
  @ApiProperty()
  public hashName: string;

  @Expose()
  @ApiProperty()
  public subDirectory: string;

  @Expose()
  @ApiProperty()
  public mimetype: string;

  @Expose()
  @ApiProperty()
  public size: number;
}
