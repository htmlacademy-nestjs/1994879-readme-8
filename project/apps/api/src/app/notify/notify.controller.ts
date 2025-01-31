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
import { NotifyService } from './notify.service';

@Controller(AppRoute.Notify)
@ApiTags(SwaggerTag.Notify)
@UseFilters(AxiosExceptionFilter)
export class NotifyController {
  constructor(@Inject(NotifyService) private readonly notifyService: NotifyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.NotifyRenewalPosts })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  public async notifyRenewalPosts(@Req() req: Request, @UserId() userId: string) {
    return this.notifyService.renewalPosts(req, userId);
  }
}
