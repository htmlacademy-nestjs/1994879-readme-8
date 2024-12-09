import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRDO } from '../rdo/user.rdo';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserRDO, excludeExtraneousValues: true })
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')

  public async create(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('')
  @SerializeOptions({ type: LoggedUserRDO, excludeExtraneousValues: true })
  public async login(@Body() dto: LoginUserDto) {
    return await this.authService.verifyUser(dto);
  }

  @Get(':id')
  @SerializeOptions({ type: UserRDO })
  public async show(@Param('id') id: string) {
    return await this.authService.getUser(id);
  }

  @Patch(':id')
  @SerializeOptions({ type: UserRDO })
  public async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return await this.authService.changePassword(id, dto);
  }
}
