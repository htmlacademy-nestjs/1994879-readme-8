import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotifyService } from './notify.service';
import { ConfigSpace, getRabbitMQOptions, rabbitMQConfig } from '@project/app-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [rabbitMQConfig],
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMQOptions(ConfigSpace.Rabbit)),
  ],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
