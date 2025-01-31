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
import { AppHeader, AppRoute, SwaggerOperation, SwaggerTag } from '@project/core';
import { XUserIdGuard } from '@project/interceptors';

@ApiTags(SwaggerTag.Comment)
@Controller(AppRoute.Comment)
@SerializeOptions({ type: CommentRDO, excludeExtraneousValues: true })
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.CommentCreate })
  @ApiCreatedResponse({ type: CommentRDO, description: CommentResponseDescription.Created })
  @ApiBadRequestResponse({ description: CommentResponseDescription.BadRequest })
  async create(@Body() dto: CreateCommentDTO, @Headers(AppHeader.UserId) userId: string) {
    return this.commentService.create(dto, userId);
  }

  @Get(`:${AppRoute.PostId}`)
  @ApiOperation({ summary: SwaggerOperation.CommentList })
  @ApiOkResponse({ type: [CommentRDO], description: CommentResponseDescription.All })
  async findAll(@Param(AppRoute.PostId) postId: string) {
    return this.commentService.findAll(postId);
  }

  @Delete(`:${AppRoute.CommentId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.CommentDelete })
  @ApiNoContentResponse({ description: CommentResponseDescription.Deleted })
  @ApiNotFoundResponse({ description: CommentResponseDescription.NotFound })
  async remove(
    @Param(AppRoute.CommentId) commentId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    return this.commentService.delete(commentId, userId);
  }
}
