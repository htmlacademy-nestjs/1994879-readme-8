import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostOperationSummary, PostResponseDescription } from './post.constant';
import { PostRdo } from './rdo/post.rdo';

@ApiTags('Routes for posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: PostRdo, excludeExtraneousValues: true })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: PostOperationSummary.Create })
  @ApiResponse({ status: HttpStatus.CREATED, description: PostResponseDescription.Created })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PostResponseDescription.BadRequest })
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: PostOperationSummary.FindAll })
  @ApiResponse({ status: HttpStatus.OK, description: PostResponseDescription.AllPosts })
  async findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: PostOperationSummary.FindOne })
  @ApiResponse({ status: HttpStatus.OK, description: PostResponseDescription.Found })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: PostOperationSummary.Update })
  @ApiResponse({ status: HttpStatus.OK, description: PostResponseDescription.Updated })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: PostOperationSummary.Remove })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: PostResponseDescription.Deleted })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async remove(@Param('id') id: string) {
    await this.postService.remove(id);
  }
}
