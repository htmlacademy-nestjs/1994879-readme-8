import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppHeader,
  AppRoute,
  SwaggerOperation,
  SwaggerPostProperty,
  SwaggerResponse,
  SwaggerTag,
} from '@project/core';
import { LikeService } from './like.service';
import { XUserIdGuard } from '@project/interceptors';

@ApiTags(SwaggerTag.Like)
@Controller(AppRoute.Like)
export class LikeController {
  constructor(@Inject(LikeService) private readonly likeService: LikeService) {}

  @Post(`:${AppRoute.PostId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.Like })
  @ApiOkResponse({ description: SwaggerResponse.LikeSuccess })
  @HttpCode(HttpStatus.OK)
  @ApiConflictResponse({ description: SwaggerResponse.LikeExists })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async likePost(
    @Param(AppRoute.PostId) postId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    return this.likeService.like(postId, userId);
  }

  @Delete(`:${AppRoute.PostId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.Unlike })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerResponse.LikeDeleted })
  @ApiNotFoundResponse({ description: SwaggerResponse.LikeNotFound })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async unlikePost(
    @Param(AppRoute.PostId) postId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    await this.likeService.unlike(postId, userId);
  }
}
