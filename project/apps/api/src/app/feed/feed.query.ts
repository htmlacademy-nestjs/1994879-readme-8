import { OmitType } from '@nestjs/swagger';
import { PostQuery } from '@project/blog-post';

export class FeedQuery extends OmitType(PostQuery, ['userIds', 'postStatus'] as const) {}
