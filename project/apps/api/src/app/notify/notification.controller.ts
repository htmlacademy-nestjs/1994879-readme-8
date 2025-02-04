import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppRoute, SwaggerOperation, SwaggerTag } from '@project/core';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { UserId } from '@project/decorators';
import { JwtAuthGuard } from '@project/authentication';
import { NotificationService } from './notification.service';

@Controller(AppRoute.Notify)
@ApiTags(SwaggerTag.Notify)
@UseFilters(AxiosExceptionFilter)
export class NotificationController {
  constructor(
    @Inject(NotificationService) private readonly NotificationService: NotificationService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.NotifyRenewalPosts })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  public async notifyRenewalPosts(@Req() req: Request, @UserId() userId: string) {
    return this.NotificationService.renewalPosts(req, userId);
  }
}
