import { Express } from 'express';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploaderService } from './file-uploader.service';
import { MongoIdValidationPipe } from '@project/pipes';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_RESPONSE, SWAGGER_SUMMARY } from './file-uploader.constant';

@Controller('files')
@ApiTags('Works with files')
@SerializeOptions({ type: UploadedFileRdo, excludeExtraneousValues: true })
export class FileUploaderController {
  constructor(
    @Inject(FileUploaderService) private readonly fileUploaderService: FileUploaderService
  ) {}

  @Post('/upload')
  @ApiOperation({ summary: SWAGGER_SUMMARY.UPLOAD })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UploadedFileRdo,
    description: SWAGGER_RESPONSE.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: SWAGGER_RESPONSE.BAD })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploaderService.saveFile(file);
  }

  @Get(':fileId')
  @ApiResponse({ status: HttpStatus.OK, type: UploadedFileRdo, description: SWAGGER_RESPONSE.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: SWAGGER_RESPONSE.BAD })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: SWAGGER_RESPONSE.NOT_FOUND })
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    return this.fileUploaderService.getFile(fileId);
  }
}
