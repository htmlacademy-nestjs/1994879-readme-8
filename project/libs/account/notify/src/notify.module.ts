import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotifyService } from './notify.service';
import { ConfigSpace, getRabbitMQOptions } from '@project/app-config';

@Module({
  imports: [RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMQOptions(ConfigSpace.Rabbit))],
  providers: [NotifyService],
  exports: [NotifyService, RabbitMQModule],
})
export class NotifyModule {}
