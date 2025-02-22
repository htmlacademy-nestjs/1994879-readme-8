import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthUser } from '@project/core';

@Schema({
  collection: 'accounts',
  timestamps: true,
})
export class BlogUserModel extends Document implements AuthUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  registrationDate: Date;

  @Prop()
  subscribers: string[];

  @Prop()
  subscribersNotifyDate: Date;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
