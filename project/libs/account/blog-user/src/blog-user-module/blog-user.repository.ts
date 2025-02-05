import { Inject, Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@project/data-access';
import { BlogUserEntity } from './blog-user.entity';
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserModel } from './blog-user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Nullable } from '@project/core';

@Injectable()
export class BlogUserRepository extends BaseMongoRepository<BlogUserEntity, BlogUserModel> {
  constructor(
    @Inject(BlogUserFactory) entityFactory: BlogUserFactory,
    @InjectModel(BlogUserModel.name) blogUserModel: Model<BlogUserModel>
  ) {
    super(entityFactory, blogUserModel);
  }

  public async findByEmail(email: string): Promise<Nullable<BlogUserEntity>> {
    const document = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(document);
  }

  public async findByIds(ids: string[]): Promise<BlogUserEntity[]> {
    const documents = await this.model.find({ _id: { $in: ids } }).exec();
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async findSubscriptions(userId: string): Promise<BlogUserEntity[]> {
    const documents = await this.model.find({ subscribers: userId }).exec();
    return documents.map((document) => this.createEntityFromDocument(document));
  }
}
