import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppRoute, SwaggerOperation, SwaggerResponse, SwaggerTag } from '@project/core';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { ApiCustomResponse, UserId } from '@project/decorators';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { TokenName } from '@project/helpers';
import { SubscribeDTO } from '@project/blog-user';
import { FeedService } from './feed.service';
import { BlogPostWithPaginationRDO } from '../rdo/blog-post-witt-pagination.rdo';
import { FeedQuery } from './feed.query';

@Controller(`${AppRoute.Blog}/${AppRoute.Feed}`)
@ApiTags(SwaggerTag.Feed)
@UseFilters(AxiosExceptionFilter)
@ApiCustomResponse()
export class FeedController {
  constructor(@Inject(FeedService) private readonly feedService: FeedService) {}

  @Post(AppRoute.Subscribe)
  @ApiOperation({ summary: SwaggerOperation.Subscribe })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  public async subscribe(@Body() dto: SubscribeDTO, @Req() req: Request) {
    return this.feedService.subscribe(dto, req);
  }

  @Post(AppRoute.Unsubscribe)
  @ApiOperation({ summary: SwaggerOperation.Unsubscribe })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unsubscribe(@Body() dto: SubscribeDTO, @Req() req: Request) {
    return this.feedService.unsubscribe(dto, req);
  }

  @Get()
  @ApiOperation({ summary: SwaggerOperation.Feed })
  @ApiOkResponse({ type: BlogPostWithPaginationRDO, description: SwaggerResponse.Feed })
  @SerializeOptions({ type: BlogPostWithPaginationRDO, excludeExtraneousValues: true })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async getUserFeed(
    @Query() query: FeedQuery,
    @UserId() userId: string,
    @Req() req: Request
  ) {
    return this.feedService.feed(userId, query, req);
  }
}
