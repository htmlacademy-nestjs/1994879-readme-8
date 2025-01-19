import 'multer';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ensureDir } from 'fs-extra';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FileVaultConfig } from '@project/file-vault-config';
import { randomUUID } from 'node:crypto';
import { extension } from 'mime-types';
import { FileUploaderRepository } from './file-uploader.repository';
import { StoredFile } from '@project/core';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileUploaderEntity } from './file-uploader.entity';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);

  constructor(
    @Inject(FileVaultConfig.KEY) private readonly config: ConfigType<typeof FileVaultConfig>,
    @Inject(FileUploaderRepository) private readonly fileRepository: FileUploaderRepository
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getSubUploadDirectoryPath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return join(year.toString(), month);
  }

  private getDestinationFilePath(filename: string): string {
    return join(this.getUploadDirectoryPath(), this.getSubUploadDirectoryPath(), filename);
  }

  public async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const subDirectory = this.getSubUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);
      const filename = `${randomUUID()}.${fileExtension}`;

      const path = this.getDestinationFilePath(filename);

      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(path, file.buffer);

      return {
        fileExtension,
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new Error(`Can't save file`);
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<FileUploaderEntity> {
    const storedFile = await this.writeFile(file);
    const fileEntity = new FileUploaderFactory().create({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
      createdAt: undefined,
      updatedAt: undefined,
    });

    await this.fileRepository.save(fileEntity);
    return fileEntity;
  }

  public async getFile(fileId: string): Promise<FileUploaderEntity> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new NotFoundException(`File with ${fileId} not found.`);
    }

    return file;
  }
}
