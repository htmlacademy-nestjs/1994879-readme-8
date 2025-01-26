import { Inject, Injectable } from '@nestjs/common';
import { EmailSubscriberEntity } from './email-subscriber.entity';
import { CreateSubscriberDTO } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    @Inject(EmailSubscriberRepository)
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) {}

  public async addSubscriber(subscriber: CreateSubscriberDTO) {
    const { email } = subscriber;
    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      return existsSubscriber;
    }

    const emailSubscriber = new EmailSubscriberEntity(subscriber);
    await this.emailSubscriberRepository.save(emailSubscriber);

    return emailSubscriber;
  }

  public async findAll(): Promise<EmailSubscriberEntity[]> {
    return this.emailSubscriberRepository.findAll();
  }
}
