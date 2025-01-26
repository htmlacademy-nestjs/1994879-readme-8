import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  SerializeOptions,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentRDO } from './rdo/comment.rdo';
import {
  CommentApiParam,
  CommentOperationSummary,
  CommentResponseDescription,
} from './comment.constant';

@ApiTags('Routes for comments')
@Controller('posts/:postId/comments')
@SerializeOptions({ type: CommentRDO, excludeExtraneousValues: true })
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: CommentOperationSummary.Create })
  @ApiParam({ required: true, ...CommentApiParam.postId })
  @ApiResponse({ status: HttpStatus.CREATED, description: CommentResponseDescription.Created })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CommentResponseDescription.BadRequest,
  })
  async create(@Body() dto: CreateCommentDTO, @Param('postId') postId: string) {
    return this.commentService.create(postId, dto);
  }

  @Get()
  @ApiOperation({ summary: CommentOperationSummary.FindAll })
  @ApiParam({ required: true, ...CommentApiParam.postId })
  @ApiResponse({ status: HttpStatus.OK, description: CommentResponseDescription.All })
  async findAll(@Param('postId') postId: string) {
    return this.commentService.findAll(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: CommentOperationSummary.FindOne })
  @ApiResponse({ status: HttpStatus.OK, description: CommentResponseDescription.Found })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: CommentResponseDescription.NotFound })
  async findOne(@Param('id') id: string) {
    return this.commentService.getById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: CommentOperationSummary.Remove })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: CommentResponseDescription.Deleted })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: CommentResponseDescription.NotFound })
  async remove(@Param('id') id: string) {
    await this.commentService.delete(id);
  }
}
