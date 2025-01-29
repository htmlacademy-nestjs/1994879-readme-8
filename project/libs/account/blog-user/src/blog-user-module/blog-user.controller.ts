import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserRDO } from './rdo/user.rdo';
import { BlogUserService } from './blog-user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../../authentication/src/guards/jwt-auth.guard';
import { ResponseDescription } from './blog-user.constant';
import { MongoIdValidationPipe } from '@project/pipes';
import { AppRoute, SwaggerTag } from '@project/core';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { SubscribeDTO } from './dto/subscribe.dto';
import { UserId, ApiCustomResponse } from '@project/decorators';
import { SwaggerOperation } from '@project/core';
import { SwaggerProperty } from '../../../../shared/core/src/lib/constants/swagger.constant';
import { TokenName } from '@project/helpers';

@ApiTags(SwaggerTag.User)
@Controller(AppRoute.User)
@ApiBearerAuth(TokenName.Access)
@ApiCustomResponse()
@SerializeOptions({ type: UserRDO, excludeExtraneousValues: true })
export class BlogUserController {
  constructor(@Inject(BlogUserService) private blogUserService: BlogUserService) {}

  @Post('')
  @UseGuards()
  @ApiOperation({ summary: SwaggerOperation.Register })
  @ApiCreatedResponse({ description: ResponseDescription.UserCreated })
  @ApiConflictResponse({ description: ResponseDescription.UserExist })
  public async create(@Body() dto: CreateUserDTO) {
    return this.blogUserService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.GetUsers })
  @ApiOkResponse()
  public async showAll() {
    return this.blogUserService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.GetUser })
  @ApiOkResponse({ description: ResponseDescription.UserFound })
  @ApiNotFoundResponse({ description: ResponseDescription.UserNotFound })
  @ApiParam({ name: 'id', ...SwaggerProperty.userId })
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    return this.blogUserService.getById(id);
  }

  @Patch(AppRoute.Password)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.ChangePassword })
  @ApiOkResponse({ description: ResponseDescription.Updated })
  @ApiNotFoundResponse({ description: ResponseDescription.UserNotFound })
  public async update(@UserId() userId: string, @Body() dto: ChangePasswordDTO) {
    return this.blogUserService.changePassword(userId, dto);
  }

  @Post(AppRoute.Subscribe)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.Subscribe })
  @ApiOkResponse({ description: ResponseDescription.Subscribed })
  @HttpCode(HttpStatus.OK)
  public async subscribe(@UserId() userId: string, @Body() dto: SubscribeDTO) {
    return this.blogUserService.subscribe(userId, dto.userId);
  }

  @Post(AppRoute.Unsubscribe)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.Unsubscribe })
  @ApiOkResponse({ description: ResponseDescription.Subscribed })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unsubscribe(@UserId() userId: string, @Body() dto: SubscribeDTO) {
    return this.blogUserService.unsubscribe(userId, dto.userId);
  }
}
