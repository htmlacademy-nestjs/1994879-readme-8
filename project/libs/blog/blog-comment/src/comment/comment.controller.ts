import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  SerializeOptions,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommentRDO } from './rdo/comment.rdo';
import { CommentResponseDescription } from './comment.constant';
import {
  AppHeader,
  AppRoute,
  PaginationQuery,
  PaginationRDO,
  SwaggerOperation,
  SwaggerTag,
} from '@project/core';
import { XUserIdGuard } from '@project/interceptors';
import { CommentWithPaginationRDO } from './rdo/comment-with-pagination.rdo';

@ApiTags(SwaggerTag.Comment)
@Controller(AppRoute.Comment)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.CommentCreate })
  @ApiCreatedResponse({ type: CommentRDO, description: CommentResponseDescription.Created })
  @ApiBadRequestResponse({ description: CommentResponseDescription.BadRequest })
  @SerializeOptions({ type: CommentRDO, excludeExtraneousValues: true })
  async create(@Body() dto: CreateCommentDTO, @Headers(AppHeader.UserId) userId: string) {
    return this.commentService.create(dto, userId);
  }

  @Get(`:${AppRoute.PostId}`)
  @ApiOperation({ summary: SwaggerOperation.CommentList })
  @ApiOkResponse({ type: CommentWithPaginationRDO, description: CommentResponseDescription.All })
  @SerializeOptions({ type: CommentWithPaginationRDO, excludeExtraneousValues: true })
  async findByPostId(@Param(AppRoute.PostId) postId: string, @Query() pagination: PaginationQuery) {
    const result = await this.commentService.findByPostId(postId, pagination);
    return result;
  }

  @Delete(`:${AppRoute.CommentId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.CommentDelete })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: CommentResponseDescription.Deleted })
  @ApiNotFoundResponse({ description: CommentResponseDescription.NotFound })
  async remove(
    @Param(AppRoute.CommentId) commentId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    return this.commentService.delete(commentId, userId);
  }
}
