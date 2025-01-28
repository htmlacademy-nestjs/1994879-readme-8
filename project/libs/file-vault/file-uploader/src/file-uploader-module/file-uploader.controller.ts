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
import { UploadedFileRDO } from './rdo/uploaded-file.rdo';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_RESPONSE, SWAGGER_SUMMARY } from './file-uploader.constant';
import { SwaggerTag } from '@project/core';
import { ApiFileUpload } from '@project/decorators';

@Controller('files')
@ApiTags(SwaggerTag.File)
@SerializeOptions({ type: UploadedFileRDO, excludeExtraneousValues: true })
export class FileUploaderController {
  constructor(
    @Inject(FileUploaderService) private readonly fileUploaderService: FileUploaderService
  ) {}

  @Post('/upload')
  @ApiOperation({ summary: SWAGGER_SUMMARY.UPLOAD })
  @ApiCreatedResponse({ type: UploadedFileRDO, description: SWAGGER_RESPONSE.CREATED })
  @ApiBadRequestResponse({ description: SWAGGER_RESPONSE.BAD })
  @ApiFileUpload('file')
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploaderService.saveFile(file);
  }

  @Get(':fileId')
  @ApiOkResponse({ type: UploadedFileRDO, description: SWAGGER_RESPONSE.OK })
  @ApiBadRequestResponse({ description: SWAGGER_RESPONSE.BAD })
  @ApiNotFoundResponse({ description: SWAGGER_RESPONSE.NOT_FOUND })
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    return this.fileUploaderService.getFile(fileId);
  }
}
