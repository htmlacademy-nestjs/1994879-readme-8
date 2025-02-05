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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppRoute, SwaggerOperation, SwaggerTag } from '@project/core';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { UserId } from '@project/decorators';
import { NotificationService } from './notification.service';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { TokenName } from '@project/helpers';

@Controller(AppRoute.Notify)
@ApiTags(SwaggerTag.Notify)
@UseFilters(AxiosExceptionFilter)
export class NotificationController {
  constructor(
    @Inject(NotificationService) private readonly notificationService: NotificationService
  ) {}

  @Post()
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOperation({ summary: SwaggerOperation.NotifyRenewalPosts })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  public async notifyRenewalPosts(@Req() req: Request, @UserId() userId: string) {
    return this.notificationService.renewalPosts(req, userId);
  }
}
